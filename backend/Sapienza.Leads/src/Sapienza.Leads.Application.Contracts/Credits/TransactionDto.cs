using System;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Credits;

public class TransactionDto : EntityDto<Guid>
{
    public TransactionType Tipo { get; set; }
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = null!;
    public TransactionStatus Status { get; set; }
    public DateTime CreationTime { get; set; }
}
