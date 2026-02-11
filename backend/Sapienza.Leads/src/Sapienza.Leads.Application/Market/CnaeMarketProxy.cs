using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Sapienza.Leads.Settings;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Settings;

namespace Sapienza.Leads.Market;

public class CnaeMarketProxy : ICnaeMarketProxy, ITransientDependency
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ISettingProvider _settingProvider;

    public CnaeMarketProxy(IHttpClientFactory httpClientFactory, ISettingProvider settingProvider)
    {
        _httpClientFactory = httpClientFactory;
        _settingProvider = settingProvider;
    }

    public async Task<string> GetEstabelecimentosAtivosAsync(string? municipio = null, string? cnae = null, string? bairro = null)
    {
        var baseUrl = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiBaseUrl);
        var apiKey = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiKey);

        if (string.IsNullOrEmpty(baseUrl))
        {
            throw new Volo.Abp.UserFriendlyException("Market API Base URL is not configured. Please check Leads.MarketApiBaseUrl setting.");
        }

        using var client = _httpClientFactory.CreateClient();
        if (!string.IsNullOrEmpty(apiKey))
        {
            client.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
        }

        var url = $"{baseUrl}/api/v1/estabelecimentos-ativos?";
        
        if (string.IsNullOrWhiteSpace(cnae))
        {
            throw new ArgumentNullException(nameof(cnae), "The 'cnae' parameter is mandatory for the external API.");
        }

        if (!string.IsNullOrEmpty(municipio)) url += $"municipio={Uri.EscapeDataString(municipio)}&";
        url += $"cnae={Uri.EscapeDataString(cnae)}&";
        if (!string.IsNullOrEmpty(bairro)) url += $"bairro={Uri.EscapeDataString(bairro)}&";

        try
        {
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (HttpRequestException ex)
        {
            throw new Volo.Abp.UserFriendlyException($"Failed to connect to external Market API at {baseUrl}. Error: {ex.Message}");
        }
    }

    public async Task<string> GetByCnpjAsync(string cnpj)
    {
        var baseUrl = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiBaseUrl);
        var apiKey = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiKey);

        using var client = _httpClientFactory.CreateClient();
        if (!string.IsNullOrEmpty(apiKey))
        {
            client.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
        }

        var url = $"{baseUrl}/api/v1/cnpj/{cnpj}";
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetCnaesAsync()
    {
        var baseUrl = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiBaseUrl);
        var apiKey = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiKey);

        using var client = _httpClientFactory.CreateClient();
        if (!string.IsNullOrEmpty(apiKey))
        {
            client.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
        }

        var url = $"{baseUrl}/api/v1/cnaes";
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetMunicipiosAsync()
    {
        var baseUrl = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiBaseUrl);
        var apiKey = await _settingProvider.GetOrNullAsync(LeadsSettings.MarketApiKey);

        using var client = _httpClientFactory.CreateClient();
        if (!string.IsNullOrEmpty(apiKey))
        {
            client.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
        }

        // Assuming standard endpoint /municipios as discussed.
        // If it fails, we will need to re-verify the endpoint.
        var url = $"{baseUrl}/api/v1/municipios"; 
        
        try 
        {
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (HttpRequestException ex)
        {
             // Fallback attempt or clearer error if needed
             throw new Volo.Abp.UserFriendlyException($"Failed to fetch municipalities from {url}. Error: {ex.Message}");
        }
    }
}
