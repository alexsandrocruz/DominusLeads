using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Market;

/// <summary>
/// Representa um cache local de dados consultados externamente para evitar chamas repetidas.
/// </summary>
public class ConsultedLead : Entity<string>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    
    /// <summary>
    /// JSON bruto retornado pela API externa.
    /// </summary>
    public string RawJson { get; private set; }
    
    /// <summary>
    /// Data da última consulta realizada na API externa.
    /// </summary>
    public DateTime LastUpdated { get; private set; }

    protected ConsultedLead()
    {
    }

    public ConsultedLead(string cnpj, string rawJson, Guid? tenantId = null)
        : base(cnpj)
    {
        TenantId = tenantId;
        UpdateData(rawJson);
    }

    public void UpdateData(string rawJson)
    {
        RawJson = Check.NotNullOrWhiteSpace(rawJson, nameof(rawJson), MarketConsts.MaxRawJsonLength);
        LastUpdated = DateTime.Now;
    }

    /// <summary>
    /// Verifica se o cache está expirado (ex: > 30 dias).
    /// </summary>
    public bool IsExpired(int days = 30)
    {
        return LastUpdated.AddDays(days) < DateTime.Now;
    }
}
