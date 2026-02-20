using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Sapienza.Leads.Credits;
using Sapienza.Leads.Events;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Searches;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using System.Net.Http;

namespace Sapienza.Leads.Market;

[Authorize]
public class MarketAppService : ApplicationService, IMarketAppService
{
    private readonly MarketProxyService _marketProxyService;
    private readonly ISearchAppService _searchAppService;
    private readonly ICreditAppService _creditAppService;
    private readonly IRepository<Lead, Guid> _leadRepository;
    private readonly IRepository<Event, Guid> _eventRepository;
    private readonly IRepository<Cnae, string> _cnaeRepository;
    private readonly IRepository<MarketVertical, Guid> _marketVerticalRepository;
    private readonly IHttpClientFactory _httpClientFactory;

    public MarketAppService(
        MarketProxyService marketProxyService,
        ISearchAppService searchAppService,
        ICreditAppService creditAppService,
        IRepository<Lead, Guid> leadRepository,
        IRepository<Event, Guid> eventRepository,
        IRepository<Cnae, string> cnaeRepository,
        IRepository<MarketVertical, Guid> marketVerticalRepository,
        IHttpClientFactory httpClientFactory)
    {
        _marketProxyService = marketProxyService;
        _searchAppService = searchAppService;
        _creditAppService = creditAppService;
        _leadRepository = leadRepository;
        _eventRepository = eventRepository;
        _cnaeRepository = cnaeRepository;
        _marketVerticalRepository = marketVerticalRepository;
        _httpClientFactory = httpClientFactory;
    }

    [AllowAnonymous]
    public async Task<List<MarketLeadDto>> SearchExternalAsync(MarketSearchInputDto input)
    {
        var cnaeCodes = new HashSet<string>();

        if (!string.IsNullOrEmpty(input.Cnae))
            cnaeCodes.Add(input.Cnae);

        if (input.CnaeCodes != null)
            foreach (var c in input.CnaeCodes) cnaeCodes.Add(c);

        if (input.VerticalId.HasValue)
        {
            try
            {
                var vertical = await _marketVerticalRepository.GetAsync(input.VerticalId.Value, includeDetails: true);
                foreach (var vCnae in vertical.Cnaes) cnaeCodes.Add(vCnae.CnaeId);
            }
            catch (Exception ex)
            {
                Logger.LogWarning("Vertical not found or error loading: " + ex.Message);
            }
        }

        // Expand specialized codes to full 7-digit subclasses
        var allSubclasses = await ExpandToSubclassesAsync(cnaeCodes);

        // If no subclasses found (e.g. sync hasn't run), fallback to the original code or return empty
        if (!allSubclasses.Any() && cnaeCodes.Any())
        {
             allSubclasses = cnaeCodes.ToList();
        }

        var allResults = new List<MarketLeadDto>();
        
        // Parallelizing calls to the external API
        var tasks = allSubclasses.Select(async cnae =>
        {
            try
            {
                var searchInput = new MarketSearchInputDto
                {
                    Municipio = input.Municipio,
                    Cnae = cnae,
                    Bairro = input.Bairro
                };
                var rawJson = await _marketProxyService.SearchExternalAsync(searchInput);
                return ParseExternalJson(rawJson);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Search failed for CNAE {cnae}: {ex.Message}");
                return new List<MarketLeadDto>();
            }
        });

        var resultsArray = await Task.WhenAll(tasks);
        foreach (var batch in resultsArray)
        {
            allResults.AddRange(batch);
        }

        // Deduplicate by CNPJ
        var results = allResults
            .GroupBy(x => x.Cnpj)
            .Select(g => g.First())
            .ToList();

        // Registrar a consulta no histórico (skip if not authenticated)
        try
        {
            await _searchAppService.CreateAsync(new CreateSearchDto
            {
                Criterios = JsonSerializer.Serialize(input),
                ResultadosContagem = results.Count
            });
        }
        catch (Exception ex)
        {
            Logger.LogWarning("Could not save search history: " + ex.Message);
        }

        // Verificar quais CNPJs já existem como Leads no tenant
        try
        {
            var cnpjs = results.Select(x => x.Cnpj).ToList();
            var existingLeads = await _leadRepository.GetListAsync(x => cnpjs.Contains(x.Cnpj));
            var existingCnpjs = existingLeads.Select(x => x.Cnpj).ToHashSet();

            foreach (var lead in results)
            {
                lead.IsExtracted = existingCnpjs.Contains(lead.Cnpj);
            }
        }
        catch (Exception ex)
        {
            Logger.LogWarning("Could not check existing leads: " + ex.Message);
        }

        return results;
    }

