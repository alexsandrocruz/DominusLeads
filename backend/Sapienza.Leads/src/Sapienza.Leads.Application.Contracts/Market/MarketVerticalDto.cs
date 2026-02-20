using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Market;

public class MarketVerticalDto : EntityDto<Guid>
{
    public string Nome { get; set; }
    public string? Descricao { get; set; }
    public string? Icone { get; set; }
    public List<string> CnaeIds { get; set; } = new();
}

public class CreateUpdateMarketVerticalDto
{
    public string Nome { get; set; }
    public string? Descricao { get; set; }
    public string? Icone { get; set; }
    public List<string> CnaeIds { get; set; } = new();
}
