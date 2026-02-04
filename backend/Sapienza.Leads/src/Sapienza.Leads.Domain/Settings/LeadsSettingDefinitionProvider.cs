using Volo.Abp.Settings;

namespace Sapienza.Leads.Settings;

public class LeadsSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(LeadsSettings.MySetting1));

        context.Add(new SettingDefinition(LeadsSettings.MarketApiBaseUrl, "https://api-cnaes.zensuite.com.br"));
        context.Add(new SettingDefinition(LeadsSettings.MarketApiKey, ""));
    }
}
