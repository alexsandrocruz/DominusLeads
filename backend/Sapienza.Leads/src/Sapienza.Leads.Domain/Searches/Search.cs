using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Searches;

public class Search : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid UserId { get; private set; }
    public string Criterios { get; private set; }
    public int ResultadosContagem { get; private set; }

    protected Search()
    {
    }

    public Search(
        Guid id,
        Guid userId,
        string criterios,
        int resultadosContagem,
        Guid? tenantId = null)
        : base(id)
    {
        UserId = userId;
        Criterios = Check.NotNullOrWhiteSpace(criterios, nameof(criterios), SearchConsts.MaxCriteriosLength);
        ResultadosContagem = resultadosContagem;
        TenantId = tenantId;
    }
}