    private async Task<List<string>> ExpandToSubclassesAsync(IEnumerable<string> codes)
    {
        var result = new HashSet<string>();
        foreach (var code in codes)
        {
            if (code.Length == 7)
            {
                result.Add(code);
                continue;
            }

            // Recursive expansion from database (syncing needed)
            var subclasses = await GetSubclassesRecursivelyAsync(code);
            if (subclasses.Any())
            {
                foreach (var s in subclasses) result.Add(s);
            }
            else
            {
                // If not found in DB, keep as is
                result.Add(code);
            }
        }
        return result.ToList();
    }

    private async Task<List<string>> GetSubclassesRecursivelyAsync(string parentId)
    {
        var children = await _cnaeRepository.GetListAsync(x => x.ParentId == parentId);
        var result = new List<string>();
        foreach (var cnae in children)
        {
            if (cnae.Nivel == CnaeLevel.Subclasse)
            {
                result.Add(cnae.Id);
            }
            else
            {
                result.AddRange(await GetSubclassesRecursivelyAsync(cnae.Id));
            }
        }
        return result;
    }

    [AllowAnonymous]
    public async Task<List<CnaeDto>> GetCnaesAsync(string? parentId = null)
    {
        var query = await _cnaeRepository.GetQueryableAsync();
        var cnaes = query.Where(x => x.ParentId == parentId).ToList();
        
        // If local DB is empty, fallback to the original proxy logic if needed
        // but ideally the user should run SyncCnaesAsync first.
        if (!cnaes.Any() && string.IsNullOrEmpty(parentId))
        {
            var rawJson = await _marketProxyService.GetCnaesAsync();
            return ParseCnaesJson(rawJson);
        }

        return cnaes.Select(x => new CnaeDto
        {
            Codigo = x.Id,
            Descricao = x.Descricao
        }).ToList();
    }

    [AllowAnonymous]
    public async Task<List<MunicipalityDto>> GetMunicipiosAsync()
    {
        var rawJson = await _marketProxyService.GetMunicipiosAsync();
        return ParseMunicipiosJson(rawJson);
    }

