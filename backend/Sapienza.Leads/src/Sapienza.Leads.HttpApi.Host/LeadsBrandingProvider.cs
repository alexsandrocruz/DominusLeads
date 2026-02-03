using Microsoft.Extensions.Localization;
using Sapienza.Leads.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Sapienza.Leads;

[Dependency(ReplaceServices = true)]
public class LeadsBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<LeadsResource> _localizer;

    public LeadsBrandingProvider(IStringLocalizer<LeadsResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
