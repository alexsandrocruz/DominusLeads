using Xunit;

namespace Sapienza.Leads.EntityFrameworkCore;

[CollectionDefinition(LeadsTestConsts.CollectionDefinitionName)]
public class LeadsEntityFrameworkCoreCollection : ICollectionFixture<LeadsEntityFrameworkCoreFixture>
{

}
