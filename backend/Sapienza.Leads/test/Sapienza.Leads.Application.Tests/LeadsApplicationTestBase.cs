using Volo.Abp.Modularity;

namespace Sapienza.Leads;

public abstract class LeadsApplicationTestBase<TStartupModule> : LeadsTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
