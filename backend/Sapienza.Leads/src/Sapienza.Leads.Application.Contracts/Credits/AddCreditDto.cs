using System;
using System.ComponentModel.DataAnnotations;

namespace Sapienza.Leads.Credits;

public class AddCreditDto
{
    [Required]
    [Range(0.01, 1000000)]
    public decimal Valor { get; set; }

    [Required]
    [StringLength(CreditConsts.MaxDescricaoLength)]
    public string Descricao { get; set; } = null!;
}
