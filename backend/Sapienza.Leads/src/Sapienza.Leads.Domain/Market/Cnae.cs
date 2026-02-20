using Volo.Abp.Domain.Entities;

namespace Sapienza.Leads.Market;

public class Cnae : Entity<string>
{
    public string Descricao { get; private set; }
    public CnaeLevel Nivel { get; private set; }
    public string? ParentId { get; private set; }

    protected Cnae()
    {
    }

    public Cnae(string id, string descricao, CnaeLevel nivel, string? parentId = null)
        : base(id)
    {
        Descricao = descricao;
        Nivel = nivel;
        ParentId = parentId;
    }

    public void UpdateDescricao(string descricao)
    {
        Descricao = descricao;
    }
}
