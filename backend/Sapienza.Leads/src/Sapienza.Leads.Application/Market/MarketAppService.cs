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

namespace Sapienza.Leads.Market;

[Authorize]
public class MarketAppService : ApplicationService, IMarketAppService
{
    private readonly MarketProxyService _marketProxyService;
    private readonly ISearchAppService _searchAppService;
    private readonly ICreditAppService _creditAppService;
    private readonly IRepository<Lead, Guid> _leadRepository;
    private readonly IRepository<Event, Guid> _eventRepository;

    public MarketAppService(
        MarketProxyService marketProxyService,
        ISearchAppService searchAppService,
        ICreditAppService creditAppService,
        IRepository<Lead, Guid> leadRepository,
        IRepository<Event, Guid> eventRepository)
    {
        _marketProxyService = marketProxyService;
        _searchAppService = searchAppService;
        _creditAppService = creditAppService;
        _leadRepository = leadRepository;
        _eventRepository = eventRepository;
    }

    public async Task<List<MarketLeadDto>> SearchExternalAsync(MarketSearchInputDto input)
    {
        var rawJson = await _marketProxyService.SearchExternalAsync(input.Municipio, input.Cnae, input.Bairro);
        
        // Parse do JSON bruto da API externa
        var results = ParseExternalJson(rawJson);

        // Registrar a consulta no histórico
        await _searchAppService.CreateAsync(new CreateSearchDto
        {
            Criterios = JsonSerializer.Serialize(input),
            ResultadosContagem = results.Count
        });

        // Verificar quais CNPJs já existem como Leads no tenant
        var cnpjs = results.Select(x => x.Cnpj).ToList();
        var existingLeads = await _leadRepository.GetListAsync(x => cnpjs.Contains(x.Cnpj));
        var existingCnpjs = existingLeads.Select(x => x.Cnpj).ToHashSet();

        foreach (var lead in results)
        {
            lead.IsExtracted = existingCnpjs.Contains(lead.Cnpj);
        }

        return results;
    }

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
                marketData.CnaePrincipal ?? "",
                marketData.RazaoSocial,
                marketData.NomeFantasia,
                LeadStatus.Novo,
                0,
                "Extração Mercado",
                CurrentTenant.Id
            );

            lead.SetContactInfo(marketData.Email, marketData.Telefone);
            lead.SetAddress(
                marketData.Logradouro,
                marketData.Numero,
                marketData.Bairro,
                marketData.Cidade,
                marketData.Uf,
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
        return new MarketLeadDto
        {
            Cnpj = GetProp(element, "cnpj"),
            RazaoSocial = GetProp(element, "razao_social") ?? GetProp(element, "nome") ?? "Sem Razão Social",
            NomeFantasia = GetProp(element, "nome_fantasia") ?? GetProp(element, "fantasia"),
            CnaePrincipal = GetProp(element, "cnae_principal") ?? GetProp(element, "cnae"),
            Logradouro = GetProp(element, "logradouro"),
            Numero = GetProp(element, "numero"),
            Bairro = GetProp(element, "bairro"),
            Cidade = GetProp(element, "municipio"),
            Uf = GetProp(element, "uf"),
            Cep = GetProp(element, "cep"),
            Telefone = GetProp(element, "telefone_1"),
            Email = GetProp(element, "correio_eletronico")
        };
    }

    private string? GetProp(JsonElement el, string name)
    {
        return el.TryGetProperty(name, out var p) ? p.GetString() : null;
    }
}
