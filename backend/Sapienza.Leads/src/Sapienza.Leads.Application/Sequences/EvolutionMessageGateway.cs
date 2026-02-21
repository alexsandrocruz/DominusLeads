using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Volo.Abp.DependencyInjection;

namespace Sapienza.Leads.Sequences;

public class EvolutionMessageGateway : IMessageGateway, ITransientDependency
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EvolutionMessageGateway> _logger;

    public EvolutionMessageGateway(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<EvolutionMessageGateway> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<SendResult> SendTextAsync(string phone, string content)
    {
        try
        {
            var baseUrl = _configuration["EvolutionApi:BaseUrl"];
            var apiKey = _configuration["EvolutionApi:ApiKey"];
            var instance = _configuration["EvolutionApi:InstanceName"];

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(instance))
            {
                return new SendResult { Success = false, Error = "Evolution API configuration is missing." };
            }

            var url = $"{baseUrl.TrimEnd('/')}/message/sendText/{instance}";
            
            var payload = new
            {
                number = phone,
                options = new
                {
                    delay = 1200,
                    presence = "composing",
                    linkPreview = false
                },
                textMessage = new
                {
                    text = content
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("apikey", apiKey);
            request.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation($"Message sent to {phone} via Evolution API.");
                return new SendResult { Success = true };
            }

            _logger.LogError($"Failed to send message to {phone}. Status: {response.StatusCode}, Response: {responseContent}");
            return new SendResult { Success = false, Error = $"API Error: {response.StatusCode}. {responseContent}" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Exception sending message to {phone} via Evolution API.");
            return new SendResult { Success = false, Error = ex.Message };
        }
    }

    public async Task<SendResult> SendMediaAsync(string phone, string content, string mediaUrl)
    {
        // For now, redirecting to Text or implement if needed
        return await SendTextAsync(phone, $"{content}\n\n{mediaUrl}");
    }
}
