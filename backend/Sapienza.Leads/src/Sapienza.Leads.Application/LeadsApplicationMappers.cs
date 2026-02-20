using Riok.Mapperly.Abstractions;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Credits;
using Sapienza.Leads.Searches;
using Sapienza.Leads.Events;
using Sapienza.Leads.Dashboard;

namespace Sapienza.Leads;

[Mapper]
public partial class LeadsApplicationMappers
{
    public partial LeadDto Map(Lead source);

    public partial void Map(CreateUpdateLeadDto source, Lead destination);

    public partial CreditDto Map(Credit source);

    public partial TransactionDto Map(Transaction source);

    public partial SearchDto Map(Search source);

    public partial EventDto Map(Event source);

    [MapProperty(nameof(Event.Tipo), nameof(RecentActivityDto.Type))]
    [MapProperty(nameof(Event.Icone), nameof(RecentActivityDto.Icon))]
    [MapProperty(nameof(Event.Titulo), nameof(RecentActivityDto.Title))]
    [MapProperty(nameof(Event.Descricao), nameof(RecentActivityDto.Description))]
    [MapProperty(nameof(Event.Cor), nameof(RecentActivityDto.Color))]
    public partial RecentActivityDto MapToRecentActivity(Event source);

    public string MapEventTypeToString(EventType source) => source.ToString();
}
