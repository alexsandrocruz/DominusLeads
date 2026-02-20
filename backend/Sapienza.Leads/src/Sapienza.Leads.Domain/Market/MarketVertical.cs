using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Domain.Entities;

namespace Sapienza.Leads.Market;

public class MarketVertical : AuditedAggregateRoot<Guid>
{
    public string Nome { get; private set; }
    public string? Descricao { get; private set; }
    public string? Icone { get; private set; }

    public virtual ICollection<MarketVerticalCnae> Cnaes { get; private set; }

    protected MarketVertical()
    {
        Cnaes = new Collection<MarketVerticalCnae>();
    }

    public MarketVertical(Guid id, string nome, string? descricao = null, string? icone = null)
        : base(id)
    {
        Nome = nome;
        Descricao = descricao;
        Icone = icone;
        Cnaes = new Collection<MarketVerticalCnae>();
    }

    public void AddCnae(string cnaeId)
    {
        if (Cnaes.Any(x => x.CnaeId == cnaeId))
        {
            return;
        }

        Cnaes.Add(new MarketVerticalCnae(Id, cnaeId));
    }

    public void RemoveCnae(string cnaeId)
    {
        Cnaes.RemoveAll(x => x.CnaeId == cnaeId);
    }
}

public class MarketVerticalCnae : Entity
{
    public Guid MarketVerticalId { get; private set; }
    public string CnaeId { get; private set; }

    protected MarketVerticalCnae()
    {
    }

    public MarketVerticalCnae(Guid marketVerticalId, string cnaeId)
    {
        MarketVerticalId = marketVerticalId;
        CnaeId = cnaeId;
    }

    public override object[] GetKeys()
    {
        return new object[] { MarketVerticalId, CnaeId };
    }
}
