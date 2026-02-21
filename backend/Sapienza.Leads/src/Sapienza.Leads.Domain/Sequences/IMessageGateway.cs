using System.Threading.Tasks;

namespace Sapienza.Leads.Sequences;

public class SendResult
{
    public bool Success { get; set; }
    public string? MessageId { get; set; }
    public string? Error { get; set; }
}

public interface IMessageGateway
{
    Task<SendResult> SendTextAsync(string phone, string content);
    Task<SendResult> SendMediaAsync(string phone, string content, string mediaUrl);
}
