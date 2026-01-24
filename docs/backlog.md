
Epic Avatar
Ótimo — abaixo está um plano prático de implementação (fases, módulos, tarefas principais, estimativas e critérios) pensado para implementar o backend SaaS dividido em Host (plataforma) e Tenant (cada cliente). Mantendo foco no MVP (integração com api-cnaes.zensuite.com.br, controle de assinatura/créditos, ingestão CNPJ, qualificação e CRM).

Resumo técnico recomendado (opcional)

Backend principal: .NET 10 (WebAPI) ou Node.js (NestJS) — escolha consistente com sua stack atual (.NET citado na spec).
Banco: PostgreSQL (particionamento por UF/CNAE), Redis para cache/locks.
Storage: S3 (object storage) para dumps CNPJ brutos.
Orquestração: Kubernetes / Managed K8s; n8n self-hosted para automações.
Mensageria: Twilio/WhatsApp provider + SMS + SMTP.
CI/CD: GitHub Actions / GitLab CI.
Observabilidade: Prometheus + Grafana, Sentry / Log aggregation (ELK/Datadog).
Fase 0 — Preparação (1 semana)

Definir stack definitivo e infra (K8s vs. VMs).
Criar repositórios (monorepo ou services).
Provisionar contas (Stripe, Twilio, S3, DB).
Definir naming, segredos e vault (HashiCorp / cloud secret manager). Entregáveis: checklist infra + templates de deploy.
Fase 1 — Módulo Host (Plataforma multi-tenant) — MVP funcional (2–3 semanas) Objetivo: administrar tenants, assinaturas, planos e controle global. Tarefas:

API de administração (Host): CRUD de tenants, planos, configurações globais.
Integração Stripe: planos, assinaturas, webhooks (pagamentos, falhas).
Gestão de API keys para serviços internos (X-API-KEY).
Painel Host básico (pode ser admin no Google Stitch): criar tenant, visualizar consumo, ajustar créditos.
Implementar rate limiting por tenant (token bucket / gateway). Critérios de aceitação: criar tenant via API, criar assinatura e receber webhook, visualizar saldo e alterar créditos manualmente.
Fase 2 — Autenticação & Controle de Acesso (1 semana)

Auth: Login admin + tenant users (email/password), roles (admin, sales, viewer). SSO opcional.
Multi-tenant isolation: middlewares que injetam tenant_id a partir do token/subdomain/header.
API key para integracao interna (consumo da api-cnaes). Critérios: requests isolados por tenant_id; rolagem de API keys.
Fase 3 — Módulo Tenant (núcleo do produto) — Lead Engine + CRM (3–5 semanas) Objetivo: endpoints para buscar, preparar pré-leads, controlar créditos e criar leads qualificados. Tarefas:

Modelagem DB: Company, Establishment, Contact, PreLead, Lead, Interaction, Pipeline, CreditTransaction.
Endpoints:
Buscar pré-leads: consulta local (Postgres) e fallback para api-cnaes (/search).
Seleção de lote (pré-leads) sem debitar crédito.
Enriquecimento on-save (telefone normalizado, validação e-mail).
Endpoint para disparar qualificação (orquestrador).
Endpoint para debitar crédito (apenas se classificação = qualificado).
Implementar regras de deduplicação (por CNPJ) e marcação de status.
UI (Google Stitch): telas de busca CNAE + município, lista de pré-leads, detalhe empresa, botão “Iniciar qualificação”. Critérios: seleção de 100 pré-leads sem débito; lead qualificado cria registro no CRM e gera transação de crédito.
Fase 4 — Ingestão CNPJ & Enriquecimento (ETL) (2–4 semanas) Objetivo: pipeline mensal para ingestão massiva da base CNPJ. Tarefas:

