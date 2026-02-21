using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Sapienza.Leads.Sequences;
using Sapienza.Leads.Leads;

namespace Sapienza.Leads.Campaigns;

public class CampaignAppService : LeadsAppService, ICampaignAppService
{
    private readonly IRepository<Campaign, Guid> _campaignRepository;
    private readonly IRepository<CampaignLead, Guid> _campaignLeadRepository;
    private readonly ISequenceAppService _sequenceAppService;

    public CampaignAppService(
        IRepository<Campaign, Guid> campaignRepository,
        IRepository<CampaignLead, Guid> campaignLeadRepository,
        ISequenceAppService sequenceAppService)
    {
        _campaignRepository = campaignRepository;
        _campaignLeadRepository = campaignLeadRepository;
        _sequenceAppService = sequenceAppService;
    }

    public async Task<CampaignDto> GetAsync(Guid id)
    {
        var queryable = await _campaignRepository.WithDetailsAsync(x => x.Sequence, x => x.Leads);
        var campaign = await AsyncExecuter.FirstOrDefaultAsync(queryable, x => x.Id == id);
        if (campaign == null)
        {
            throw new Volo.Abp.Domain.Entities.EntityNotFoundException(typeof(Campaign), id);
        }
        return MapToDto(campaign);
    }

    public async Task<PagedResultDto<CampaignDto>> GetListAsync(GetCampaignListDto input)
    {
        var queryable = await _campaignRepository.WithDetailsAsync(x => x.Sequence, x => x.Leads);
        
        if (!string.IsNullOrEmpty(input.Filter))
        {
            queryable = queryable.Where(x => x.Name.Contains(input.Filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);
        var items = await AsyncExecuter.ToListAsync(
            queryable.OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
        );

        return new PagedResultDto<CampaignDto>(
            totalCount,
            items.Select(MapToDto).ToList()
        );
    }

    public async Task<CampaignDto> CreateAsync(CreateUpdateCampaignDto input)
    {
        var campaign = new Campaign(GuidGenerator.Create(), input.Name, input.SequenceId, CurrentTenant?.Id)
        {
            Description = input.Description
        };

        await _campaignRepository.InsertAsync(campaign);
        return MapToDto(campaign);
    }

    public async Task<CampaignDto> UpdateAsync(Guid id, CreateUpdateCampaignDto input)
    {
        var campaign = await _campaignRepository.GetAsync(id);
        campaign.Name = input.Name;
        campaign.Description = input.Description;
        campaign.SequenceId = input.SequenceId;

        await _campaignRepository.UpdateAsync(campaign);
        return MapToDto(campaign);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _campaignRepository.DeleteAsync(id);
    }

    public async Task AddLeadsToCampaignAsync(AddLeadsToCampaignDto input)
    {
        var campaign = await _campaignRepository.GetAsync(input.CampaignId);
        
        foreach (var leadId in input.LeadIds)
        {
            var exists = await _campaignLeadRepository.AnyAsync(x => x.CampaignId == input.CampaignId && x.LeadId == leadId);
            if (!exists)
            {
                var campaignLead = new CampaignLead(input.CampaignId, leadId);
                await _campaignLeadRepository.InsertAsync(campaignLead);
                
                await _sequenceAppService.StartExecutionAsync(campaign.SequenceId, leadId);
            }
        }
    }

    private CampaignDto MapToDto(Campaign campaign)
    {
        return new CampaignDto
        {
            Id = campaign.Id,
            Name = campaign.Name,
            Description = campaign.Description,
            Status = campaign.Status,
            SequenceId = campaign.SequenceId,
            SequenceName = campaign.Sequence?.Nome,
            LeadCount = campaign.Leads?.Count ?? 0,
            CreationTime = campaign.CreationTime
        };
    }
}
