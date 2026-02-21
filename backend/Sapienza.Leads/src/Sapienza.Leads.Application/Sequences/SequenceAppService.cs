using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Sapienza.Leads.Leads;

namespace Sapienza.Leads.Sequences;

public class SequenceAppService : ApplicationService, ISequenceAppService
{
    private readonly IRepository<Sequence, Guid> _sequenceRepository;
    private readonly IRepository<SequenceExecution, Guid> _executionRepository;
    private readonly IRepository<Lead, Guid> _leadRepository;

    public SequenceAppService(
        IRepository<Sequence, Guid> sequenceRepository,
        IRepository<SequenceExecution, Guid> executionRepository,
        IRepository<Lead, Guid> leadRepository)
    {
        _sequenceRepository = sequenceRepository;
        _executionRepository = executionRepository;
        _leadRepository = leadRepository;
    }

    public async Task<List<SequenceDto>> GetListAsync()
    {
        var queryable = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var sequences = await AsyncExecuter.ToListAsync(queryable);
        
        var result = new List<SequenceDto>();
        foreach (var s in sequences)
        {
            var dto = MapToDto(s);
            // Count active executions
            dto.ExecutionCount = await _executionRepository.CountAsync(
                e => e.SequenceId == s.Id && 
                     e.Status != ExecutionStatus.Completed && 
                     e.Status != ExecutionStatus.Failed && 
                     e.Status != ExecutionStatus.Cancelled);
            result.Add(dto);
        }
        return result;
    }

    public async Task<SequenceDto> GetAsync(Guid id)
    {
        var queryable = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var sequence = await AsyncExecuter.FirstOrDefaultAsync(queryable, s => s.Id == id);
        if (sequence == null)
            throw new UserFriendlyException("Sequência não encontrada.");
        return MapToDto(sequence);
    }

    public async Task<SequenceDto> CreateAsync(CreateUpdateSequenceDto input)
    {
        var sequence = new Sequence(GuidGenerator.Create(), input.Nome, input.Descricao);
        
        if (input.IsActive) sequence.Activate();

        foreach (var step in input.Steps.OrderBy(s => s.Order))
        {
            sequence.AddStep(GuidGenerator.Create(), step.Order, step.Type, step.Config);
        }

        await _sequenceRepository.InsertAsync(sequence, autoSave: true);
        return MapToDto(sequence);
    }

    public async Task<SequenceDto> UpdateAsync(Guid id, CreateUpdateSequenceDto input)
    {
        var queryable = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var sequence = await AsyncExecuter.FirstOrDefaultAsync(queryable, s => s.Id == id);
        if (sequence == null)
            throw new UserFriendlyException("Sequência não encontrada.");

        sequence.SetNome(input.Nome);
        sequence.SetDescricao(input.Descricao);
        
        if (input.IsActive) sequence.Activate();
        else sequence.Deactivate();

        // Replace all steps
        sequence.ClearSteps();
        foreach (var step in input.Steps.OrderBy(s => s.Order))
        {
            sequence.AddStep(GuidGenerator.Create(), step.Order, step.Type, step.Config);
        }

        await _sequenceRepository.UpdateAsync(sequence, autoSave: true);
        return MapToDto(sequence);
    }

    public async Task DeleteAsync(Guid id)
    {
        // Cancel any running executions first
        var executions = await _executionRepository.GetListAsync(
            e => e.SequenceId == id && 
                 e.Status != ExecutionStatus.Completed && 
                 e.Status != ExecutionStatus.Failed && 
                 e.Status != ExecutionStatus.Cancelled);
        
        foreach (var execution in executions)
        {
            execution.Cancel();
            await _executionRepository.UpdateAsync(execution);
        }

        await _sequenceRepository.DeleteAsync(id);
    }

    public async Task ToggleActiveAsync(Guid id)
    {
        var sequence = await _sequenceRepository.GetAsync(id);
        if (sequence.IsActive)
            sequence.Deactivate();
        else
            sequence.Activate();
        await _sequenceRepository.UpdateAsync(sequence, autoSave: true);
    }

