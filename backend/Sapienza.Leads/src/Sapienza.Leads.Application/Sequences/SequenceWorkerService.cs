using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Threading;
using Volo.Abp.Json;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Volo.Abp.Timing;
using Volo.Abp.Guids;
using Volo.Abp.Linq;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Events;

namespace Sapienza.Leads.Sequences;

public class SequenceWorkerService : AsyncPeriodicBackgroundWorkerBase
{
    private readonly IRepository<SequenceExecution, Guid> _executionRepository;
    private readonly IRepository<Sequence, Guid> _sequenceRepository;
    private readonly IRepository<Lead, Guid> _leadRepository;
    private readonly IMessageGateway _messageGateway;
    private readonly IResponseClassifier _responseClassifier;
    private readonly IJsonSerializer _jsonSerializer;
    private readonly IRepository<Event, Guid> _eventRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IClock _clock;
    private readonly ICurrentTenant _currentTenant;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public SequenceWorkerService(
        AbpAsyncTimer timer,
        IServiceScopeFactory serviceScopeFactory,
        IRepository<SequenceExecution, Guid> executionRepository,
        IRepository<Sequence, Guid> sequenceRepository,
        IRepository<Lead, Guid> leadRepository,
        IMessageGateway messageGateway,
        IResponseClassifier responseClassifier,
        IJsonSerializer jsonSerializer,
        IRepository<Event, Guid> eventRepository,
        IGuidGenerator guidGenerator,
        IClock clock,
        ICurrentTenant currentTenant,
        IAsyncQueryableExecuter asyncExecuter)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 30000; // 30 seconds
        _executionRepository = executionRepository;
        _sequenceRepository = sequenceRepository;
        _leadRepository = leadRepository;
        _messageGateway = messageGateway;
        _responseClassifier = responseClassifier;
        _jsonSerializer = jsonSerializer;
        _eventRepository = eventRepository;
        _guidGenerator = guidGenerator;
        _clock = clock;
        _currentTenant = currentTenant;
        _asyncExecuter = asyncExecuter;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        Logger.LogInformation("Processing sequence executions...");

        // 1. Find executions to process
        // Status = Running (needs next step)
        // Status = WaitingDelay (time reached)
        // Status = WaitingReply (timeout reached)
        
        var now = _clock.Now;
        
        var executions = await _executionRepository.GetListAsync(e =>
            (e.Status == ExecutionStatus.Running && e.NextActionAt == null) ||
            (e.NextActionAt != null && e.NextActionAt <= now && 
             (e.Status == ExecutionStatus.Running || 
              e.Status == ExecutionStatus.WaitingDelay || 
              e.Status == ExecutionStatus.WaitingReply))
        );

        if (!executions.Any())
        {
            return;
        }

        foreach (var execution in executions)
        {
            try
            {
                using (_currentTenant.Change(execution.TenantId))
                {
                    await ProcessExecutionAsync(execution);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error processing sequence execution {ExecutionId}", execution.Id);
                execution.Fail();
                await _executionRepository.UpdateAsync(execution);
            }
        }
    }

    private async Task ProcessExecutionAsync(SequenceExecution execution)
    {
        var sequence = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var seq = await _asyncExecuter.FirstOrDefaultAsync(sequence, s => s.Id == execution.SequenceId);
        
        if (seq == null || !seq.IsActive)
        {
            execution.Cancel();
            await _executionRepository.UpdateAsync(execution);
            return;
        }

        var steps = seq.Steps.OrderBy(s => s.Order).ToList();
        
        // Loop to execute steps that can be run immediately
        while (execution.Status == ExecutionStatus.Running || 
               (execution.Status == ExecutionStatus.WaitingDelay && execution.NextActionAt <= _clock.Now) ||
               (execution.Status == ExecutionStatus.WaitingReply && execution.NextActionAt <= _clock.Now))
        {
            if (execution.CurrentStepIndex >= steps.Count)
            {
                execution.Complete();
                await _executionRepository.UpdateAsync(execution);
                break;
            }

            var currentStep = steps[execution.CurrentStepIndex];
            var stepProcessed = await ExecuteStepAsync(execution, currentStep, steps);

            await _executionRepository.UpdateAsync(execution);

            if (!stepProcessed)
            {
                break; // Step is waiting for something (delay or reply)
            }
        }
    }

