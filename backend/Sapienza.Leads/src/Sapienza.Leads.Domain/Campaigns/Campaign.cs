using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Sequences;

namespace Sapienza.Leads.Campaigns;

public class Campaign : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public CampaignStatus Status { get; set; }
    
    public Guid SequenceId { get; set; }
    public Sequence? Sequence { get; set; }

    public ICollection<CampaignLead> Leads { get; set; }

    protected Campaign()
    {
        Leads = new List<CampaignLead>();
    }

    public Campaign(Guid id, string name, Guid sequenceId, Guid? tenantId = null) : base(id)
    {
        Name = name;
        SequenceId = sequenceId;
        Status = CampaignStatus.Draft;
        TenantId = tenantId;
        Leads = new List<CampaignLead>();
    }
}

public class CampaignLead : FullAuditedEntity<Guid>
{
    public Guid CampaignId { get; set; }
    public Guid LeadId { get; set; }
    public Lead? Lead { get; set; }
    
    public Guid? LastSequenceExecutionId { get; set; }
    public SequenceExecution? LastSequenceExecution { get; set; }

    protected CampaignLead() { }

    public CampaignLead(Guid campaignId, Guid leadId)
    {
        CampaignId = campaignId;
        LeadId = leadId;
    }
}
