using Sapienza.Leads.Samples;
using Xunit;

namespace Sapienza.Leads.EntityFrameworkCore.Domains;

[Collection(LeadsTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<LeadsEntityFrameworkCoreTestModule>
{

}
