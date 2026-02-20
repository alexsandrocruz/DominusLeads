# Backlog do Projeto DominusLeads

> **Atualizado em:** 20/02/2026
> Este backlog reflete o estado real da implementação (AS-IS) e o roadmap priorizado (TO-BE).

---

## 📊 Resumo Executivo

| Métrica | Valor |
|:---|:---|
| **Entidades de Domínio** | 8 implementadas |
| **Páginas Frontend (Portal)** | 8 implementadas |
| **Endpoints de API** | ~20 operacionais |
| **Infraestrutura** | Docker Compose (local) |
| **Landing Page** | ✅ Publicável |
| **Auth & Onboarding** | ✅ Funcional |
| **CRM Pipeline** | ✅ Kanban + Drag-and-drop |

---

## ✅ AS-IS — O que está implementado e funcionando

### Core Domain (Backend — ABP Framework / .NET)

- [x] **Lead** — Aggregate Root com CRUD completo (`LeadAppService`)
  - Status, Score, dados de contato, endereço, CNPJ, CNAE principal
  - Mapeamento Mapperly
- [x] **Credit & Transaction** — Gestão de saldo por Tenant (`CreditAppService`)
  - Débito/crédito atômico, saldo inicial automático, extrato
- [x] **Event** — Timeline de interações do Lead (`EventAppService`)
  - Eventos criados automaticamente na extração
- [x] **Search** — Histórico de consultas de mercado (`SearchAppService`)
  - Registro de critérios + contagem de resultados
- [x] **Cnae** — Entidade com hierarquia completa IBGE (`Entity<string>`)
  - 5 níveis: Seção → Divisão → Grupo → Classe → Subclasse
  - Sincronização automática via API IBGE (`SyncCnaesAsync`)
- [x] **MarketVertical** — Agrupamentos de CNAEs por segmento
  - Relação N:N com CNAEs, CRUD completo
- [x] **ConsultedLead** — Cache de CNPJs consultados externamente
  - TTL configurável, atualização automática
- [x] **MarketAppService** — Orquestrador de busca
  - Busca agregada multi-CNAE com expansão de subclasses
  - Deduplicação por CNPJ
  - Proxy para API externa com cache
  - Extração em lote com débito de créditos

### Infraestrutura

- [x] **Docker Compose** — 4 serviços (db, backend, frontend, landingpage)
- [x] **PostgreSQL 17** — Banco relacional
- [x] **ABP Anti-Forgery** desabilitado para SPA
- [x] **AllowAnonymous** nos endpoints públicos de busca
- [x] **IBGE CNAE Sync** — Importação automática de toda hierarquia CNAE

### Frontend — DominusLeads.Web.Portal (React/TS/Tailwind)

- [x] **SearchLeadsPage** — Motor de busca com 3 modos:
  - Rápida (CNAE typeahead), Vertical (seletor de segmentos), Avançada (árvore CNAE multi-select)
  - Extração individual e em lote
  - Indicador de leads já extraídos
- [x] **CnaeTypeahead** — Autocomplete offline com ~1300 CNAEs (arquivo JSON local)
- [x] **CnaeSelectorModal** — Modal de navegação/seleção hierárquica CNAE
- [x] **VerticalSelector** — Cards de seleção de segmentos de mercado
- [x] **LeadsListPage** — Listagem com toggle Kanban/Lista, busca textual, filtros avançados (CNAE, Cidade)
- [x] **KanbanBoard** — Pipeline visual com drag-and-drop entre estágios (`@dnd-kit`)
  - Colunas: Novo → Contatado → Qualificado → Proposta → Fechado
  - `useDroppable` por coluna, feedback visual no drop, distinção click vs drag
- [x] **LeadDetailPage** — Detalhes do lead + Timeline de eventos + Labels de status atualizados
- [x] **BillingDashboardPage** — Saldo e extrato de créditos
- [x] **Dashboard** — KPIs reais do backend (leads, créditos, taxa conversão, evolução semanal)
- [x] **OnboardingPage** — Carrossel de boas-vindas + checklist de configuração
- [x] **Login/Register** — Autenticação com ABP Identity

### Landing Page

- [x] **Landing Page completa** — Design Sapienza, responsiva, deploy Docker
- [x] **Planos e Pricing** — Seção de preços com 3 planos

### Segundo Frontend (frontend/ — em construção)

- [x] **Scaffold inicial** — React + Vite com componentes base
- [x] **API client** (`api.ts`) — Integração com endpoints de Market
- [x] **CnaeSelectorModal** — Versão alternativa com modal genérico
- [x] **VerticalSelector** — Versão alternativa
- [x] **Modal** — Componente UI reutilizável

---

## 🔴 TO-BE — O que falta para o produto completo

### 🔥 Prioridade Alta (MVP Comercial)

#### P1. Autenticação & Multi-Tenancy
- [x] Login/Registro com ABP Identity (email/senha)
- [ ] SSO com Google (opcional)
- [x] Middleware de isolamento por Tenant
- [x] Tela de Login no frontend
- [x] Tela de Onboarding (carrossel de boas-vindas)
- [ ] Roles: Admin, Vendedor, Viewer

