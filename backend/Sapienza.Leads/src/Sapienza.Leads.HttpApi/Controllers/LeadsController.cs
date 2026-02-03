using Sapienza.Leads.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Sapienza.Leads.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class LeadsController : AbpControllerBase
{
    protected LeadsController()
    {
        LocalizationResource = typeof(LeadsResource);
    }
}
