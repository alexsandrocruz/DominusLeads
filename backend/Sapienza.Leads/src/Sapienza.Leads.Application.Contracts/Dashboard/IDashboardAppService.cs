using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Dashboard;

public interface IDashboardAppService : IApplicationService
{
    Task<DashboardDto> GetSummaryAsync();
}