#### P2. Dashboard Real
- [x] Conectar indicadores ao backend (total leads, créditos, taxa conversão)
- [x] KPIs: Leads extraídos no mês, buscas realizadas, créditos consumidos
- [x] Gráfico de evolução de leads por semana
- [x] Atividade recente (últimos eventos)

#### P3. CRM — Pipeline de Vendas
- [x] Kanban de Leads (Novo → Contatado → Qualificado → Proposta → Fechado)
- [x] Mover lead entre estágios com drag-and-drop (`@dnd-kit` + `useDroppable`)
- [x] Filtros avançados (por status, CNAE, cidade, score)
- [x] Busca textual na lista de leads
- [x] API de atualização de status (`UpdateStatusAsync`) com log de `Event`
- [x] API de notas manuais (`AddNoteAsync`) com `EventType.Nota`
- [x] Enum `LeadStatus` atualizado: Novo, Contatado, Qualificado, Proposta, Fechado, Descartado
- [x] UI de notas e atividades manuais no Lead Detail

#### P4. Billing — Recarga de Créditos
- [ ] Integração com gateway de pagamento (Stripe ou similar)
- [ ] Tela de recarga com seletor de pacotes
- [ ] Webhooks de confirmação de pagamento
- [ ] Alertas de saldo baixo (email/in-app)
- [ ] Planos de assinatura com créditos mensais

#### P5. Seed de Verticais de Mercado
- [x] Popular banco com verticais relevantes (Saúde, Jurídico, TI, Contábil, etc.)
- [x] Associar CNAEs corretos a cada vertical
- [x] Ícones e descrições para cada vertical
- [ ] Tela admin para CRUD de verticais

---

### ⚡ Prioridade Média (Diferenciação)

#### P6. Automação de Prospecção
- [ ] Integração com plataforma de WhatsApp (Twilio, Evolution API)
- [ ] Templates de mensagem configuráveis por tenant
- [ ] Envio automatizado com fallback SMS/Email
- [ ] Classificação automática de respostas
- [ ] Opt-out handling (LGPD)
- [ ] Fluxos n8n para orquestração

#### P7. Host Admin (Painel da Plataforma)
- [ ] Dashboard executivo (todos os tenants)
- [ ] CRUD de tenants
- [ ] Gestão de planos e assinaturas
- [ ] Relatório de consumo por tenant
- [ ] Ajuste manual de créditos

#### P8. Ingestão de Dados CNPJ (ETL)
- [ ] Job de download mensal da base CNPJ
- [ ] Parser de CSV massivo com chunking
- [ ] Normalização de telefones (E.164)
- [ ] Validação de emails
- [ ] Particionamento PostgreSQL por UF/CNAE
- [ ] Dashboard de status da ingestão

#### P9. Integrações Externas
- [ ] Webhooks para CRMs externos
- [ ] Importação/Exportação CSV de leads
- [ ] API pública documentada (OpenAPI)

---

### 🟡 Prioridade Baixa (Escala)

#### P10. Observabilidade
- [ ] Health checks e readiness endpoints
- [ ] Logging estruturado (OpenTelemetry)
- [ ] Métricas (Prometheus + Grafana)
- [ ] Alerting configurável

#### P11. Segurança & LGPD
- [ ] Auditoria de acesso por CNPJ
- [ ] Registro de opt-out global
- [ ] Criptografia de PII at rest
- [ ] Rotação de secrets

#### P12. Avançado
- [ ] Geolocalização e mapas de densidade CNAE
- [ ] Sugestão de nichos baseada em concentração
- [ ] Score preditivo de leads
- [ ] A/B testing de mensagens
- [ ] IA para classificação de respostas

---

## 📋 Sprints Sugeridos (Próximos Passos)

### Sprint 1 — Auth & Dashboard ✅ (concluído)
`P1` Login/Registro + `P2` Dashboard real + `P5` Seed Verticais

### Sprint 2 — CRM & Pipeline ✅ (concluído — falta UI de notas no detalhe)
`P3` Kanban + Filtros + Drag-and-drop + APIs de status/notas

### Sprint 3 — Billing & Pagamento (2 semanas)
`P4` Recarga + Webhooks + Alertas

### Sprint 4 — Automação MVP (3 semanas)
`P6` WhatsApp + Templates + Classificação

### Sprint 5 — Host Admin & Observabilidade (2 semanas)
`P7` Painel Host + `P10` Health checks + Logging

---

## 📁 Referências

| Documento | Descrição |
|:---|:---|
| [prd-produto-dominus-leads.md](prd-produto-dominus-leads.md) | Visão do produto, proposta de valor e features |
| [prd-tecnico-dominus-leads.md](prd-tecnico-dominus-leads.md) | Arquitetura técnica e requisitos não-funcionais |
| [plano-implementacao.md](plano-implementacao.md) | Fases de implementação e estimativas |
| [interaction_flow.md](interaction_flow.md) | Fluxo de telas e navegação |
| [api-dados-specs.md](api-dados-specs.md) | Contratos da API de dados |
| [design-system-dominus.md](design-system-dominus.md) | Design system e tokens visuais |
