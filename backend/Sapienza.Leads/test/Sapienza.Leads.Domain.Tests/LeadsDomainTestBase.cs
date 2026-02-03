using Volo.Abp.Modularity;

namespace Sapienza.Leads;

/* Inherit from this class for your domain layer tests. */
public abstract class LeadsDomainTestBase<TStartupModule> : LeadsTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
