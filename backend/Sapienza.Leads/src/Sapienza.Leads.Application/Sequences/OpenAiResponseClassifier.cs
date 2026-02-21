using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Volo.Abp.DependencyInjection;

namespace Sapienza.Leads.Sequences;

public class OpenAiResponseClassifier : IResponseClassifier, ITransientDependency
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenAiResponseClassifier> _logger;

    public OpenAiResponseClassifier(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<OpenAiResponseClassifier> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ClassificationResult> ClassifyAsync(string leadName, string message)
    {
        try
        {
            var apiKey = _configuration["OpenAi:ApiKey"];
            var model = _configuration["OpenAi:Model"] ?? "gpt-4o-mini";

            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("OpenAI API Key is missing. Using default classification.");
                return new ClassificationResult { Classification = "curioso", Confidence = 0.5 };
            }

            var url = "https://api.openai.com/v1/chat/completions";
            
            var prompt = $@"Aja como um SDR experiente. Classifique a resposta do lead '{leadName}' abaixo.
Resposta do Lead: ""{message}""

Classificações possíveis:
- 'interesse': Lead deseja saber mais, agendar call, ou demonstra forte interesse.
- 'duvida': Lead fez uma pergunta técnica ou de negócio.
- 'sem_interesse': Lead disse que não quer ou pediu para ser removido.
- 'spam': Respostas sem sentido ou automáticas.

Responda APENAS em formato JSON:
{{
  ""classification"": ""categoria"",
  ""confidence"": 0.XX
}}";

            var payload = new
            {
                model = model,
                messages = new[]
                {
                    new { role = "system", content = "Você é um assistente de qualificação de leads B2B." },
                    new { role = "user", content = prompt }
                },
                response_format = new { type = "json_object" },
                temperature = 0
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("Authorization", $"Bearer {apiKey}");
            request.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var apiResponse = JsonConvert.DeserializeObject<OpenAiChatResponse>(responseContent);
                var jsonResult = apiResponse?.Choices?[0]?.Message?.Content;
                
                if (!string.IsNullOrEmpty(jsonResult))
                {
                    return JsonConvert.DeserializeObject<ClassificationResult>(jsonResult) 
                           ?? new ClassificationResult { Classification = "curioso", Confidence = 0.5 };
                }
            }

            _logger.LogError($"OpenAI API Error: {response.StatusCode} - {responseContent}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling OpenAI API for classification.");
        }

        return new ClassificationResult { Classification = "curioso", Confidence = 0.5 };
    }

    private class OpenAiChatResponse
    {
        public Choice[]? Choices { get; set; }
    }

    private class Choice
    {
        public MessageContent? Message { get; set; }
    }

    private class MessageContent
    {
        public string? Content { get; set; }
    }
}
