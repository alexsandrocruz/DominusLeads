using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Sequences;

public class SequenceExecution : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid SequenceId { get; private set; }
    public Guid LeadId { get; private set; }
    public int CurrentStepIndex { get; private set; }
    public ExecutionStatus Status { get; private set; }
    public DateTime? NextActionAt { get; private set; }
    public string? LastClassification { get; private set; }
    public string? LastReply { get; private set; }

    public virtual ICollection<StepExecution> StepExecutions { get; private set; }

    protected SequenceExecution()
    {
        StepExecutions = new Collection<StepExecution>();
    }

    public SequenceExecution(Guid id, Guid sequenceId, Guid leadId, Guid? tenantId = null)
        : base(id)
    {
        SequenceId = sequenceId;
        LeadId = leadId;
        TenantId = tenantId;
        CurrentStepIndex = 0;
        Status = ExecutionStatus.Pending;
        StepExecutions = new Collection<StepExecution>();
    }

    public void Start()
    {
        Status = ExecutionStatus.Running;
    }

    public void AdvanceToStep(int stepIndex)
    {
        CurrentStepIndex = stepIndex;
    }

    public void SetWaitingReply(DateTime timeoutAt)
    {
        Status = ExecutionStatus.WaitingReply;
        NextActionAt = timeoutAt;
    }

    public void SetWaitingDelay(DateTime resumeAt)
    {
        Status = ExecutionStatus.WaitingDelay;
        NextActionAt = resumeAt;
    }

    public void SetRunning()
    {
        Status = ExecutionStatus.Running;
        NextActionAt = null;
    }

    public void Complete()
    {
        Status = ExecutionStatus.Completed;
        NextActionAt = null;
    }

    public void Fail()
    {
        Status = ExecutionStatus.Failed;
        NextActionAt = null;
    }

    public void Cancel()
    {
        Status = ExecutionStatus.Cancelled;
        NextActionAt = null;
    }

    public void Pause()
    {
        Status = ExecutionStatus.Paused;
        NextActionAt = null;
    }

    public void SetLastReply(string reply)
    {
        LastReply = reply;
    }

    public void SetLastClassification(string classification)
    {
        LastClassification = classification;
    }

    public StepExecution AddStepExecution(Guid id, int stepIndex, StepExecutionStatus status, DateTime executedAt, string? result = null)
    {
        var stepExecution = new StepExecution(id, Id, stepIndex, status, executedAt, result);
        StepExecutions.Add(stepExecution);
        return stepExecution;
    }
}
