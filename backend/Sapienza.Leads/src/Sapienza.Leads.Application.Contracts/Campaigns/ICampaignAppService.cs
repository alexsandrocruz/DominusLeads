using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Campaigns;

public interface ICampaignAppService : IApplicationService
{
    Task<CampaignDto> GetAsync(Guid id);
    Task<PagedResultDto<CampaignDto>> GetListAsync(GetCampaignListDto input);
    Task<CampaignDto> CreateAsync(CreateUpdateCampaignDto input);
    Task<CampaignDto> UpdateAsync(Guid id, CreateUpdateCampaignDto input);
    Task DeleteAsync(Guid id);
    Task AddLeadsToCampaignAsync(AddLeadsToCampaignDto input);
}

public class CampaignDto : FullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public CampaignStatus Status { get; set; }
    public Guid SequenceId { get; set; }
    public string? SequenceName { get; set; }
    public int LeadCount { get; set; }
}

public class GetCampaignListDto : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
}

public class CreateUpdateCampaignDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid SequenceId { get; set; }
}

public class AddLeadsToCampaignDto
{
    public Guid CampaignId { get; set; }
    public List<Guid> LeadIds { get; set; } = new();
}
