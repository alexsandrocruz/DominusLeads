using System;

namespace Sapienza.Leads.Market;

public class MarketLeadDto
{
    public string Cnpj { get; set; } = null!;
    public string? NomeFantasia { get; set; }
    public string RazaoSocial { get; set; } = null!;
    public string? CnaePrincipal { get; set; }
    public string? Logradouro { get; set; }
    public string? Numero { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public string? Uf { get; set; }
    public string? Cep { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }
    
    // Indica se o lead já foi extraído pelo tenant
    public bool IsExtracted { get; set; }
}
