using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Uow;

namespace Sapienza.Leads.Market;

/// <summary>
/// Seeds market verticals with their associated CNAE codes.
/// Uses Brazilian CNAE Subclasses (7-digit) for precise targeting.
/// Runs on application startup; skips if verticals already exist.
/// </summary>
public class MarketVerticalDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<MarketVertical, Guid> _verticalRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<MarketVerticalDataSeedContributor> _logger;

    public MarketVerticalDataSeedContributor(
        IRepository<MarketVertical, Guid> verticalRepository,
        IGuidGenerator guidGenerator,
        ILogger<MarketVerticalDataSeedContributor> logger)
    {
        _verticalRepository = verticalRepository;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    [UnitOfWork]
    public virtual async Task SeedAsync(DataSeedContext context)
    {
        if (await _verticalRepository.GetCountAsync() > 0)
        {
            _logger.LogInformation("Market verticals already seeded. Skipping.");
            return;
        }

        _logger.LogInformation("Seeding market verticals...");

        var verticals = GetVerticals();
        foreach (var (nome, descricao, icone, cnaes) in verticals)
        {
            var vertical = new MarketVertical(
                _guidGenerator.Create(),
                nome,
                descricao,
                icone
            );

            foreach (var cnae in cnaes)
            {
                vertical.AddCnae(cnae);
            }

            await _verticalRepository.InsertAsync(vertical, autoSave: true);
            _logger.LogInformation("Seeded vertical: {Nome} with {Count} CNAEs", nome, cnaes.Length);
        }

        _logger.LogInformation("Market verticals seeding completed.");
    }

    private static List<(string Nome, string Descricao, string Icone, string[] Cnaes)> GetVerticals()
    {
        return new List<(string, string, string, string[])>
        {
            (
                "Saúde",
                "Clínicas médicas, odontológicas, laboratórios, hospitais e profissionais de saúde",
                "heart-pulse",
                new[]
                {
                    "8610101", // Atividades de atendimento hospitalar
                    "8610102", // Atividades de atendimento em pronto-socorro
                    "8621601", // UTI móvel
                    "8621602", // Serviços móveis de atendimento a urgências
                    "8622400", // Serviços de remoção de pacientes
                    "8630501", // Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos
                    "8630502", // Atividade médica ambulatorial com recursos para realização de exames complementares
                    "8630503", // Atividade médica ambulatorial restrita a consultas
                    "8630504", // Atividade odontológica
                    "8630506", // Serviços de vacinação e imunização humana
                    "8630507", // Atividades de reprodução humana assistida
                    "8640201", // Laboratórios de anatomia patológica e citológica
                    "8640202", // Laboratórios clínicos
                    "8640203", // Serviços de diagnóstico por imagem com uso de radiação ionizante
                    "8640204", // Serviços de diagnóstico por imagem sem uso de radiação ionizante
                    "8640205", // Serviços de diagnóstico por registro gráfico - ECG, EEG e outros
                    "8640206", // Serviços de ressonância magnética
                    "8640207", // Serviços de diagnóstico por métodos ópticos
                    "8640208", // Serviços de diagnóstico por registro gráfico - ECG, EEG e outros análogos
                    "8650001", // Atividades de enfermagem
                    "8650002", // Atividades de profissionais da nutrição
                    "8650003", // Atividades de psicologia e psicanálise
                    "8650004", // Atividades de fisioterapia
                    "8650005", // Atividades de terapia ocupacional
                    "8650006", // Atividades de fonoaudiologia
                    "8650007", // Atividades de terapia de nutrição enteral e parenteral
                    "8690901", // Atividades de práticas integrativas e complementares em saúde humana
                    "8690903", // Atividades de acupuntura
                    "8690904", // Atividades de podologia
                }
            ),
            (
                "Jurídico",
                "Escritórios de advocacia, consultoria jurídica e serviços legais",
                "scale",
                new[]
                {
                    "6911701", // Serviços advocatícios
                    "6911702", // Atividades auxiliares da justiça
                    "6911703", // Agente de propriedade industrial
                    "6912500", // Cartórios
                }
            ),
            (
                "Contábil",
                "Escritórios de contabilidade, auditoria e consultoria fiscal",
                "calculator",
                new[]
                {
                    "6920601", // Atividades de contabilidade
                    "6920602", // Atividades de consultoria e auditoria contábil e tributária
                    "6621501", // Peritos e avaliadores de seguros
                    "6621502", // Auditoria e consultoria atuarial
                }
            ),
            (
                "Tecnologia da Informação",
                "Desenvolvimento de software, consultoria em TI, suporte técnico e infraestrutura",
                "laptop",
                new[]
                {
                    "6201501", // Desenvolvimento de programas de computador sob encomenda
                    "6201502", // Web design
                    "6202300", // Desenvolvimento e licenciamento de programas de computador customizáveis
                    "6203100", // Desenvolvimento e licenciamento de programas de computador não customizáveis
                    "6204000", // Consultoria em tecnologia da informação
                    "6209100", // Suporte técnico, manutenção e outros serviços em tecnologia da informação
                    "6311900", // Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet
                    "6319400", // Portais, provedores de conteúdo e outros serviços de informação na internet
                }
            ),
            (
                "Alimentação e Restaurantes",
                "Restaurantes, bares, lanchonetes, padarias e serviços de alimentação",
                "utensils",
                new[]
                {
                    "5611201", // Restaurantes e similares
                    "5611202", // Bares e outros estabelecimentos especializados em servir bebidas
                    "5611203", // Lanchonetes, casas de chá, de sucos e similares
                    "5611204", // Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento
                    "5611205", // Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento
                    "5612100", // Serviços ambulantes de alimentação
                    "5620101", // Fornecimento de alimentos preparados preponderantemente para empresas
                    "5620102", // Serviços de alimentação para eventos e recepções - bufê
                    "5620103", // Cantinas - serviços de alimentação privativos
                    "5620104", // Fornecimento de alimentos preparados preponderantemente para consumo domiciliar
                    "1091100", // Fabricação de produtos de panificação
                    "1091101", // Fabricação de produtos de panificação industrial
                    "1091102", // Fabricação de produtos de padaria e confeitaria com predominância de produção própria
                    "4721103", // Comércio varejista de laticínios e frios
                    "4721104", // Comércio varejista de doces, balas, bombons e semelhantes
                }
            ),
            (
                "Beleza e Estética",
                "Salões de beleza, barbearias, clínicas de estética e cosméticos",
                "sparkles",
                new[]
                {
                    "9602501", // Cabeleireiros
                    "9602502", // Atividades de estética e outros serviços de cuidados com a beleza
                    "9602503", // Atividades de manicure e pedicure
                    "8650099", // Atividades de profissionais da área de saúde não especificadas anteriormente
                    "4772500", // Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal
                    "9609202", // Agências matrimoniais
                }
            ),
            (
                "Educação",
                "Escolas, cursos profissionalizantes, idiomas, reforço escolar e treinamento corporativo",
                "graduation-cap",
                new[]
                {
                    "8511200", // Educação infantil - creche
                    "8512100", // Educação infantil - pré-escola
                    "8513900", // Ensino fundamental
                    "8520100", // Ensino médio
                    "8531700", // Educação superior - graduação
                    "8532500", // Educação superior - graduação e pós-graduação
                    "8533300", // Educação superior - pós-graduação e extensão
                    "8541400", // Educação profissional de nível técnico
                    "8542200", // Educação profissional de nível tecnológico
                    "8591100", // Ensino de esportes
                    "8592901", // Ensino de dança
                    "8592902", // Ensino de artes cênicas, exceto dança
                    "8592903", // Ensino de música
                    "8593700", // Ensino de idiomas
                    "8599601", // Formação de condutores
                    "8599602", // Cursos de pilotagem
                    "8599603", // Treinamento em informática
                    "8599604", // Treinamento em desenvolvimento profissional e gerencial
                    "8599605", // Cursos preparatórios para concursos
                    "8599699", // Outras atividades de ensino não especificadas anteriormente
                }
            ),
            (
                "Imobiliário",
                "Imobiliárias, corretores de imóveis, administração de condomínios e incorporação",
                "building-2",
                new[]
                {
                    "6810201", // Compra e venda de imóveis próprios
                    "6810202", // Aluguel de imóveis próprios
                    "6810203", // Loteamento de imóveis próprios
                    "6821801", // Corretagem na compra e venda e avaliação de imóveis
                    "6821802", // Corretagem no aluguel de imóveis
                    "6822600", // Gestão e administração da propriedade imobiliária
                    "4110700", // Incorporação de empreendimentos imobiliários
                }
            ),
            (
                "Automotivo",
                "Oficinas mecânicas, concessionárias, autopeças e serviços automotivos",
                "car",
                new[]
                {
                    "4511101", // Comércio a varejo de automóveis, camionetas e utilitários novos
                    "4511102", // Comércio a varejo de automóveis, camionetas e utilitários usados
                    "4520001", // Serviços de manutenção e reparação mecânica de veículos automotores
                    "4520002", // Serviços de lanternagem ou funilaria e pintura de veículos automotores
                    "4520003", // Serviços de manutenção e reparação elétrica de veículos automotores
                    "4520004", // Serviços de alinhamento e balanceamento de veículos automotores
                    "4520005", // Serviços de lavagem, lubrificação e polimento de veículos automotores
                    "4520006", // Serviços de borracharia para veículos automotores
                    "4520007", // Serviços de instalação, manutenção e reparação de acessórios para veículos automotores
                    "4530701", // Comércio por atacado de peças e acessórios novos para veículos automotores
                    "4530702", // Comércio por atacado de pneumáticos e câmaras de ar
                    "4530703", // Comércio a varejo de peças e acessórios novos para veículos automotores
                    "4530704", // Comércio a varejo de peças e acessórios usados para veículos automotores
                    "4530705", // Comércio a varejo de pneumáticos e câmaras de ar
                }
            ),
            (
                "Construção Civil",
                "Empreiteiras, construtoras, reformas, acabamento e engenharia civil",
                "hard-hat",
                new[]
                {
                    "4120400", // Construção de edifícios
                    "4211101", // Construção de rodovias e ferrovias
                    "4213800", // Obras de urbanização - ruas, praças e calçadas
                    "4221901", // Construção de barragens e represas para geração de energia elétrica
                    "4292801", // Montagem de estruturas metálicas
                    "4299501", // Construção de instalações esportivas e recreativas
                    "4312600", // Perfurações e sondagens
                    "4313400", // Obras de terraplenagem
                    "4321500", // Instalação e manutenção elétrica
                    "4322301", // Instalações hidráulicas, sanitárias e de gás
                    "4322302", // Instalação e manutenção de sistemas central e unitário de ar condicionado
                    "4329101", // Instalação de painéis publicitários
                    "4330401", // Impermeabilização em obras de engenharia civil
                    "4330402", // Instalação de portas, janelas, tetos, divisórias e armários embutidos de qualquer material
                    "4330403", // Obras de acabamento em gesso e estuque
                    "4330404", // Serviços de pintura de edifícios em geral
                    "4330405", // Aplicação de revestimentos e de resinas em interiores e exteriores
                    "4330499", // Outras obras de acabamento da construção
                    "4399101", // Administração de obras
                }
            ),
            (
                "Varejo e Comércio",
                "Lojas de vestuário, calçados, acessórios, eletrodomésticos e comércio em geral",
                "shopping-bag",
                new[]
                {
                    "4711301", // Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - hipermercados
                    "4711302", // Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados
                    "4712100", // Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados
                    "4713001", // Lojas de departamentos ou magazines
                    "4713002", // Lojas de variedades, exceto lojas de departamentos ou magazines
                    "4713003", // Lojas duty free de aeroportos internacionais
                    "4751200", // Comércio varejista especializado de equipamentos e suprimentos de informática
                    "4752100", // Comércio varejista especializado de equipamentos de telefonia e comunicação
                    "4753900", // Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo
                    "4755501", // Comércio varejista de tecidos
                    "4755502", // Comercio varejista de artigos de armarinho
                    "4755503", // Comercio varejista de artigos de cama, mesa e banho
                    "4781400", // Comércio varejista de artigos do vestuário e acessórios
                    "4782201", // Comércio varejista de calçados
                    "4783101", // Comércio varejista de artigos de joalheria
                    "4783102", // Comércio varejista de artigos de relojoaria
                    "4789001", // Comércio varejista de suvenires, bijuterias e artesanatos
                    "4789099", // Comércio varejista de outros produtos não especificados anteriormente
                }
            ),
            (
                "Agronegócio",
                "Produção agrícola, pecuária, insumos, máquinas agrícolas e agroindústria",
                "wheat",
                new[]
                {
                    "0111301", // Cultivo de arroz
                    "0111302", // Cultivo de milho
                    "0111303", // Cultivo de trigo
                    "0115600", // Cultivo de soja
                    "0119901", // Cultivo de abacaxi
                    "0131800", // Cultivo de laranja
                    "0141501", // Criação de bovinos para corte
                    "0141502", // Criação de bovinos para leite
                    "0151201", // Criação de aves
                    "0155501", // Criação de suínos
                    "4611700", // Representantes comerciais e agentes do comércio de matérias-primas agrícolas e animais vivos
                    "4621400", // Comércio atacadista de café em grão
                    "4623108", // Comércio atacadista de matérias-primas agrícolas
                    "4661300", // Comércio atacadista de máquinas, aparelhos e equipamentos para uso agropecuário
                }
            ),
            (
                "Fitness e Esportes",
                "Academias, personal trainers, estúdios de pilates, crossfit e atividades esportivas",
                "dumbbell",
                new[]
                {
                    "9311500", // Gestão de instalações de esportes
                    "9312300", // Clubes sociais, esportivos e similares
                    "9313100", // Atividades de condicionamento físico
                    "9319101", // Produção e promoção de eventos esportivos
                    "9319199", // Outras atividades esportivas não especificadas anteriormente
                    "8591100", // Ensino de esportes
                    "4763601", // Comércio varejista de brinquedos e artigos recreativos
                    "4763602", // Comércio varejista de artigos esportivos
                }
            ),
            (
                "Pet Shop e Veterinária",
                "Clínicas veterinárias, pet shops, banho e tosa, creches e hotéis para animais",
                "paw-print",
                new[]
                {
                    "7500100", // Atividades veterinárias
                    "4789004", // Comércio varejista de animais vivos e de artigos e alimentos para animais de estimação
                    "9609203", // Alojamento, higiene e embelezamento de animais
                    "0159801", // Apicultura
                    "0159802", // Aquicultura
                }
            ),
        };
    }
}
