using System;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Leads;

public class LeadDto : FullAuditedEntityDto<Guid>
{
    public string Cnpj { get; set; } = null!;
    public string RazaoSocial { get; set; } = null!;
    public string? NomeFantasia { get; set; }
    public string CnaePrincipal { get; set; } = null!;
    public LeadStatus Status { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Logradouro { get; set; }
    public string? Numero { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public string? Uf { get; set; }
    public string? Cep { get; set; }
    public int Score { get; set; }
    public string? Origem { get; set; }
}
