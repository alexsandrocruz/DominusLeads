using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Sequences;

public class Sequence : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public string Nome { get; private set; }
    public string? Descricao { get; private set; }
    public bool IsActive { get; private set; }

    public virtual ICollection<SequenceStep> Steps { get; private set; }

    protected Sequence()
    {
        Steps = new Collection<SequenceStep>();
    }

    public Sequence(Guid id, string nome, string? descricao = null)
        : base(id)
    {
        Nome = nome;
        Descricao = descricao;
        IsActive = false;
        Steps = new Collection<SequenceStep>();
    }

    public void SetNome(string nome) => Nome = nome;
    public void SetDescricao(string? descricao) => Descricao = descricao;
    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;

    public SequenceStep AddStep(Guid stepId, int order, StepType type, string? config = null)
    {
        var step = new SequenceStep(stepId, Id, order, type, config);
        Steps.Add(step);
        return step;
    }

    public void ClearSteps()
    {
        Steps.Clear();
    }
}
