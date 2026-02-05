using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Credits;

public class CreditDto : FullAuditedEntityDto<Guid>
{
    public decimal SaldoAtual { get; set; }
    public DateTime UltimaAtualizacao { get; set; }
    public List<TransactionDto> Transactions { get; set; } = new();
}