Worker para download mensal da base CNPJ (object storage).
Parser de CSV massivo, staging em S3, processamento em chunks.
Normalização: telefone (E.164), e-mail sintático, associar estabelecimento ↔ empresa.
Persistência em Postgres particionado (por UF/CNAE).
Jobs de indexação e preparo para queries rápidas.
Mecanismo de cache/TTL e endpoint administrativo para reprocessamento. Critérios: importar base UF por UF, validar amostra (n registros), consultas rápidas por CNAE/UF.
Fase 5 — Integração com api-cnaes (proxy/cliente) (1 semana)

Implementar cliente internal para api-cnaes.zensuite.com.br com:
Retry/backoff, timeout, parsing de erros padrão.
Paginação automática para /search.
Caching de /companies/{cnpj} por 12–24h.
Endpoints que usam o cliente quando dados não existirem localmente. Critérios: fallback funcional e logs de erros apropriados.
Fase 6 — Automação de Qualificação (n8n + Gateways) (2–3 semanas) Objetivo: orquestrar envios WhatsApp/SMS/Email e classificar automaticamente. Tarefas:

Provisionar n8n self-hosted e criar flows base (template).
Conectar gateways (WhatsApp provider, SMS, SMTP).
Implementar webhook endpoints para receber respostas e atualizar Interaction/Lead status.
Template de mensagem configurável por tenant.
Implementar rate limiting e rotação de números. Critérios: fluxo completo de envio → resposta → classificação automática.
Fase 7 — Billing & Créditos (1–2 semanas)

Ledger de créditos por tenant (criação, débito, reversão).
Regras: somente débito quando lead qualificado.
Relatórios de consumo, cobrança por uso e alertas de saldo baixo.
Admin tools para ajuste manual e auditoria. Critérios: transação de crédito registrada e auditável; reversão suportada.
Fase 8 — Observabilidade, Segurança & LGPD (1–2 semanas)

Logs estruturados, métricas (requests, latência, erros).
Health checks + alerting.
Registro de atividade por auditoria (quem consultou, quando, propósito).
Opt-out/negação de contato implementada e respeitada nos orquestradores.
Criptografia de dados sensíveis at rest e in transit. Critérios: alertas configurados; política de retenção e exportação de logs; opt-out funcionando.
Fase 9 — Testes, QA e Rollout (2 semanas)

Testes unitários e integração (mocks para api-cnaes).
Testes de carga (buscar performance em buscas por CNAE).
Deploy canary para poucos tenants, monitorar métricas de entrega e reputação WhatsApp.
Checklist de go/no-go. Critérios: KPIs dentro das metas (latência, taxa de validação mínima em ambiente controlado).
Fase 10 — Pós-lançamento & Iteração (contínuo)

Instrumentar feedback loop (métricas: CAC vs. tráfego pago, taxa validação, retenção).
Priorizar automações, templates, e melhorias UI.
Fase 2 do roadmap: templates avançados, relatórios, mapa de densidade.
Estimativa total (MVP): 10–16 semanas com uma equipe típica:

1 Tech Lead / Engenheiro Backend senior
1-2 Backend developers
1 DevOps / SRE
1 Frontend/No-code (Google Stitch) integrador
1 QA / Product Owner part-time
Riscos e mitigação rápida

Custo mensagens: começar com limites por tenant e alertas de custo.
Qualidade de dados: validar e filtrar contatos antes de disparo; fallback para SMS/email.
Reputação WhatsApp: rotação de números, templates aprovados e políticas de opt-out.
Critérios de sucesso MVP

Implantação multi-tenant funcionando com cobrança ativa.
Pipeline de ingestão CNPJ funcionando mensalmente.
Taxa de leads validados >= 20% na amostra inicial.
Sistema de créditos e auditoria operacional.
Próximo passo Quer que eu transforme isso em um backlog de tarefas granular (tickets prontos para devs: endpoints, DB migrations, n8n flows, jobs ETL, testes) ou prefere que eu gere um arcabouço de APIs (contratos OpenAPI) para você começar a implementar?

Copy
Upvote Response
Downvote Response

transforme isso em um backlog de tarefas granular (tickets prontos para devs: endpoints, DB migrations, n8n flows, jobs ETL, testes)

