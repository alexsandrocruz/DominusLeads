using System;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Events;

public class EventDto : EntityDto<Guid>
{
    public Guid LeadId { get; set; }
    public EventType Tipo { get; set; }
    public string Titulo { get; set; } = null!;
    public string Descricao { get; set; } = null!;
    public string? Cor { get; set; }
    public string? Icone { get; set; }
    public DateTime Timestamp { get; set; }
    public Guid? UserId { get; set; }
}
