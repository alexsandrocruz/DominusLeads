using Riok.Mapperly.Abstractions;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Credits;
using Sapienza.Leads.Searches;
using Sapienza.Leads.Events;

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
}
