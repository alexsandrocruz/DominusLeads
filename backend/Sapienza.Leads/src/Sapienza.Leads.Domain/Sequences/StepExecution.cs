using System;
using Volo.Abp.Domain.Entities;

namespace Sapienza.Leads.Sequences;

public class StepExecution : Entity<Guid>
{
    public Guid SequenceExecutionId { get; private set; }
    public int StepIndex { get; private set; }
    public StepExecutionStatus Status { get; private set; }
    public DateTime ExecutedAt { get; private set; }
    public string? Result { get; private set; } // JSON

    protected StepExecution()
    {
    }

    public StepExecution(Guid id, Guid sequenceExecutionId, int stepIndex, StepExecutionStatus status, DateTime executedAt, string? result = null)
        : base(id)
    {
        SequenceExecutionId = sequenceExecutionId;
        StepIndex = stepIndex;
        Status = status;
        ExecutedAt = executedAt;
        Result = result;
    }
}
