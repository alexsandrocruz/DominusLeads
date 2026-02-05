using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Searches;

public interface ISearchAppService : IApplicationService
{
    Task<PagedResultDto<SearchDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<SearchDto> CreateAsync(CreateSearchDto input);
}
