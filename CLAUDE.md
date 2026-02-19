# CLAUDE.md

Guia para o Claude Code ao trabalhar neste repositório.

## Visão Geral do Projeto

**DominusLeads** — Plataforma SaaS de prospecção B2B orientada a dados públicos (CNPJ/CNAE). Permite que empresas encontrem e qualifiquem leads com base em dados oficiais da Receita Federal, integrando busca, enriquecimento, gestão de créditos e CRM num único produto.

## Estrutura do Repositório

```
DominusLeads/
├── backend/Sapienza.Leads/        # API principal (.NET 10 + ABP Framework)
├── DominusLeads.Web.Portal/       # Dashboard React (portal do usuário)
├── frontend/                      # Dashboard React alternativo
├── landingpage/                   # Site institucional (Next.js)
├── docs/                          # Documentação técnica, PRDs, backlog
├── screen-prototypes/             # Protótipos de UI
├── scripts/                       # Scripts de automação
└── docker-compose.yml             # Orquestração local completa
```

## Stack Tecnológica

### Backend (`backend/Sapienza.Leads/`)

| Componente    | Tecnologia                         |
|---------------|------------------------------------|
| Runtime       | .NET 10                            |
| Framework     | ABP Framework 10.x (DDD/SaaS)      |
| Banco de dados| PostgreSQL 17                      |
| ORM           | Entity Framework Core 10           |
| Auth          | OpenIddict (OAuth 2.0)             |
| Mapeamento    | Mapperly                           |
| Validação     | FluentValidation                   |
| Testes        | xUnit + Shouldly + NSubstitute     |
| Logging       | Serilog                            |
| Documentação  | Swashbuckle (Swagger/OpenAPI)      |

### Frontend — Portal (`DominusLeads.Web.Portal/`)

| Componente        | Tecnologia              |
|-------------------|-------------------------|
| Framework         | React 19                |
| Build             | Vite 7                  |
| Linguagem         | TypeScript 5.9          |
| Estilo            | Tailwind CSS 4          |
| Roteamento        | React Router 7          |
| Dados             | React Query 5 + Axios   |
| Estado global     | Zustand 5               |
| Validação         | Zod 4                   |
| Componentes UI    | Radix UI + Lucide React |
| Gráficos          | Recharts 3              |

### Landing Page (`landingpage/`)

| Componente  | Tecnologia        |
|-------------|-------------------|
| Framework   | Next.js 16        |
| Linguagem   | TypeScript        |
| Estilo      | Tailwind CSS 4    |
| Animações   | Framer Motion 12  |

## Comandos Rápidos

### Backend

```bash
# Build
dotnet build backend/Sapienza.Leads/

# Rodar API localmente
dotnet run --project backend/Sapienza.Leads/src/Sapienza.Leads.HttpApi.Host

# Executar testes
dotnet test backend/Sapienza.Leads/

# Adicionar migration (dentro da pasta do projeto EF)
dotnet ef migrations add <NomeDaMigration> \
  --project src/Sapienza.Leads.EntityFrameworkCore \
  --startup-project src/Sapienza.Leads.HttpApi.Host
```

### Frontend (Portal)

```bash
cd DominusLeads.Web.Portal
npm install
npm run dev      # Servidor de desenvolvimento (http://localhost:5180)
npm run build    # Build de produção
npm run lint     # Lint ESLint
npm run preview  # Preview do build
```

### Landing Page

```bash
cd landingpage
npm install
npm run dev      # Servidor de desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm run lint     # Lint ESLint
npm start        # Servidor de produção
```

### Docker (stack completa)

```bash
docker-compose up          # Inicia todos os serviços
docker-compose up --build  # Rebuild e inicia
docker-compose down        # Para e remove containers
```

**Portas (Docker):**

| Serviço     | Porta |
|-------------|-------|
| Backend API | 8080  |
| Frontend    | 5180  |
| Landing     | 3000  |
| PostgreSQL  | 5432  |

## Arquitetura do Backend (DDD/ABP)

```
src/
├── Sapienza.Leads.Domain/                # Entidades, regras de negócio
├── Sapienza.Leads.Domain.Shared/         # Enums, constantes, localização
├── Sapienza.Leads.Application/           # AppServices, lógica de aplicação
├── Sapienza.Leads.Application.Contracts/ # DTOs, interfaces de serviço
├── Sapienza.Leads.EntityFrameworkCore/   # DbContext, migrations, repositórios
├── Sapienza.Leads.HttpApi/               # Controllers REST
├── Sapienza.Leads.HttpApi.Host/          # Host, configuração, Program.cs
└── Sapienza.Leads.DbMigrator/           # Console app para migrations
```

