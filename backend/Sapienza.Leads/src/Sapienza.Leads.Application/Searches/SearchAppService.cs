using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace Sapienza.Leads.Searches;

[Authorize]
public class SearchAppService : ApplicationService, ISearchAppService
{
    private readonly IRepository<Search, Guid> _searchRepository;

    public SearchAppService(IRepository<Search, Guid> searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<PagedResultDto<SearchDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _searchRepository.GetQueryableAsync();
        
        // Filter by current user and tenant
        queryable = queryable.Where(x => x.UserId == CurrentUser.GetId());

        var totalCount = await AsyncExecuter.CountAsync(queryable);
        
        var searches = await AsyncExecuter.ToListAsync(
            queryable
                .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "CreationTime desc" : input.Sorting)
                .PageBy(input)
        );

        var mapper = new LeadsApplicationMappers();
        return new PagedResultDto<SearchDto>(
            totalCount,
            searches.Select(mapper.Map).ToList()
        );
    }

    public async Task<SearchDto> CreateAsync(CreateSearchDto input)
    {
        var search = new Search(
            GuidGenerator.Create(),
            CurrentUser.GetId(),
            input.Criterios,
            input.ResultadosContagem,
            CurrentTenant.Id
        );

        await _searchRepository.InsertAsync(search, autoSave: true);

        var mapper = new LeadsApplicationMappers();
        return mapper.Map(search);
    }
}
