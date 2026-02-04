using System;
using System.ComponentModel.DataAnnotations;

namespace Sapienza.Leads.Leads;

public class CreateUpdateLeadDto
{
    [Required]
    [StringLength(LeadConsts.MaxCnpjLength)]
    public string Cnpj { get; set; } = null!;

    [Required]
    [StringLength(LeadConsts.MaxRazaoSocialLength)]
    public string RazaoSocial { get; set; } = null!;

    [StringLength(LeadConsts.MaxNomeFantasiaLength)]
    public string? NomeFantasia { get; set; }

    [Required]
    [StringLength(LeadConsts.MaxCnaeLength)]
    public string CnaePrincipal { get; set; } = null!;

    public LeadStatus Status { get; set; }

    [StringLength(LeadConsts.MaxEmailLength)]
    public string? Email { get; set; }

    [StringLength(LeadConsts.MaxTelefoneLength)]
    public string? Telefone { get; set; }

    public string? Logradouro { get; set; }
    public string? Numero { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }

    [StringLength(LeadConsts.MaxUfLength)]
    public string? Uf { get; set; }

    public string? Cep { get; set; }
    public int Score { get; set; }
    public string? Origem { get; set; }
}
