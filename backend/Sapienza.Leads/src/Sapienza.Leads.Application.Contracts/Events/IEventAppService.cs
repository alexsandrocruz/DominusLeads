using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Events;

public interface IEventAppService : IApplicationService
{
    Task<List<EventDto>> GetListByLeadAsync(Guid leadId);
    Task<EventDto> CreateAsync(CreateEventDto input);
}
