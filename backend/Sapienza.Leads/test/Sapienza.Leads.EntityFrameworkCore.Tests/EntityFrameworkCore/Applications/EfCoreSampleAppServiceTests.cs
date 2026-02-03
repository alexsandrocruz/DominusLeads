using Sapienza.Leads.Samples;
using Xunit;

namespace Sapienza.Leads.EntityFrameworkCore.Applications;

[Collection(LeadsTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<LeadsEntityFrameworkCoreTestModule>
{

}
