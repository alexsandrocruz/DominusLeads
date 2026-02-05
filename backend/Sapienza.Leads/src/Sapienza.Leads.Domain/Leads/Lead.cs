using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Leads;

public class Lead : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Cnpj { get; private set; }
    public string RazaoSocial { get; private set; }
    public string NomeFantasia { get; private set; }
    public string CnaePrincipal { get; private set; }
    public LeadStatus Status { get; private set; }
    public string? Email { get; private set; }
    public string? Telefone { get; private set; }
    public string? Logradouro { get; private set; }
    public string? Numero { get; private set; }
    public string? Bairro { get; private set; }
    public string? Cidade { get; private set; }
    public string? Uf { get; private set; }
    public string? Cep { get; private set; }
    public int Score { get; private set; }
    public string? Origem { get; private set; }

    protected Lead()
    {
    }

    public Lead(
        Guid id,
        string cnpj,
        string cnaePrincipal,
        string razaoSocial,
        string? nomeFantasia = null,
        LeadStatus status = LeadStatus.Novo,
        int score = 0,
        string? origem = null,
        Guid? tenantId = null)
        : base(id)
    {
        SetCnpj(cnpj);
        SetCnae(cnaePrincipal);
        SetRazaoSocial(razaoSocial);
        NomeFantasia = nomeFantasia;
        Status = status;
        Score = score;
        Origem = origem;
        TenantId = tenantId;
    }

    public void SetCnpj(string cnpj)
    {
        Cnpj = Check.NotNullOrWhiteSpace(cnpj, nameof(cnpj), LeadConsts.MaxCnpjLength);
    }

    public void SetCnae(string cnaePrincipal)
    {
        CnaePrincipal = Check.NotNullOrWhiteSpace(cnaePrincipal, nameof(cnaePrincipal), LeadConsts.MaxCnaeLength);
    }

    public void SetRazaoSocial(string razaoSocial)
    {
        RazaoSocial = Check.NotNullOrWhiteSpace(razaoSocial, nameof(razaoSocial), LeadConsts.MaxRazaoSocialLength);
    }

    public void SetStatus(LeadStatus status)
    {
        Status = status;
    }

    public void SetScore(int score)
    {
        if (score < 0 || score > 100)
        {
            throw new BusinessException("Lead score must be between 0 and 100.");
        }
        Score = score;
    }

    public void SetContactInfo(string? email, string? telefone)
    {
        Email = email;
        Telefone = telefone;
    }

    public void SetAddress(
        string? logradouro,
        string? numero,
        string? bairro,
        string? cidade,
        string? uf,
        string? cep)
    {
        Logradouro = logradouro;
        Numero = numero;
        Bairro = bairro;
        Cidade = cidade;
        Uf = uf;
        Cep = cep;
    }
}
