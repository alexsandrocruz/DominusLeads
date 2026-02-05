using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Leads;

public interface ILeadAppService :
    ICrudAppService<
        LeadDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateLeadDto>
{
}
