using Volo.Abp.Modularity;

namespace Sapienza.Leads;

[DependsOn(
    typeof(LeadsDomainModule),
    typeof(LeadsTestBaseModule)
)]
public class LeadsDomainTestModule : AbpModule
{

}
