using System.Threading.Tasks;

namespace Sapienza.Leads.Market;

public interface ICnaeMarketProxy
{
    /// <summary>
    /// Consulta estabelecimentos ativos na API externa.
    /// </summary>
    /// <param name="municipio">Nome do município (opcional)</param>
    /// <param name="cnae">Código CNAE (opcional)</param>
    /// <param name="bairro">Bairro (opcional)</param>
    /// <returns>JSON bruto retornado pela API</returns>
    Task<string> GetEstabelecimentosAtivosAsync(string? municipio = null, string? cnae = null, string? bairro = null);

    /// <summary>
    /// Consulta dados de um CNPJ específico na API externa.
    /// </summary>
    /// <summary>
    /// Consulta uma lista de CNAEs.
    /// </summary>
    /// <returns>JSON com a lista de CNAEs.</returns>
    Task<string> GetCnaesAsync();

    /// <summary>
    /// Consulta uma lista de Municípios.
    /// </summary>
    /// <returns>JSON com a lista de Municípios.</returns>
    Task<string> GetMunicipiosAsync();

    Task<string> GetByCnpjAsync(string cnpj);
}
