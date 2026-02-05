# Entidade: Event (Linha do Tempo do Lead)

Registra todas as interações e mudanças de estado de um Lead específico.

## Propriedades

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `Id` | `Guid` | Identificador único. |
| `LeadId` | `Guid` | Id do Lead associado. |
| `Tipo` | `EventType` | Enum: WhatsApp, Ligação, E-mail, Automação, MudançaStatus, Nota. |
| `Titulo` | `string` | Título curto do evento (ex: "WhatsApp Enviado"). |
| `Descricao` | `string` | Detalhamento ou conteúdo da mensagem. |
| `Cor` | `string` | Classe CSS ou Hex da cor para a UI. |
| `Icone` | `string` | Identificador do ícone (Lucide-react compatível). |
| `Timestamp` | `DateTime` | Data e hora da ocorrência. |
| `UserId` | `Guid?` | Usuário que gerou o evento (se não for sistema). |

## Comportamento Esperado

1.  **Imutabilidade**: Eventos de linha do tempo geralmente não são editados, apenas criados, para garantir a veracidade do histórico de vendas.
2.  **Automação**: Mudanças automáticas via n8n ou Webhooks devem registrar um evento do tipo `Automação`.
3.  **Ordenação**: Devem ser exibidos sempre em ordem decrescente de `Timestamp` (mais recentes primeiro).
