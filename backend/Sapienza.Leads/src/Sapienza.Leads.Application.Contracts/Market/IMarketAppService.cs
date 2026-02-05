using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Sapienza.Leads.Market;

public interface IMarketAppService : IApplicationService
{
    /// <summary>
    /// Realiza busca na API externa e registra no histórico de pesquisas.
    /// </summary>
    Task<List<MarketLeadDto>> SearchExternalAsync(MarketSearchInputDto input);

    /// <summary>
    /// Extrai leads selecionados para o CRM e debita créditos.
    /// </summary>
    Task ExtractLeadsAsync(ExtractLeadsDto input);
}