    public async Task<SequenceExecutionDto> StartExecutionAsync(Guid sequenceId, Guid leadId)
    {
        var queryable = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var sequence = await AsyncExecuter.FirstOrDefaultAsync(queryable, s => s.Id == sequenceId);
        if (sequence == null)
            throw new UserFriendlyException("Sequência não encontrada.");
        if (!sequence.IsActive)
            throw new UserFriendlyException("Sequência está desativada.");
        if (!sequence.Steps.Any())
            throw new UserFriendlyException("Sequência não possui steps.");

        // Check if there's already an active execution for this lead+sequence
        var existing = await _executionRepository.FirstOrDefaultAsync(
            e => e.SequenceId == sequenceId && 
                 e.LeadId == leadId && 
                 e.Status != ExecutionStatus.Completed && 
                 e.Status != ExecutionStatus.Failed && 
                 e.Status != ExecutionStatus.Cancelled);
        if (existing != null)
            throw new UserFriendlyException("Já existe uma execução ativa para este lead nesta sequência.");

        var execution = new SequenceExecution(
            GuidGenerator.Create(), sequenceId, leadId, CurrentTenant.Id);
        execution.Start();

        await _executionRepository.InsertAsync(execution, autoSave: true);
        
        Logger.LogInformation("Started execution {ExecutionId} of sequence {SequenceName} for lead {LeadId}",
            execution.Id, sequence.Nome, leadId);

        return await MapToExecutionDto(execution, sequence.Nome);
    }

    public async Task<List<SequenceExecutionDto>> StartBulkExecutionAsync(Guid sequenceId, List<Guid> leadIds)
    {
        var results = new List<SequenceExecutionDto>();
        foreach (var leadId in leadIds)
        {
            try
            {
                var dto = await StartExecutionAsync(sequenceId, leadId);
                results.Add(dto);
            }
            catch (UserFriendlyException ex)
            {
                Logger.LogWarning("Skipped lead {LeadId}: {Error}", leadId, ex.Message);
            }
        }
        return results;
    }

    public async Task CancelExecutionAsync(Guid executionId)
    {
        var execution = await _executionRepository.GetAsync(executionId);
        execution.Cancel();
        await _executionRepository.UpdateAsync(execution, autoSave: true);
    }

    public async Task<List<SequenceExecutionDto>> GetExecutionsAsync(Guid? sequenceId = null)
    {
        var execQueryable = await _executionRepository.WithDetailsAsync(e => e.StepExecutions);
        if (sequenceId.HasValue)
            execQueryable = execQueryable.Where(e => e.SequenceId == sequenceId.Value);
        
        var executions = await AsyncExecuter.ToListAsync(
            execQueryable.OrderByDescending(e => e.CreationTime).Take(100));

        var result = new List<SequenceExecutionDto>();
        foreach (var e in executions)
        {
            result.Add(await MapToExecutionDto(e));
        }
        return result;
    }

    public async Task<SequenceExecutionDto> GetExecutionAsync(Guid executionId)
    {
        var queryable = await _executionRepository.WithDetailsAsync(e => e.StepExecutions);
        var execution = await AsyncExecuter.FirstOrDefaultAsync(queryable, e => e.Id == executionId);
        if (execution == null)
            throw new UserFriendlyException("Execução não encontrada.");
        return await MapToExecutionDto(execution);
    }

    // --- Mapping ---

    private SequenceDto MapToDto(Sequence s)
    {
        return new SequenceDto
        {
            Id = s.Id,
            Nome = s.Nome,
            Descricao = s.Descricao,
            IsActive = s.IsActive,
            Steps = s.Steps.OrderBy(st => st.Order).Select(st => new SequenceStepDto
            {
                Id = st.Id,
                Order = st.Order,
                Type = st.Type,
                Config = st.Config
            }).ToList()
        };
    }

    private async Task<SequenceExecutionDto> MapToExecutionDto(SequenceExecution e, string? sequenceName = null)
    {
        if (sequenceName == null)
        {
            var seq = await _sequenceRepository.GetAsync(e.SequenceId);
            sequenceName = seq.Nome;
        }

        var lead = await _leadRepository.FindAsync(e.LeadId);
        var queryable = await _sequenceRepository.WithDetailsAsync(s => s.Steps);
        var sequence = await AsyncExecuter.FirstOrDefaultAsync(queryable, s => s.Id == e.SequenceId);

        return new SequenceExecutionDto
        {
            Id = e.Id,
            SequenceId = e.SequenceId,
            SequenceName = sequenceName,
            LeadId = e.LeadId,
            LeadName = lead?.RazaoSocial ?? "Lead não encontrado",
            CurrentStepIndex = e.CurrentStepIndex,
            TotalSteps = sequence?.Steps.Count ?? 0,
            Status = e.Status,
            NextActionAt = e.NextActionAt,
            LastClassification = e.LastClassification,
            LastReply = e.LastReply,
            CreationTime = e.CreationTime,
            StepExecutions = e.StepExecutions.OrderBy(se => se.ExecutedAt).Select(se => new StepExecutionDto
            {
                Id = se.Id,
                StepIndex = se.StepIndex,
                Status = se.Status,
                ExecutedAt = se.ExecutedAt,
                Result = se.Result
            }).ToList()
        };
    }
}