## Entidades Principais

| Entidade        | Descrição                                            |
|-----------------|------------------------------------------------------|
| `Lead`          | Prospect B2B (CNPJ, CNAE, status, score 0-100)       |
| `Credit`        | Saldo de créditos do tenant (modelo pay-per-lead)    |
| `Transaction`   | Histórico de débito/crédito                          |
| `Search`        | Filtros/campanhas de busca por CNAE                  |
| `Event`         | Registro de interações com leads                     |

## Convenções de Código

### Backend (.NET/ABP)

| Tipo          | Padrão                         | Exemplo                    |
|---------------|--------------------------------|----------------------------|
| Entidade      | PascalCase                     | `Lead`                     |
| DTO           | `{Entidade}Dto`                | `LeadDto`                  |
| AppService    | `{Entidade}AppService`         | `LeadAppService`           |
| Controller    | `{Entidade}sController`        | `LeadsController`          |
| Migration     | Descritivo com prefixo `Added_`| `Added_Lead_Entity`        |

**Regras críticas:**
- Entidades herdam de `FullAuditedAggregateRoot<Guid>`
- Validação via **FluentValidation** (nunca Data Annotations)
- Mapeamento via **Mapperly** (nunca AutoMapper)
- Nunca expor entidades diretamente — sempre usar DTOs

### Frontend (React/TypeScript)

- Componentes em PascalCase, arquivos `.tsx`
- Hooks customizados com prefixo `use`
- Dados remotos gerenciados via React Query
- Estado global mínimo via Zustand
- Validação de formulários com Zod + React Hook Form

## Variáveis de Ambiente

### Backend (`appsettings.json`)

```json
{
  "App": { "SelfUrl": "http://localhost:8080" },
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=Leads;User ID=root;Password=myPassword;"
  },
  "Settings": {
    "Leads": { "MarketApiBaseUrl": "http://89.167.29.36:8080" }
  }
}
```

### Frontend Portal (`.env`)

```env
VITE_API_URL=http://localhost:8080
VITE_OIDC_CLIENT_ID=Leads_App
VITE_OIDC_SCOPE=openid profile email offline_access Leads
```

## Integrações Externas

| Serviço       | Descrição                                        |
|---------------|--------------------------------------------------|
| Market API    | Fonte de dados CNPJ/CNAE (http://89.167.29.36:8080) |
| OpenIddict    | Servidor OAuth 2.0 embutido no backend           |

CORS habilitado para: `localhost:3000`, `localhost:5173`, `localhost:5180`.

## Testes

```bash
# Todos os testes
dotnet test backend/Sapienza.Leads/

# Projeto específico
dotnet test backend/Sapienza.Leads/test/Sapienza.Leads.Application.Tests/
dotnet test backend/Sapienza.Leads/test/Sapienza.Leads.Domain.Tests/
dotnet test backend/Sapienza.Leads/test/Sapienza.Leads.EntityFrameworkCore.Tests/
```

Padrão de testes: **xUnit + Shouldly** para asserções, **NSubstitute** para mocks.

## Documentação Relevante

| Arquivo                          | Conteúdo                              |
|----------------------------------|---------------------------------------|
| `docs/prd-tecnico-dominus-leads.md` | Requisitos técnicos do produto     |
| `docs/plano-implementacao.md`    | Roadmap de implementação              |
| `docs/backlog.md`                | Backlog por épicos (sincronizado no GitHub Issues) |
| `docs/entidades/Lead.md`         | Especificação da entidade Lead        |
| `docs/entidades/Credit.md`       | Especificação do sistema de créditos  |
| `docs/api-dados-specs.md`        | Especificação da API de dados         |
| `docs/design-system-dominus.md`  | Design system e guia de UI/UX         |
| `backend/Sapienza.Leads/CLAUDE.md` | Guia Claude específico do backend  |

## Skills e Agentes Disponíveis (Claude Code)

Consulte `.claude/GUIDELINES.md` para a lista completa de skills e agentes configurados para este projeto, incluindo:

- `abp-framework-patterns` — Entidades, DTOs, AppServices
- `efcore-patterns` — DbContext e migrations
- `react-development-patterns` — Componentes React
- `xunit-testing-patterns` — Testes unitários e integração
