using System;
using System.Threading.Tasks;
using Sapienza.Leads.Market;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Market;

public class MarketProxyService : ApplicationService
{
    private readonly ICnaeMarketProxy _marketProxy;
    private readonly IRepository<ConsultedLead, string> _consultedLeadRepository;

    public MarketProxyService(
        ICnaeMarketProxy marketProxy,
        IRepository<ConsultedLead, string> consultedLeadRepository)
    {
        _marketProxy = marketProxy;
        _consultedLeadRepository = consultedLeadRepository;
    }

    /// <summary>
    /// Busca dados de um CNPJ com estratégia de cache.
    /// </summary>
    public async Task<string> GetByCnpjAsync(string cnpj)
    {
        var cached = await _consultedLeadRepository.FindAsync(cnpj);

        if (cached != null && !cached.IsExpired())
        {
            return cached.RawJson;
        }

        // Se não encontrar ou estiver expirado, busca na API externa
        var rawJson = await _marketProxy.GetByCnpjAsync(cnpj);

        if (cached == null)
        {
            cached = new ConsultedLead(cnpj, rawJson, CurrentTenant.Id);
            await _consultedLeadRepository.InsertAsync(cached, autoSave: true);
        }
        else
        {
            cached.UpdateData(rawJson);
            await _consultedLeadRepository.UpdateAsync(cached, autoSave: true);
        }

        return rawJson;
    }

    /// <summary>
    /// Realiza busca por critérios. Esta chamada geralmente não é cacheada integralmente, 
    /// mas os resultados individuais (CNPJs) podem ser atualizados no banco.
    /// </summary>
    public async Task<string> SearchExternalAsync(MarketSearchInputDto input)
    {
        if (input == null)
        {
            throw new Volo.Abp.UserFriendlyException("Input cannot be null.");
        }

        if (string.IsNullOrWhiteSpace(input.Cnae))
        {
             // TODO: In the future, we might want to return a user-friendly error or specific error code
             throw new Volo.Abp.UserFriendlyException("You must provide a CNAE code to search.");
        }

        var rawJson = await _marketProxy.GetEstabelecimentosAtivosAsync(input.Municipio, input.Cnae, input.Bairro);
        
        // The external API might return "null" (string) or empty content if no results found
        if (string.IsNullOrWhiteSpace(rawJson) || rawJson.Trim() == "null")
        {
            return "[]"; // Return empty JSON array
        }
        
        // TODO: Poderíamos processar o JSON retornado para atualizar o cache de CNPJs individuais em batch
        
        return rawJson;
    }
}