Epic Avatar
Perfeito — abaixo está um backlog granular pronto para criação de tickets (endpoints, DB migrations, n8n flows, jobs ETL, testes). Cada item inclui título, descrição, critérios de aceite, estimativa e dependências. Recomendo copiar/colar cada item como ticket no seu tracker (Jira, Linear, Trello etc.).

Observação: estimativas em dias úteis (DU) para 1 desenvolvedor backend fullstack experiente; ajuste conforme time.

Epic A — Infra & Preparação A.1 Provisionamento infra inicial

Descrição: Criar infra básica (K8s/VM, VPC, RDS/Postgres, S3, Redis, secrets vault, bucket para dumps CNPJ).
Critérios: instâncias, banco e storage disponíveis; segredos no vault; acesso CI/CD.
Est: 2 DU
Dep: nenhum
A.2 CI/CD e pipelines

Descrição: Configurar GitHub Actions/GitLab CI para build, test e deploy (staging/prod).
Critérios: PR -> build -> testes -> deploy automático em staging.
Est: 2 DU
Dep: A.1
Epic B — Banco de Dados & Migrations B.1 Migration: Tenants, Plans, Subscriptions

Descrição: Criar tabelas tenants, plans, subscriptions, tenant_settings.
Esquema mínimo: tenant_id, nome, status, plan_id, subscription_id, credit_balance.
Critérios: migrations aplicam sem erro; testes unitários de CRUD.
Est: 1 DU
Dep: A.1_
B.2 Migration: Users & Roles

Descrição: users (tenant_id, email, senha_hash, role), password reset tokens.
Critérios: login básico funcionando; seed admin.
Est: 1 DU
Dep: B.1
B.3 Migration: API Keys & Host admin

Descrição: api_keys table (key, tenant_id/null, scope, active, created_by).
Critérios: criar/regenerar/disable keys via DB/API.
Est: 0.5 DU
Dep: B.1_
B.4 Migration: Core Lead Model

Descrição: companies, establishments, contacts, cnaes, preleads, leads, interactions, pipelines, stages.
Critérios: migrations criam todas as tabelas; FK e índices básicos presentes.
Est: 2 DU
Dep: B.1
B.5 Migration: Credit Ledger / Transactions

Descrição: credit_transactions (tenant_id, tipo, amount, saldo_prev, saldo_after, referencia, meta).
Critérios: integridade e constraints; audit fields.
Est: 0.5 DU
Dep: B.1
B.6 Indexing & Partitioning

Descrição: adicionar particionamento por UF/CNAE e índices para consultas por cnae_principal, uf, cnpj.
Critérios: queries por cnae+uf com plano de execução aceitável.
Est: 1 DU
Dep: B.4_
Epic C — Host APIs (Admin) C.1 Endpoint: CRUD Tenants (Host)

Descrição: /host/tenants [POST/GET/PATCH/DELETE]
Critérios: criar tenant com plan; resposta válida; validação.
Est: 1 DU
Dep: B.1
C.2 Endpoint: Plans & Subscriptions (Host)

Descrição: /host/plans, /host/subscriptions; integração básica com Stripe (webhooks).
Critérios: criar plano; receber webhook de sucesso/falha e atualizar subscription.
Est: 2 DU
Dep: C.1 + integra Stripe
C.3 Endpoint: Admin Dashboard (consumo)

Descrição: /host/tenants/{id}/usage retorna consumo de créditos, saldo, últimos eventos.
Critérios: dados precisos; paginação.
Est: 1 DU
Dep: B.5
Epic D — Autenticação & Multitenancy D.1 Auth: Tenant User Login & Roles

Descrição: /auth/login, /auth/register (tenant scope), JWT/session; roles (admin, sales, viewer).
Critérios: token com tenant_id; middleware injeta tenant_id.
Est: 1.5 DU
Dep: B.2
D.2 Middleware: Tenant Isolation

Descrição: middleware que garante isolamento por tenant_id em todas requests.
Critérios: não é possível acessar dados de outro tenant; testes de integração.
Est: 1 DU
Dep: D.1_
D.3 API Key Management (for internal services)

