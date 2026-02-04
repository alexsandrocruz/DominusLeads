using System;
using System.ComponentModel.DataAnnotations;

namespace Sapienza.Leads.Searches;

public class CreateSearchDto
{
    [Required]
    [MaxLength(SearchConsts.MaxCriteriosLength)]
    public string Criterios { get; set; } = null!;

    [Range(0, int.MaxValue)]
    public int ResultadosContagem { get; set; }
}
