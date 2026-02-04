using System;
using System.ComponentModel.DataAnnotations;

namespace Sapienza.Leads.Events;

public class CreateEventDto
{
    public Guid LeadId { get; set; }
    public EventType Tipo { get; set; }

    [Required]
    [StringLength(EventConsts.MaxTituloLength)]
    public string Titulo { get; set; } = null!;

    [Required]
    [StringLength(EventConsts.MaxDescricaoLength)]
    public string Descricao { get; set; } = null!;

    [StringLength(EventConsts.MaxCorLength)]
    public string? Cor { get; set; }

    [StringLength(EventConsts.MaxIconeLength)]
    public string? Icone { get; set; }

    public DateTime Timestamp { get; set; }
}
