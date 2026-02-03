using System.Threading.Tasks;

namespace Sapienza.Leads.Data;

public interface ILeadsDbSchemaMigrator
{
    Task MigrateAsync();
}
