using System;
using Volo.Abp.Domain.Entities;

namespace Sapienza.Leads.Sequences;

public class SequenceStep : Entity<Guid>
{
    public Guid SequenceId { get; private set; }
    public int Order { get; private set; }
    public StepType Type { get; private set; }
    public string? Config { get; private set; } // JSON

    protected SequenceStep()
    {
    }

    public SequenceStep(Guid id, Guid sequenceId, int order, StepType type, string? config = null)
        : base(id)
    {
        SequenceId = sequenceId;
        Order = order;
        Type = type;
        Config = config;
    }

    public void SetOrder(int order) => Order = order;
    public void SetConfig(string? config) => Config = config;
}
