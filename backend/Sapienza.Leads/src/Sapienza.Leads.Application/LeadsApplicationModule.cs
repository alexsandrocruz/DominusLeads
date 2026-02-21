using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Account;
using Volo.Abp.Identity;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Modularity;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.TenantManagement;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp;
using Sapienza.Leads.Sequences;

namespace Sapienza.Leads;

[DependsOn(
    typeof(LeadsDomainModule),
    typeof(LeadsApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpMapperlyModule)
    )]
public class LeadsApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddHttpClient();
        
        // Gateways
        context.Services.AddTransient<EvolutionMessageGateway>();
        context.Services.AddTransient<TwilioMessageGateway>();
        context.Services.AddTransient<IMessageGateway, EvolutionMessageGateway>(); // Default for backward compatibility
        
        // Factory
        context.Services.AddTransient<IMessageGatewayFactory, MessageGatewayFactory>();

        context.Services.AddTransient<IResponseClassifier, OpenAiResponseClassifier>();
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        context.AddBackgroundWorkerAsync<SequenceWorkerService>();
    }
}
