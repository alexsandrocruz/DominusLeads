using Volo.Abp.Modularity;

namespace Sapienza.Leads;

[DependsOn(
    typeof(LeadsApplicationModule),
    typeof(LeadsDomainTestModule)
)]
public class LeadsApplicationTestModule : AbpModule
{

}
