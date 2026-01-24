Plano prático de integração com a API (base: https://api-cnaes.zensuite.com.br), exemplos de chamadas (curl, Node.js/axios, C# HttpClient), e recomendações operacionais (paginação, retry, validações, caching, mapeamento para seu Lead Engine). 

Resumo de autenticação

Header: X-API-KEY: <sua_chave>
Timeout curtos (ex.: 5–10s) e retry com backoff exponencial para requests críticos.
Validar CNPJ localmente (14 dígitos numéricos) antes de chamar a API._
Exemplos rápidos (curl)

GET empresa por CNPJ: curl -s -H "X-API-KEY: sk_..." "https://api-cnaes.zensuite.com.br/v1/companies/12345678000199"

GET simples (filtro cnae_principal): curl -s -H "X-API-KEY: sk_..." "https://api-cnaes.zensuite.com.br/v1/companies?cnae_principal=6911-7-01&uf=SP&page=1"

POST pesquisa avançada: curl -s -H "Content-Type: application/json" -H "X-API-KEY: sk_..."
-d '{"cnaes":["6911-7-01","6911-7-03"],"uf":"SP","pagination":{"page":1,"limit":100}}'
"https://api-cnaes.zensuite.com.br/v1/companies/search"

Health: curl -s -H "X-API-KEY: sk_..." "https://api-cnaes.zensuite.com.br/health"

Node.js (axios) — exemplares const axios = require('axios'); const API = axios.create({ baseURL: 'https://api-cnaes.zensuite.com.br/v1', headers: { 'X-API-KEY': process.env.CNAES_API_KEY }, timeout: 8000 });

// GET empresa por CNPJ async function getCompany(cnpj) { if (!/^\d{14}$/.test(cnpj)) throw new Error('CNPJ inválido'); const res = await API.get(/companies/${cnpj}); return res.data; }

// POST busca avançada com paginação async function searchCompanies(body) { const res = await API.post('/companies/search', body); return res.data; }

C# (.NET HttpClient) — exemplares using var client = new HttpClient { BaseAddress = new Uri("https://api-cnaes.zensuite.com.br/v1/") }; client.DefaultRequestHeaders.Add("X-API-KEY", Environment.GetEnvironmentVariable("CNAES_API_KEY"));

// GET var resp = await client.GetAsync($"companies/{cnpj}"); resp.EnsureSuccessStatusCode(); var json = await resp.Content.ReadAsStringAsync();

Recomendações de robustez e operações

Paginação: usar meta.page/meta.limit/meta.total_items da resposta POST /search. Implementar fetch paginado (incrementar page até total_items).
Rate limiting: trate 429 com Retry-After; implemente backoff exponencial e jitter.
Timeouts: client-side (8–10s). Serviços batch (import mensal) podem usar timeouts maiores e paralelismo controlado.
Erros: parseie body de erro padrão { error: { code, message, details } } para logs estruturados e métricas.
Caching: cache de short-term (TTL 12–24h) para endpoints individuais /companies/{cnpj} em ingestão mensal; evitar reconsulta desnecessária.
Bulk/Batch: use POST /search com arrays de CNAEs para reduzir chamadas (ex.: traduzir “Advogados” para array de 20 CNAEs e consultar de uma vez).
Health check: usar /health no monitoramento (prometheus exporter ou synthetic check).
Mapeamento e validação antes de consumir

Validar CNPJ (14 dígitos).
Normalizar telefone para E.164 antes de salvar: extrair DDD + número; aplicar regras de nacionalização.
Validar e-mail sintaticamente (RFC-ish) e marcar como “sintaxe inválida” se falhar.
Deduplicação por CNPJ (único global) e por (CNPJ + telefone/email) em caso de múltiplos estabelecimentos.
Filtrar/excluir MEI se aplicável (campo excluir_mei true no POST /search)._
Fluxo sugerido para Data Ingestion Service (mensal)

Rodar job ETL: para cada UF/CNAE chunk
POST /v1/companies/search com paginação (limit=500) — paralelizar por UF/CNAE respeitando rate limits
Persistir resultados brutos em object storage (S3)
Normalização (telefone, email), dedupe por CNPJ, enrich com IBGE se aplicável
Atualizar índice PostgreSQL particionado (UF/CNAE)
Gerar pré-leads acessíveis no Lead Engine sem consumir créditos
Como integrar ao Lead Engine / Orquestrador (n8n)

Tela de busca cria “pré-lead” chamando /search (ou consultas locais ao PostgreSQL).
Usuário confirma seleção — então orquestrador dispara fluxo de qualificação (WhatsApp/SMS/Email).
Só debitar crédito quando classificação = lead qualificado. Armazenar audit trail com payload e resposta do canal.
Tratamento de respostas parciais / inconsistências

Se telefone inválido: marcar contato como “Contacto inválido” e não disparar tentativa por WhatsApp; tentar fallback SMS/email quando disponível.
Se e-mail presente mas sintaxe inválida: registrar e excluir.
Se 404 em GET /companies/{cnpj}: marcar como não encontrado e logar.
Exemplo de função TypeScript para paginação automática (pseudocódigo) async function* paginateSearch(body) { let page = 1; while (true) { const payload = { ...body, pagination: { page, limit: 200 } }; const res = await API.post('/companies/search', payload); yield* res.data.data; const meta = res.data.meta; if ((meta.page * meta.limit) >= meta.total_items) break; page++; } }*_

Boas práticas de segurança e LGPD

Registrar consentimento / legítimo interesse e manter logs de interação (quem consultou, quando, propósito).
Implementar opt-out/negativa de contato no sistema que reflete no Dominus CRM e evita futuras tentativas.
Criptografar API key em vault; restringir origem/IP dos serviços que usam a key.
