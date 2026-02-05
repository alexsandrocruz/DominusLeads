using System;

namespace Sapienza.Leads.Credits;

public class DebitCreditDto
{
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = null!;
}
