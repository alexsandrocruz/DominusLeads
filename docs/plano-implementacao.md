Plano de implementação (fases, módulos, tarefas principais, estimativas e critérios) pensado para implementar o backend SaaS dividido em Host (plataforma) e Tenant (cada cliente). Mantendo foco no MVP (integração com api-cnaes.zensuite.com.br, controle de assinatura/créditos, ingestão CNPJ, qualificação e CRM).

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


