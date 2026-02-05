using System;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Searches;

public class SearchDto : EntityDto<Guid>
{
    public Guid UserId { get; set; }
    public string Criterios { get; set; } = null!;
    public int ResultadosContagem { get; set; }
    public DateTime CreationTime { get; set; }
}