Descrição: endpoints para gerar/revogar API keys (Host/tenant-scoped).
Critérios: keys armazenadas criptografadas; uso por serviços verificado.
Est: 0.5 DU
Dep: B.3
Epic E — Cliente para api-cnaes (proxy) E.1 Client HTTP robusto para api-cnaes

Descrição: implementar cliente com baseURL https://api-cnaes.zensuite.com.br, X-API-KEY header, timeout, retry/backoff, parse de erro padronizado.
Critérios: encapsula GET /companies/{cnpj}, GET /companies, POST /companies/search, /health.
Est: 1 DU
Dep: A.1
E.2 Paginação helper para /companies/search

Descrição: helper que faz paginação automática e expõe generator/iterator.
Critérios: percorre todas as páginas até total_items.
Est: 0.5 DU
Dep: E.1_
E.3 Cache de /companies/{cnpj}

Descrição: cache Redis com TTL configurável (12–24h).
Critérios: hits reduz número de requests ao api-cnaes.
Est: 0.5 DU
Dep: E.1
Epic F — Lead Engine & Tenant APIs F.1 Endpoint: Buscar pré-leads (consulta local + fallback)

Descrição: POST /tenant/{id}/preleads/search aceita cnaes[], uf, municipio_ibge, pagination.
Critérios: responde com meta e data; usa Postgres local, se vazio usa api-cnaes client e armazena parcial.
Est: 2 DU
Dep: B.4 + E.1_
F.2 Endpoint: Selecionar lote de pré-leads (sem débito)

Descrição: POST /tenant/{id}/preleads/select {ids[] or query} cria seleção temporária.
Critérios: seleção salva com token; não debita crédito.
Est: 1 DU
Dep: F.1
F.3 Endpoint: Iniciar qualificação (dispara orquestrador)

Descrição: POST /tenant/{id}/preleads/{selection_id}/qualify start; cria tasks para n8n/orquestrador.
Critérios: tasks enfileiradas; retorno de job id.
Est: 1 DU
Dep: F.2 + Epic G (n8n)_
F.4 Endpoint: Criar/Registrar Lead Qualificado & Debitar Crédito

Descrição: POST webhook/internal /tenant/{id}/leads/create com status, interactions; debita crédito atomicamente.
Critérios: somente debita se status=QUALIFIED; credit_transactions criado; rollback em falha.
Est: 1.5 DU
Dep: B.5_
F.5 Endpoint: Leads CRUD & Pipeline

Descrição: /tenant/{id}/leads, /interactions, /pipeline endpoints básicos (list, update stage).
Critérios: leads com histórico de interações; movimentação de estágio cria evento audit.
Est: 2 DU
Dep: B.4
F.6 Deduplicação e regras

Descrição: serviço que deduplica por CNPJ e por contato (CNPJ+telefone/email) ao criar prelead/lead.
Critérios: não criar lead duplicado; marcar duplicates para revisão.
Est: 1 DU
Dep: B.4
Epic G — ETL / Ingestão CNPJ (Data Ingestion Service) G.1 Job: Downloader mensal

Descrição: worker que baixa os dumps CNPJ para S3 (ou lê fonte oficial) e grava metadados.
Critérios: arquivo salvo em S3; job id e log.
Est: 1 DU
Dep: A.1
G.2 Job: Parser de CSV massivo -> staging (chunk)

Descrição: processa CSV em chunks (ex.: 10k linhas) e grava objetos de chunk em S3/queue.
Critérios: chunks criados; reprocessável por chunk id.
Est: 2 DU
Dep: G.1
G.3 Job: Processador de chunk -> normalização

Descrição: worker que consome chunk, normaliza telefone (E.164), valida e-mail, associa estabelecimento->empresa, cria registros cnpj_raw/staging.
Critérios: normalização aplicada; erros registrados; worker idempotente.
Est: 3 DU
Dep: G.2_
G.4 Job: Persistência em Postgres particionado