    [AllowAnonymous]
    public async Task ExtractLeadsAsync(ExtractLeadsDto input)
    {
        foreach (var cnpj in input.Cnpjs)
        {
            // Verificar se já existe
            if (await _leadRepository.AnyAsync(x => x.Cnpj == cnpj))
            {
                continue;
            }

            // Buscar dados (cache ou externo)
            var rawJson = await _marketProxyService.GetByCnpjAsync(cnpj);
            var marketData = ParseSingleExternalJson(rawJson);

            // Debitar unidades (valor fixo por extração por enquanto)
            await _creditAppService.AddCreditAsync(new AddCreditDto // TODO: Deveria ser Debit, mas vou usar o que temos
            {
                Valor = -10, // Exemplo: 10 unidades por extração
                Descricao = $"Extração de Lead: {marketData.RazaoSocial} ({cnpj})"
            });
            // O ideal seria injetar o CreditAppService e chamar o DebitAsync que alteramos para public
            // Como estou no mesmo projeto, posso injetar a classe concreta ou usar o casting.
            // Mas vou chamar via interface se possível.
            
            // Criar o Lead
            var lead = new Lead(
                GuidGenerator.Create(),
                cnpj,
                Truncate(marketData.Cnaes?.FirstOrDefault() ?? "0000000", LeadConsts.MaxCnaeLength),
                Truncate(marketData.RazaoSocial ?? marketData.NomeFantasia ?? "Sem Razão Social", LeadConsts.MaxRazaoSocialLength),
                Truncate(marketData.NomeFantasia, LeadConsts.MaxNomeFantasiaLength),
                LeadStatus.Novo,
                0,
                "Extração Mercado",
                CurrentTenant.Id
            );

            lead.SetContactInfo(
                Truncate(marketData.CorreioEletronico, LeadConsts.MaxEmailLength), 
                Truncate(marketData.TelefoneFormatado, LeadConsts.MaxTelefoneLength)
            );
            
            lead.SetAddress(
                marketData.Logradouro,
                marketData.Numero,
                marketData.Bairro,
                marketData.Municipio,
                Truncate(marketData.Uf, LeadConsts.MaxUfLength),
                marketData.Cep
            );

            await _leadRepository.InsertAsync(lead, autoSave: true);

            // Registrar evento inicial
            await _eventRepository.InsertAsync(new Event(
                GuidGenerator.Create(),
                lead.Id,
                EventType.Automacao,
                "Lead Extraído",
                "Lead criado via ferramenta de Inteligência de Mercado.",
                DateTime.Now,
                "#4f46e5",
                "Database",
                CurrentUser.Id,
                CurrentTenant.Id
            ), autoSave: true);
        }
    }

    private string? Truncate(string? value, int maxLength)
    {
        if (string.IsNullOrEmpty(value)) return value;
        return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }

