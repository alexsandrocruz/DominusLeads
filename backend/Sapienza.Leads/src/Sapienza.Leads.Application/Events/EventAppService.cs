using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Events;

[Authorize]
public class EventAppService : ApplicationService, IEventAppService
{
    private readonly IRepository<Event, Guid> _eventRepository;

    public EventAppService(IRepository<Event, Guid> eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<EventDto>> GetListByLeadAsync(Guid leadId)
    {
        var queryable = await _eventRepository.GetQueryableAsync();
        
        var events = await AsyncExecuter.ToListAsync(
            queryable
                .Where(x => x.LeadId == leadId)
                .OrderByDescending(x => x.Timestamp)
        );

        var mapper = new LeadsApplicationMappers();
        return events.Select(mapper.Map).ToList();
    }

    public async Task<EventDto> CreateAsync(CreateEventDto input)
    {
        var @event = new Event(
            GuidGenerator.Create(),
            input.LeadId,
            input.Tipo,
            input.Titulo,
            input.Descricao,
            input.Timestamp,
            input.Cor,
            input.Icone,
            CurrentUser.Id,
            CurrentTenant.Id
        );

        await _eventRepository.InsertAsync(@event, autoSave: true);

        var mapper = new LeadsApplicationMappers();
        return mapper.Map(@event);
    }
}
