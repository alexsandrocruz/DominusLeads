using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Leads;

public interface ILeadAppService :
    ICrudAppService<
        LeadDto,
        Guid,
        GetLeadsInput,
        CreateUpdateLeadDto>
{
    Task UpdateStatusAsync(Guid id, LeadStatus status);
    Task AddNoteAsync(Guid id, string content);
}