    private async Task<bool> ExecuteStepAsync(SequenceExecution execution, SequenceStep step, List<SequenceStep> allSteps)
    {
        Logger.LogInformation("Executing step {StepOrder} ({StepType}) for execution {ExecutionId}", 
            step.Order, step.Type, execution.Id);

        var lead = await _leadRepository.GetAsync(execution.LeadId);

        switch (step.Type)
        {
            case StepType.SendMessage:
                return await HandleSendMessageAsync(execution, step, lead);

            case StepType.Wait:
                return HandleWait(execution, step);

            case StepType.WaitForReply:
                return HandleWaitForReply(execution, step);

            case StepType.UpdateStatus:
                return await HandleUpdateStatusAsync(execution, step, lead);

            case StepType.AddNote:
                return await HandleAddNoteAsync(execution, step, lead);

            case StepType.ClassifyResponse:
                return await HandleClassifyResponseAsync(execution, step, lead);

            case StepType.Condition:
                return HandleCondition(execution, step, allSteps);

            default:
                execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Skipped, _clock.Now, "Unknown step type");
                execution.AdvanceToStep(execution.CurrentStepIndex + 1);
                return true;
        }
    }

    private async Task<bool> HandleSendMessageAsync(SequenceExecution execution, SequenceStep step, Lead lead)
    {
        var config = _jsonSerializer.Deserialize<SendMessageConfig>(step.Config ?? "{}");
        var content = ReplacePlaceholders(config.Content ?? "", lead);

        var result = await _messageGateway.SendTextAsync(lead.Telefone ?? "", content);

        if (result.Success)
        {
            execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now, _jsonSerializer.Serialize(result));
            execution.AdvanceToStep(execution.CurrentStepIndex + 1);
            
            // Log as Event
            await _eventRepository.InsertAsync(new Event(
                _guidGenerator.Create(),
                lead.Id,
                EventType.WhatsApp,
                "Mensagem Enviada",
                $"Sequência automação: {content}",
                _clock.Now,
                "#10b981", // Emerald
                "send",
                null, // UserId
                execution.TenantId
            ));

            return true;
        }
        else
        {
            Logger.LogWarning("Failed to send message for execution {ExecutionId}: {Error}", execution.Id, result.Error);
            execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Failed, _clock.Now, _jsonSerializer.Serialize(result));
            execution.Fail();
            return false;
        }
    }

    private bool HandleWait(SequenceExecution execution, SequenceStep step)
    {
        if (execution.Status == ExecutionStatus.WaitingDelay)
        {
            // Already waited
            execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now);
            execution.AdvanceToStep(execution.CurrentStepIndex + 1);
            execution.SetRunning();
            return true;
        }

        var config = _jsonSerializer.Deserialize<WaitConfig>(step.Config ?? "{}");
        var resumeAt = _clock.Now.AddHours(config.Hours > 0 ? config.Hours : 24);
        
        execution.SetWaitingDelay(resumeAt);
        return false;
    }

    private bool HandleWaitForReply(SequenceExecution execution, SequenceStep step)
    {
        if (execution.Status == ExecutionStatus.WaitingReply)
        {
            // Timeout reached
            var config = _jsonSerializer.Deserialize<WaitForReplyConfig>(step.Config ?? "{}");
            
            execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.TimedOut, _clock.Now);
            
            if (config.OnTimeout == "stop")
            {
                execution.Complete();
            }
            else
            {
                execution.AdvanceToStep(execution.CurrentStepIndex + 1);
                execution.SetRunning();
            }
            return true;
        }

        var waitConfig = _jsonSerializer.Deserialize<WaitForReplyConfig>(step.Config ?? "{}");
        var timeoutAt = _clock.Now.AddHours(waitConfig.TimeoutHours > 0 ? waitConfig.TimeoutHours : 24);
        
        execution.SetWaitingReply(timeoutAt);
        return false;
    }

    private async Task<bool> HandleUpdateStatusAsync(SequenceExecution execution, SequenceStep step, Lead lead)
    {
        var config = _jsonSerializer.Deserialize<UpdateStatusConfig>(step.Config ?? "{}");
        
        // This is a bit simplified as it should probably use a LeadAppService or DomainService
        // But for mock/P6 we just update the property if accessible or through repository
        // Current Lead entity might need a method to update status
        
        lead.SetStatus((LeadStatus)config.Status);
        await _leadRepository.UpdateAsync(lead);

        execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now);
        execution.AdvanceToStep(execution.CurrentStepIndex + 1);
        return true;
    }

    private async Task<bool> HandleAddNoteAsync(SequenceExecution execution, SequenceStep step, Lead lead)
    {
        var config = _jsonSerializer.Deserialize<AddNoteConfig>(step.Config ?? "{}");
        
        await _eventRepository.InsertAsync(new Event(
            _guidGenerator.Create(),
            lead.Id,
            EventType.Nota,
            "Nota Automática",
            config.NoteContent ?? "Registrado via automação",
            _clock.Now,
            "#f59e0b", // Amber
            "file-text",
            null, // UserId
            execution.TenantId
        ));

        execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now);
        execution.AdvanceToStep(execution.CurrentStepIndex + 1);
        return true;
    }

    private async Task<bool> HandleClassifyResponseAsync(SequenceExecution execution, SequenceStep step, Lead lead)
    {
        if (string.IsNullOrEmpty(execution.LastReply))
        {
            execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Skipped, _clock.Now, "No reply to classify");
            execution.AdvanceToStep(execution.CurrentStepIndex + 1);
            return true;
        }

        var result = await _responseClassifier.ClassifyAsync(lead.RazaoSocial, execution.LastReply);
        execution.SetLastClassification(result.Classification);

        execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now, _jsonSerializer.Serialize(result));
        execution.AdvanceToStep(execution.CurrentStepIndex + 1);
        return true;
    }

    private bool HandleCondition(SequenceExecution execution, SequenceStep step, List<SequenceStep> allSteps)
    {
        var config = _jsonSerializer.Deserialize<ConditionConfig>(step.Config ?? "{}");
        var classification = execution.LastClassification ?? "none";

        var branch = config.Branches?.FirstOrDefault(b => b.Value.Equals(classification, StringComparison.OrdinalIgnoreCase)) 
                     ?? config.Branches?.FirstOrDefault(b => b.Value.Equals("default", StringComparison.OrdinalIgnoreCase));

        if (branch != null && branch.GoToStep > 0)
        {
            // Find step with the given order
            var targetStep = allSteps.FirstOrDefault(s => s.Order == branch.GoToStep);
            if (targetStep != null)
            {
                var targetIdx = allSteps.IndexOf(targetStep);
                execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now, $"Branching to step {branch.GoToStep}");
                execution.AdvanceToStep(targetIdx);
                return true;
            }
        }

        // Default: just move to next step
        execution.AddStepExecution(_guidGenerator.Create(), execution.CurrentStepIndex, StepExecutionStatus.Executed, _clock.Now, "Default branch: next step");
        execution.AdvanceToStep(execution.CurrentStepIndex + 1);
        return true;
    }

    private string ReplacePlaceholders(string content, Lead lead)
    {
        return content
            .Replace("{{razaoSocial}}", lead.RazaoSocial ?? "")
            .Replace("{{nomeFantasia}}", lead.NomeFantasia ?? lead.RazaoSocial ?? "")
            .Replace("{{cidade}}", lead.Cidade ?? "")
            .Replace("{{uf}}", lead.Uf ?? "");
    }

    // Config DTOs for internal use
    private class SendMessageConfig { public string? Content { get; set; } }
    private class WaitConfig { public int Hours { get; set; } }
    private class WaitForReplyConfig { public int TimeoutHours { get; set; } public string? OnTimeout { get; set; } }
    private class UpdateStatusConfig { public int Status { get; set; } }
    private class AddNoteConfig { public string? NoteContent { get; set; } }
    private class ConditionConfig { public List<ConditionBranch>? Branches { get; set; } }
    private class ConditionBranch { public string Value { get; set; } = ""; public int GoToStep { get; set; } }
}
