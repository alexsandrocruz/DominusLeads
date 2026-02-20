using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Distributed;
using Sapienza.Leads.Market;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Market;

public class MarketProxyService : ApplicationService
{
    private readonly ICnaeMarketProxy _marketProxy;
    private readonly IRepository<ConsultedLead, string> _consultedLeadRepository;
    private readonly Volo.Abp.Caching.IDistributedCache<string> _cache;

    public MarketProxyService(
        ICnaeMarketProxy marketProxy,
        IRepository<ConsultedLead, string> consultedLeadRepository,
        Volo.Abp.Caching.IDistributedCache<string> cache)
    {
        _marketProxy = marketProxy;
        _consultedLeadRepository = consultedLeadRepository;
        _cache = cache;
    }

    public async Task<string> GetCnaesAsync()
    {
        return await _cache.GetOrAddAsync(
            "AllCnaes", // Cache Key
            async () => await _marketProxy.GetCnaesAsync(),
            () => new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24) // Cache for 24 hours
            }
        );
    }

    public async Task<string> GetMunicipiosAsync()
    {
        return await _cache.GetOrAddAsync(
            "AllMunicipios", // Cache Key
            async () => await _marketProxy.GetMunicipiosAsync(),
            () => new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24) // Cache for 24 hours
            }
        );
    }

    /// <summary>
    /// Busca dados de um CNPJ com estratégia de cache.
    /// </summary>
    public async Task<string> GetByCnpjAsync(string cnpj)
    {
        var cleanCnpj = cnpj.Replace(".", "").Replace("/", "").Replace("-", "");
        var cached = await _consultedLeadRepository.FindAsync(cleanCnpj);

        if (cached != null && !cached.IsExpired())
        {
            return cached.RawJson;
        }

        // Se não encontrar ou estiver expirado, busca na API externa
        var rawJson = await _marketProxy.GetByCnpjAsync(cleanCnpj);

        if (cached == null)
        {
            cached = new ConsultedLead(cleanCnpj, rawJson, CurrentTenant.Id);
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
        
        // Processar o JSON retornado para atualizar o cache de CNPJs individuais em batch
        try
        {
            using var doc = JsonDocument.Parse(rawJson);
            var root = doc.RootElement.ValueKind == JsonValueKind.Array ? doc.RootElement : 
                       doc.RootElement.TryGetProperty("data", out var dataProp) ? dataProp : doc.RootElement;

            if (root.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in root.EnumerateArray())
                {
                    var cnpjBasico = item.TryGetProperty("cnpj_basico", out var cb) ? cb.GetString() : null;
                    var cnpjOrdem = item.TryGetProperty("cnpj_ordem", out var co) ? co.GetString() : null;
                    var cnpjDv = item.TryGetProperty("cnpj_dv", out var cd) ? cd.GetString() : null;

                    if (!string.IsNullOrEmpty(cnpjBasico) && !string.IsNullOrEmpty(cnpjOrdem) && !string.IsNullOrEmpty(cnpjDv))
                    {
                        var fullCnpj = cnpjBasico + cnpjOrdem + cnpjDv;
                        // Cache as a single JSON object
                        var itemJson = item.GetRawText();
                        
                        // Verificar se já existe (Pode ser otimizado para batch, mas para o MVP vamos um a um)
                        var existing = await _consultedLeadRepository.FindAsync(fullCnpj);
                        if (existing == null)
                        {
                            await _consultedLeadRepository.InsertAsync(new ConsultedLead(fullCnpj, itemJson, CurrentTenant.Id), autoSave: true);
                        }
                        else
                        {
                            existing.UpdateData(itemJson);
                            await _consultedLeadRepository.UpdateAsync(existing, autoSave: true);
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Logger.LogWarning("Falha ao processar cache de resultados de busca: " + ex.Message);
        }
        
        return rawJson;
    }
}
