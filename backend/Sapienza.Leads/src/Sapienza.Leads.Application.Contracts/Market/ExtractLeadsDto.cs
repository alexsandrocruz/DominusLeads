using System.Collections.Generic;

namespace Sapienza.Leads.Market;

public class ExtractLeadsDto
{
    public List<string> Cnpjs { get; set; } = new();
}
