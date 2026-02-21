using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;

namespace Sapienza.Leads.Sequences;

public class TwilioMessageGateway : IMessageGateway, ITransientDependency
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TwilioMessageGateway> _logger;

    public TwilioMessageGateway(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<TwilioMessageGateway> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<SendResult> SendTextAsync(string phone, string content)
    {
        // This is a default implementation, but Twilio usually needs to know if it's SMS or WhatsApp.
        // For the interface compatibility, we might default to SMS or check some context.
        // Better: implement a more flexible SendAsync or handle it in the worker.
        return await SendAsync(phone, content, "sms");
    }

    public async Task<SendResult> SendMediaAsync(string phone, string content, string mediaUrl)
    {
        // Basic implementation for media
        return await SendAsync(phone, $"{content} {mediaUrl}", "sms");
    }

    public async Task<SendResult> SendAsync(string phone, string content, string channel)
    {
        try
        {
            var accountSid = _configuration["Twilio:AccountSid"];
            var authToken = _configuration["Twilio:AuthToken"];
            var fromSms = _configuration["Twilio:FromNumber"];
            var fromWhatsApp = _configuration["Twilio:WhatsAppFromNumber"];

            if (string.IsNullOrEmpty(accountSid) || string.IsNullOrEmpty(authToken))
            {
                return new SendResult { Success = false, Error = "Twilio configuration (Sid/Token) is missing." };
            }

            var isWhatsApp = channel.Equals("whatsapp", StringComparison.OrdinalIgnoreCase);
            var from = isWhatsApp ? fromWhatsApp : fromSms;
            
            if (string.IsNullOrEmpty(from))
            {
                return new SendResult { Success = false, Error = $"Twilio 'From' number for {channel} is missing." };
            }

            var url = $"https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json";
            
            var to = isWhatsApp ? $"whatsapp:{phone}" : phone;
            var fromFormatted = isWhatsApp ? $"whatsapp:{from}" : from;

            var values = new Dictionary<string, string>
            {
                { "To", to },
                { "From", fromFormatted },
                { "Body", content }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url);
            var authHeaderValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{accountSid}:{authToken}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);
            request.Content = new FormUrlEncodedContent(values);

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation($"Message sent to {phone} via Twilio {channel}.");
                return new SendResult { Success = true };
            }

            _logger.LogError($"Failed to send Twilio message to {phone}. Status: {response.StatusCode}, Response: {responseContent}");
            return new SendResult { Success = false, Error = $"Twilio Error: {response.StatusCode}. {responseContent}" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Exception sending message to {phone} via Twilio.");
            return new SendResult { Success = false, Error = ex.Message };
        }
    }
}
