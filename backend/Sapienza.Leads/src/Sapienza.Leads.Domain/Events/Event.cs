using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Events;

public class Event : Entity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid LeadId { get; private set; }
    public EventType Tipo { get; private set; }
    public string Titulo { get; private set; }
    public string Descricao { get; private set; }
    public string? Cor { get; private set; }
    public string? Icone { get; private set; }
    public DateTime Timestamp { get; private set; }
    public Guid? UserId { get; private set; }

    protected Event()
    {
    }

    public Event(
        Guid id,
        Guid leadId,
        EventType tipo,
        string titulo,
        string descricao,
        DateTime timestamp,
        string? cor = null,
        string? icone = null,
        Guid? userId = null,
        Guid? tenantId = null)
        : base(id)
    {
        LeadId = leadId;
        Tipo = tipo;
        Titulo = Check.NotNullOrWhiteSpace(titulo, nameof(titulo), EventConsts.MaxTituloLength);
        Descricao = Check.NotNullOrWhiteSpace(descricao, nameof(descricao), EventConsts.MaxDescricaoLength);
        Timestamp = timestamp;
        Cor = Check.Length(cor, nameof(cor), EventConsts.MaxCorLength);
        Icone = Check.Length(icone, nameof(icone), EventConsts.MaxIconeLength);
        UserId = userId;
        TenantId = tenantId;
    }
}
