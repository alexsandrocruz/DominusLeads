using System;
using System.ComponentModel.DataAnnotations;

namespace Sapienza.Leads.Credits;

public class AddCreditDto
{
    [Required]
    [Range(-1000000, 1000000)]
    public decimal Valor { get; set; }

    [Required]
    [StringLength(CreditConsts.MaxDescricaoLength)]
    public string Descricao { get; set; } = null!;
}
