# Entidade: Lead

A entidade **Lead** representa uma empresa ou oportunidade de negócio prospectada pela plataforma DominusLeads.

## Propriedades

| Propriedade | Tipo | Descrição | Validação |
| :--- | :--- | :--- | :--- |
| `Id` | `Guid` | Identificador único do Lead. | Obrigatório |
| `Cnpj` | `string` | CNPJ da empresa (sem máscara). | Único por Tenant, Formato Válido |
| `RazaoSocial`| `string` | Nome jurídico da empresa. | Máx 256 caracteres |
| `NomeFantasia`| `string` | Nome comercial da empresa. | Máx 256 caracteres |
| `CnaePrincipal`| `string` | Código CNAE principal (ex: 6201501).| Obrigatório |
| `Status` | `LeadStatus` | Enum: Novo, Validado, Quente, Descartado. | Default: Novo |
| `Email` | `string` | E-mail de contato principal. | Formato e-mail válido |
| `Telefone` | `string` | Telefone de contato (com DDD). | |
| `Logradouro` | `string` | Endereço (Rua/Av). | |
| `Numero` | `string` | Número do endereço. | |
| `Bairro` | `string` | Bairro. | |
| `Cidade` | `string` | Nome da cidade. | |
| `Uf` | `string` | Sigla do estado (ex: SE). | Máx 2 caracteres |
| `Cep` | `string` | CEP (sem máscara). | |
| `Score` | `int` | Pontuação de 0 a 100 (Lead Score). | 0 a 100 |
| `Origem` | `string` | Origem do lead (ex: "Busca Externa", "Linkedin"). | |
| `TenantId` | `Guid?` | Id do Tenant (Multitenant). | |

## Comportamento Esperado

1.  **Criação Automática**: Leads podem ser criados a partir do processo de "extração" na tela de Inteligência de Mercado.
2.  **Multitenancy**: Um lead pertence estritamente a um Tenant. O mesmo CNPJ pode existir em Tenants diferentes se ambos o prospectarem, mas os dados de interação (`Events`) são privados.
3.  **Deduplicação**: Ao importar ou extrair, o sistema deve verificar se o CNPJ já existe para o Tenant logado para evitar duplicidade.
4.  **Enriquecimento**: O status "Validado" pode ser atribuído automaticamente se uma integração de validação (ex: n8n ou IA) confirmar os dados de contato.

## Regras de Negócio

- **RN01**: O CNPJ deve ser validado pelo algoritmo oficial da Receita Federal.
- **RN02**: O `Score` é calculado com base na completude dos dados e na compatibilidade do CNAE com o ICP (Ideal Customer Profile) do Tenant.
