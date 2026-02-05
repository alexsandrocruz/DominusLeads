using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Credits;

public interface ICreditAppService : IApplicationService
{
    Task<CreditDto> GetAsync();
    Task AddCreditAsync(AddCreditDto input);
}