Descrição: inserção em batches para tabelas partitioned (por UF/CNAE) com upsert suportado.
Critérios: inserts batched, tolera retries; índices atualizados.
Est: 2 DU
Dep: G.3 + B.6
G.5 Admin Endpoint: Reprocessamento e status

Descrição: endpoints para iniciar reprocessamento de chunk/UF e ver status do job.
Critérios: admin pode reprocessar e ver logs.
Est: 0.5 DU
Dep: G.3
Epic H — Orquestração & n8n Flows H.1 Deploy n8n self-hosted com auth

Descrição: instalar e configurar n8n (K8s), secrets, storage para workflows.
Critérios: n8n disponível, backups de workflows.
Est: 1 DU
Dep: A.1
H.2 Flow: Envio Mensagem Inicial (WhatsApp principal)

Descrição: workflow para enviar template WhatsApp inicial (tenant-configurable).
Critérios: envia mensagem, registra Interaction; retorna message_id.
Est: 1 DU
Dep: H.1 + Epic I (Gateways)_
H.3 Flow: Fallback SMS / Email

Descrição: se WhatsApp indisponível/inválido, enviar SMS; se SMS falha e email válido, enviar email.
Critérios: fallback logic funcionando; taxa de retry configurable.
Est: 1 DU
Dep: H.2 + Epic I
H.4 Flow: Webhook receiver (resposta do contato)

Descrição: endpoint que recebe replies de WhatsApp/SMS/email e atualiza Interaction/Lead state; reinvoca classification.
Critérios: mensagens mapeadas para lead/interactions; idempotência.
Est: 1 DU
Dep: H.2 + Epic I
H.5 Flow: Classificador automático

Descrição: lógica que classifica resposta (qualified, invalid, not_interested, no_answer) com regras simples (keyword matching + heuristics).
Critérios: classificação armazenada; testes com exemplos.
Est: 1 DU
Dep: H.4
H.6 Flow: Opt-out handling

Descrição: detectar "não quero", "pare" e marcar opt-out no tenant CRM; bloquear futuros envios.
Critérios: opt-out persistido e respeitado.
Est: 0.5 DU
Dep: H.4
Epic I — Gateways de Mensagens I.1 Integração: WhatsApp Provider (Twilio/Provider escolhido)

Descrição: adapter para enviar mensagens template, receber webhooks, rotation de numbers.
Critérios: sendMessage/receiveWebhook endpoints testados.
Est: 1.5 DU
Dep: A.1
I.2 Integração: SMS Provider

Descrição: adapter para envio SMS e recebimento status/delivery.
Critérios: fallback operando em testes.
Est: 0.5 DU
Dep: I.1
I.3 Integração: Email (SMTP/API)

Descrição: adapter para envio de email via provider (SendGrid/Postmark).
Critérios: envio e bounces tratados.
Est: 0.5 DU
Dep: I.1
Epic J — Billing, Credits & Ledger J.1 Ledger: Debitar/creditar crédito com ACID

Descrição: função/endpoint que realiza debit/credit atomicamente com registro em credit_transactions.
Critérios: concorrência tratada, testes de carga.
Est: 1 DU
Dep: B.5_
J.2 Endpoint: Relatórios de consumo e alertas

Descrição: /tenant/{id}/billing/usage; alertas de saldo baixo via email/webhook.
Critérios: relatório diário; alertas configuráveis.
Est: 0.5 DU
Dep: J.1
J.3 Integrar Stripe Billing (uso + plano)

Descrição: mapear uso para faturas; webhooks para pagamento falho.
Critérios: webhook processados e assinaturas atualizadas.
Est: 1 DU
Dep: C.2
Epic K — Observabilidade, Segurança e LGPD K.1 Health checks e readiness endpoints

Descrição: /health com db, redis, queue checks.
Critérios: status healthy/failed; integrado ao monitor.
Est: 0.25 DU
Dep: A.1
K.2 Logging estruturado e tracing (OpenTelemetry)

