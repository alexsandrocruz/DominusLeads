using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Leads;

public class GetLeadsInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public LeadStatus? Status { get; set; }
    public string? Cnae { get; set; }
    public string? Cidade { get; set; }
}
