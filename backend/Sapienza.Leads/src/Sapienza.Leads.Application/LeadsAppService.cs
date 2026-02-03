using Sapienza.Leads.Localization;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads;

/* Inherit your application services from this class.
 */
public abstract class LeadsAppService : ApplicationService
{
    protected LeadsAppService()
    {
        LocalizationResource = typeof(LeadsResource);
    }
}
