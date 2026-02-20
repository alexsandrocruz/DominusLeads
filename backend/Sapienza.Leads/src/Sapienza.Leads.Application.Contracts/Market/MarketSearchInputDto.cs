using System;
using System.Collections.Generic;

namespace Sapienza.Leads.Market;

public class MarketSearchInputDto
{
    public string? Municipio { get; set; }
    public string? Cnae { get; set; }
    public string? Bairro { get; set; }
    public Guid? VerticalId { get; set; }
    public List<string>? CnaeCodes { get; set; }
}
