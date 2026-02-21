using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Sequences;

public interface ISequenceAppService : IApplicationService
{
    Task<List<SequenceDto>> GetListAsync();
    Task<SequenceDto> GetAsync(Guid id);
    Task<SequenceDto> CreateAsync(CreateUpdateSequenceDto input);
    Task<SequenceDto> UpdateAsync(Guid id, CreateUpdateSequenceDto input);
    Task DeleteAsync(Guid id);
    Task ToggleActiveAsync(Guid id);
    Task<SequenceExecutionDto> StartExecutionAsync(Guid sequenceId, Guid leadId);
    Task<List<SequenceExecutionDto>> StartBulkExecutionAsync(Guid sequenceId, List<Guid> leadIds);
    Task CancelExecutionAsync(Guid executionId);
    Task<List<SequenceExecutionDto>> GetExecutionsAsync(Guid? sequenceId = null);
    Task<SequenceExecutionDto> GetExecutionAsync(Guid executionId);
}
