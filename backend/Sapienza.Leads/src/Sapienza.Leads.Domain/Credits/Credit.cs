using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Credits;

public class Credit : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public decimal SaldoAtual { get; private set; }
    public DateTime UltimaAtualizacao { get; private set; }

    public ICollection<Transaction> Transactions { get; private set; }

    protected Credit()
    {
        Transactions = new Collection<Transaction>();
    }

    public Credit(Guid id, Guid? tenantId = null)
        : base(id)
    {
        TenantId = tenantId;
        SaldoAtual = 0;
        UltimaAtualizacao = DateTime.Now;
        Transactions = new Collection<Transaction>();
    }

    public void AddTransaction(
        Guid id,
        TransactionType tipo,
        decimal valor,
        string descricao,
        TransactionStatus status = TransactionStatus.Confirmado)
    {
        var transaction = new Transaction(id, Id, tipo, valor, descricao, status);
        Transactions.Add(transaction);

        if (status == TransactionStatus.Confirmado)
        {
            ApplyTransaction(valor);
        }
    }

    public void ConfirmTransaction(Guid transactionId)
    {
        foreach (var transaction in Transactions)
        {
            if (transaction.Id == transactionId && transaction.Status == TransactionStatus.Pendente)
            {
                transaction.SetStatus(TransactionStatus.Confirmado);
                ApplyTransaction(transaction.Valor);
                return;
            }
        }
    }

    private void ApplyTransaction(decimal valor)
    {
        if (SaldoAtual + valor < 0)
        {
            throw new BusinessException("Saldo insuficiente para realizar esta operação.");
        }

        SaldoAtual += valor;
        UltimaAtualizacao = DateTime.Now;
    }
}
