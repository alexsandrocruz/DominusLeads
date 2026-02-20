using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

    [AllowAnonymous]
    Task<List<CnaeDto>> GetCnaesAsync(string? parentId = null);
    
    [AllowAnonymous]
    Task<List<MunicipalityDto>> GetMunicipiosAsync();

    [AllowAnonymous]
    Task SyncCnaesAsync();

    [AllowAnonymous]
    Task<List<MarketVerticalDto>> GetVerticalsAsync();

    Task<MarketVerticalDto> CreateVerticalAsync(CreateUpdateMarketVerticalDto input);

    Task<MarketVerticalDto> UpdateVerticalAsync(Guid id, CreateUpdateMarketVerticalDto input);

    Task DeleteVerticalAsync(Guid id);
}
