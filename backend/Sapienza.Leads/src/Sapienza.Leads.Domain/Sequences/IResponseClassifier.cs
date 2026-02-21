using System.Threading.Tasks;

namespace Sapienza.Leads.Sequences;

public class ClassificationResult
{
    public string Classification { get; set; } = string.Empty;
    // "interesse", "duvida", "sem_interesse", "spam"
    public double Confidence { get; set; }
}

public interface IResponseClassifier
{
    Task<ClassificationResult> ClassifyAsync(string leadName, string message);
}
