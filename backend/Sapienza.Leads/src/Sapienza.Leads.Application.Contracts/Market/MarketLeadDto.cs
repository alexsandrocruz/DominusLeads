using System;
using System.Collections.Generic;

namespace Sapienza.Leads.Market;

public class MarketLeadDto
{
    /// <summary>CNPJ completo formatado (basico + ordem + dv)</summary>
    public string? Cnpj { get; set; }
    public string? CnpjBasico { get; set; }
    public string? CnpjOrdem { get; set; }
    public string? CnpjDv { get; set; }

    public string? NomeFantasia { get; set; }
    public string? RazaoSocial { get; set; }
    
    /// <summary>Lista de códigos CNAE associados</summary>
    public List<string> Cnaes { get; set; } = new();

    // Endereço
    public string? TipoLogradouro { get; set; }
    public string? Logradouro { get; set; }
    public string? Numero { get; set; }
    public string? Complemento { get; set; }
    public string? Bairro { get; set; }
    public string? Municipio { get; set; }
    public string? Uf { get; set; }
    public string? Cep { get; set; }

    // Contato
    public string? Ddd1 { get; set; }
    public string? Telefone1 { get; set; }
    public string? Ddd2 { get; set; }
    public string? Telefone2 { get; set; }
    public string? DddFax { get; set; }
    public string? Fax { get; set; }
    public string? CorreioEletronico { get; set; }
    
    /// <summary>Telefone principal formatado: (DDD) TELEFONE</summary>
    public string? TelefoneFormatado { get; set; }

    // Situação
    public string? SituacaoCadastral { get; set; }
    public string? DataSituacaoCadastral { get; set; }
    public string? DataInicioAtividade { get; set; }
    public string? IdentificadorMatrizFilial { get; set; }

    // Estado de extração
    public bool IsExtracted { get; set; }
}
