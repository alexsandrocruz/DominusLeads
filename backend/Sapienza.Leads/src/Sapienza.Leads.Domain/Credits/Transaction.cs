using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Sapienza.Leads.Credits;

public class Transaction : CreationAuditedEntity<Guid>
{
    public Guid CreditId { get; private set; }
    public TransactionType Tipo { get; private set; }
    public decimal Valor { get; private set; }
    public string Descricao { get; private set; }
    public TransactionStatus Status { get; private set; }

    protected Transaction()
    {
    }

    internal Transaction(
        Guid id,
        Guid creditId,
        TransactionType tipo,
        decimal valor,
        string descricao,
        TransactionStatus status = TransactionStatus.Confirmado)
        : base(id)
    {
        CreditId = creditId;
        Tipo = tipo;
        Valor = valor;
        Descricao = Check.NotNullOrWhiteSpace(descricao, nameof(descricao), CreditConsts.MaxDescricaoLength);
        Status = status;
    }

    public void SetStatus(TransactionStatus status)
    {
        Status = status;
    }
}