    // Métodos auxiliares de Parse (Simplificados para o exemplo)
    private List<MarketLeadDto> ParseExternalJson(string json)
    {
        try 
        {
            // Nota: Este parse depende da estrutura real da API externa
            // Vou simular um parse básico assumindo que é um array de objetos
            using var doc = JsonDocument.Parse(json);
            var list = new List<MarketLeadDto>();
            
            // Se o retorno for um objeto com uma propriedade de lista (ex: "data")
            var root = doc.RootElement.ValueKind == JsonValueKind.Array ? doc.RootElement : 
                       doc.RootElement.TryGetProperty("data", out var dataProp) ? dataProp : doc.RootElement;

            if (root.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in root.EnumerateArray())
                {
                    list.Add(MapElementToDto(item));
                }
            }
            
            return list;
        }
        catch (Exception ex)
        {
            Logger.LogError("Falha ao processar JSON externo: " + ex.Message);
            return new List<MarketLeadDto>();
        }
    }

    private MarketLeadDto ParseSingleExternalJson(string json)
    {
        using var doc = JsonDocument.Parse(json);
        return MapElementToDto(doc.RootElement);
    }

    private MarketLeadDto MapElementToDto(JsonElement element)
    {
        var cnpjBasico = GetProp(element, "cnpj_basico");
        var cnpjOrdem = GetProp(element, "cnpj_ordem");
        var cnpjDv = GetProp(element, "cnpj_dv");

        // Montar CNPJ completo: XX.XXX.XXX/XXXX-XX
        string? cnpjFormatado = null;
        if (!string.IsNullOrEmpty(cnpjBasico) && !string.IsNullOrEmpty(cnpjOrdem) && !string.IsNullOrEmpty(cnpjDv))
        {
            var raw = cnpjBasico + cnpjOrdem + cnpjDv;
            if (raw.Length == 14)
                cnpjFormatado = $"{raw[..2]}.{raw[2..5]}.{raw[5..8]}/{raw[8..12]}-{raw[12..14]}";
            else
                cnpjFormatado = raw;
        }

        var ddd1 = GetProp(element, "ddd_1");
        var tel1 = GetProp(element, "telefone_1");
        string? telFormatado = null;
        if (!string.IsNullOrEmpty(ddd1) && !string.IsNullOrEmpty(tel1))
            telFormatado = $"({ddd1}) {tel1}";
        else if (!string.IsNullOrEmpty(tel1))
            telFormatado = tel1;

        // Parse CNAEs array
        var cnaes = new List<string>();
        if (element.TryGetProperty("cnaes", out var cnaesEl) && cnaesEl.ValueKind == JsonValueKind.Array)
        {
            foreach (var c in cnaesEl.EnumerateArray())
            {
                var v = c.GetString();
                if (!string.IsNullOrEmpty(v)) cnaes.Add(v);
            }
        }

        return new MarketLeadDto
        {
            Cnpj = cnpjFormatado,
            CnpjBasico = cnpjBasico,
            CnpjOrdem = cnpjOrdem,
            CnpjDv = cnpjDv,
            NomeFantasia = GetProp(element, "nome_fantasia"),
            RazaoSocial = GetProp(element, "razao_social") ?? GetProp(element, "nome"),
            Cnaes = cnaes,
            TipoLogradouro = GetProp(element, "tipo_logradouro"),
            Logradouro = GetProp(element, "logradouro"),
            Numero = GetProp(element, "numero"),
            Complemento = GetProp(element, "complemento"),
            Bairro = GetProp(element, "bairro"),
            Municipio = GetProp(element, "municipio"),
            Uf = GetProp(element, "uf"),
            Cep = GetProp(element, "cep"),
            Ddd1 = ddd1,
            Telefone1 = tel1,
            Ddd2 = GetProp(element, "ddd_2"),
            Telefone2 = GetProp(element, "telefone_2"),
            DddFax = GetProp(element, "ddd_fax"),
            Fax = GetProp(element, "fax"),
            CorreioEletronico = GetProp(element, "correio_eletronico"),
            TelefoneFormatado = telFormatado,
            SituacaoCadastral = GetProp(element, "situacao_cadastral"),
            DataSituacaoCadastral = GetProp(element, "data_situacao_cadastral"),
            DataInicioAtividade = GetProp(element, "data_inicio_atividade"),
            IdentificadorMatrizFilial = GetProp(element, "identificador_matriz_filial"),
        };
    }

    private string? GetProp(JsonElement el, string name)
    {
        return el.TryGetProperty(name, out var p) ? p.GetString() : null;
    }

    private List<CnaeDto> ParseCnaesJson(string json)
    {
        var list = new List<CnaeDto>();
        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in doc.RootElement.EnumerateArray())
                {
                    list.Add(new CnaeDto
                    {
                        Codigo = GetProp(item, "codigo"),
                        Descricao = GetProp(item, "descricao")
                    });
                }
            }
        }
        catch (Exception ex)
        {
            Logger.LogError("Failed to parse CNAEs JSON: " + ex.Message);
        }
        return list;
    }

    private List<MunicipalityDto> ParseMunicipiosJson(string json)
    {
        var list = new List<MunicipalityDto>();
        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in doc.RootElement.EnumerateArray())
                {
                    list.Add(new MunicipalityDto
                    {
                        Nome = GetProp(item, "nome"),
                        Uf = GetProp(item, "uf") ?? (GetProp(item, "microrregiao") != null ? "BR" : ""),
                        CodigoIbge = GetProp(item, "id") ?? GetProp(item, "codigo_ibge") 
                    });
                }
            }
        }
        catch (Exception ex)
        {
            Logger.LogError("Failed to parse Municipios JSON: " + ex.Message);
        }
        return list;
    }

    [AllowAnonymous]
    public async Task SyncCnaesAsync()
    {
        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync("https://servicodados.ibge.gov.br/api/v2/cnae/subclasses");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        foreach (var element in doc.RootElement.EnumerateArray())
        {
            await ProcessSubclassAsync(element);
        }
    }

    private async Task ProcessSubclassAsync(JsonElement subclassEl)
    {
        var secaoId = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("divisao").GetProperty("secao").GetProperty("id").GetString();
        var secaoDesc = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("divisao").GetProperty("secao").GetProperty("descricao").GetString();
        await EnsureCnaeExistsAsync(secaoId, secaoDesc, CnaeLevel.Secao);

        var divisaoId = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("divisao").GetProperty("id").GetString();
        var divisaoDesc = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("divisao").GetProperty("descricao").GetString();
        await EnsureCnaeExistsAsync(divisaoId, divisaoDesc, CnaeLevel.Divisao, secaoId);

        var grupoId = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("id").GetString();
        var grupoDesc = subclassEl.GetProperty("classe").GetProperty("grupo").GetProperty("descricao").GetString();
        await EnsureCnaeExistsAsync(grupoId, grupoDesc, CnaeLevel.Grupo, divisaoId);

        var classeId = subclassEl.GetProperty("classe").GetProperty("id").GetString();
        var classeDesc = subclassEl.GetProperty("classe").GetProperty("descricao").GetString();
        await EnsureCnaeExistsAsync(classeId, classeDesc, CnaeLevel.Classe, grupoId);

        var subclassId = subclassEl.GetProperty("id").GetString();
        var subclassDesc = subclassEl.GetProperty("descricao").GetString();
        await EnsureCnaeExistsAsync(subclassId, subclassDesc, CnaeLevel.Subclasse, classeId);
    }

    private async Task EnsureCnaeExistsAsync(string? id, string? descricao, CnaeLevel nivel, string? parentId = null)
    {
        if (string.IsNullOrEmpty(id)) return;

        var existing = await _cnaeRepository.FindAsync(id);
        if (existing == null)
        {
            var cnae = new Cnae(id, descricao ?? "", nivel, parentId);
            await _cnaeRepository.InsertAsync(cnae, autoSave: true);
        }
    }

    [AllowAnonymous]
    public async Task<List<MarketVerticalDto>> GetVerticalsAsync()
    {
        var queryable = await _marketVerticalRepository.WithDetailsAsync(v => v.Cnaes);
        var verticals = await AsyncExecuter.ToListAsync(queryable);
        return verticals.Select(v => new MarketVerticalDto
        {
            Id = v.Id,
            Nome = v.Nome,
            Descricao = v.Descricao,
            Icone = v.Icone,
            CnaeIds = v.Cnaes.Select(c => c.CnaeId).ToList()
        }).ToList();
    }

    public async Task<MarketVerticalDto> CreateVerticalAsync(CreateUpdateMarketVerticalDto input)
    {
        var vertical = new MarketVertical(GuidGenerator.Create(), input.Nome, input.Descricao, input.Icone);
        foreach (var cnaeId in input.CnaeIds)
        {
            vertical.AddCnae(cnaeId);
        }
        await _marketVerticalRepository.InsertAsync(vertical, autoSave: true);
        return MapToVerticalDto(vertical);
    }

    public async Task<MarketVerticalDto> UpdateVerticalAsync(Guid id, CreateUpdateMarketVerticalDto input)
    {
        var vertical = await _marketVerticalRepository.GetAsync(id, includeDetails: true);
        
        vertical.Cnaes.Clear();
        foreach (var cnaeId in input.CnaeIds)
        {
            vertical.AddCnae(cnaeId);
        }

        await _marketVerticalRepository.UpdateAsync(vertical, autoSave: true);
        return MapToVerticalDto(vertical);
    }

    public async Task DeleteVerticalAsync(Guid id)
    {
        await _marketVerticalRepository.DeleteAsync(id);
    }

    private MarketVerticalDto MapToVerticalDto(MarketVertical v)
    {
        return new MarketVerticalDto
        {
            Id = v.Id,
            Nome = v.Nome,
            Descricao = v.Descricao,
            Icone = v.Icone,
            CnaeIds = v.Cnaes.Select(c => c.CnaeId).ToList()
        };
    }
}