Descrição: logs JSON, traces para requests críticos (ETL, qualification).
Critérios: request traceable across services.
Est: 1 DU
Dep: A.1
K.3 Auditing & LGPD (opt-out, retention)

Descrição: registrar quem consultou qual CNPJ, finalidade; endpoint opt-out global.
Critérios: audit trail por action; opt-out efetivo em orquestradores.
Est: 1 DU
Dep: H.6 + B.4
K.4 Security: encryption at rest, secrets rotation

Descrição: criptografar PII at rest e em trânsito; vault para keys.
Critérios: PII em DB criptografado; keys em vault.
Est: 1 DU
Dep: A.1
Epic L — Testes & QA L.1 Unit tests: services / clients

Descrição: cobertura básica para api-cnaes client, dedupe, credit ledger, normalization.
Critérios: cobertura mínima 60% para módulos críticos.
Est: 2 DU
Dep: E.1, F.6, J.1
L.2 Integration tests: end-to-end qualification flow (mock providers)

Descrição: testes que simulam seleção → envio → resposta → classificação → débito.
Critérios: fluxo verde com mocks.
Est: 2 DU
Dep: F.1..F.4, H.2..H.5, I.1
L.3 Load tests: search / preleads

Descrição: gerenciar cenário de busca por CNAE/UF com volumes realisticos.
Critérios: latência < 1s para queries típicas; definir SLO.
Est: 1 DU
Dep: B.6, F.1
L.4 Security tests: auth, secrets, rate limiting

Descrição: pentest básico & test automação de rate limit 429 handling.
Critérios: não permitir acesso cross-tenant; rate limit acionável.
Est: 1 DU
Dep: D.2, C.3
Epic M — Frontend / Google Stitch wiring (tickets para integrador) M.1 Stitch: Tela Host Admin (criar tenant, ver consumo)

Descrição: pages/forms integradas aos endpoints Host.
Critérios: criar tenant e ver consumo via Stitch.
Est: 1 DU
Dep: C.1, C.3
M.2 Stitch: Tela Tenant - Busca CNAE & pré-leads

Descrição: UI para pesquisa por CNAE/UF, visualizar listagem e selecionar lote.
Critérios: seleção salva; paginação.
Est: 1 DU
Dep: F.1, F.2
M.3 Stitch: Tela Lead Detail & qualificação

Descrição: detalhe da empresa, histórico de interações, botão iniciar qualificação.
Critérios: iniciar fluxo que chama /qualify e mostrar status job.
Est: 1 DU
Dep: F.3, H.2
M.4 Stitch: Billing & créditos UI

Descrição: mostrar saldo, histórico de transações e alertas de saldo baixo.
Critérios: histórico consistente com ledger.
Est: 0.5 DU
Dep: J.1
Epic N — Deploy & Rollout N.1 Canary release & small-tenant onboarding

Descrição: deploy canary para 2–3 tenants, monitorar métricas de entrega/reputação.
Critérios: sem regressões; métricas ok.
Est: 1 DU
Dep: A.1..K.1
N.2 Runbook & rollback

Descrição: procedimentos de emergência (rollback DB migration, disable sends).
Critérios: runbook validado em checklist.
Est: 0.5 DU
Dep: N.1
Extras / Nice-to-have (podem ser backlog secundário)

Tradução automática CNAE -> segmento (mapa CNAE para “Advogados”) (1 DU)
Dashboard de mapas de densidade CNAE (fase 3) (3 DU)
UI para templates de mensagens por tenant (1 DU)
Resumo e priorização sugerida (MVP mínimo) Sprint 1 (2 semanas): A.1, A.2, B.1..B.3, C.1, D.1, E.1, M.1 Sprint 2 (2 semanas): B.4..B.6, F.1..F.3, E.2, G.1..G.2, H.1 Sprint 3 (2 semanas): G.3..G.5, F.4..F.6, H.2..H.5, I.1..I.3 Sprint 4 (2 semanas): J.1..J.3, K.1..K.4, L.1..L.3, N.1

