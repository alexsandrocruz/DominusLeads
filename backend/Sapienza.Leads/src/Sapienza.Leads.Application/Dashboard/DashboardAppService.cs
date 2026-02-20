using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Sapienza.Leads.Credits;
using Sapienza.Leads.Events;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Searches;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Dashboard;

[Authorize]
public class DashboardAppService : ApplicationService, IDashboardAppService
{
    private readonly IRepository<Lead, Guid> _leadRepository;
    private readonly IRepository<Credit, Guid> _creditRepository;
    private readonly IRepository<Search, Guid> _searchRepository;
    private readonly IRepository<Event, Guid> _eventRepository;

    public DashboardAppService(
        IRepository<Lead, Guid> leadRepository,
        IRepository<Credit, Guid> creditRepository,
        IRepository<Search, Guid> searchRepository,
        IRepository<Event, Guid> eventRepository)
    {
        _leadRepository = leadRepository;
        _creditRepository = creditRepository;
        _searchRepository = searchRepository;
        _eventRepository = eventRepository;
    }

    public async Task<DashboardDto> GetSummaryAsync()
    {
        var tenantId = CurrentTenant.Id;
        var now = DateTime.Now;
        var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

        // 1. Stats
        var totalLeads = await _leadRepository.CountAsync();
        var leadsThisMonth = await _leadRepository.CountAsync(x => x.CreationTime >= firstDayOfMonth);
        
        var credit = await _creditRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        var creditBalance = credit?.SaldoAtual ?? 0;

        var activeSearches = await _searchRepository.CountAsync();

        // 2. Evolution (last 4 weeks)
        var evolution = new List<LeadEvolutionDto>();
        for (int i = 3; i >= 0; i--)
        {
            var end = now.AddDays(-7 * i);
            var start = end.AddDays(-7);
            var count = await _leadRepository.CountAsync(x => x.CreationTime >= start && x.CreationTime < end);
            evolution.Add(new LeadEvolutionDto
            {
                Period = $"Semana {4-i}",
                Count = count
            });
        }

        // 3. Recent Activities
        var queryableEvents = await _eventRepository.GetQueryableAsync();
        var recentEvents = await AsyncExecuter.ToListAsync(
            queryableEvents
                .OrderByDescending(x => x.Timestamp)
                .Take(10)
        );

        var mapper = new LeadsApplicationMappers();
        var dashboardDto = new DashboardDto
        {
            Stats = new DashboardStatsDto
            {
                TotalLeads = totalLeads,
                LeadsThisMonth = leadsThisMonth,
                CreditsBalance = creditBalance,
                ActiveSearches = activeSearches,
                ConversionRate = totalLeads > 0 ? 12.5 : 0 // Mocked for now until we have deal tracking
            },
            Evolution = evolution,
            RecentActivities = recentEvents.Select(mapper.MapToRecentActivity).ToList()
        };

        return dashboardDto;
    }
}
