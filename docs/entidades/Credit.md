# Entidade: Credit & Transaction (Créditos e Faturamento)

Gerencia o saldo de créditos do Tenant para consumo de serviços de extração e IA.

## Entidade: Credit (Saldo)
*Agregado que mantém o estado atual.*

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `Id` | `Guid` | Identificador único. |
| `TenantId` | `Guid` | Id do Tenant. |
| `SaldoAtual` | `decimal` | Valor disponível em reais ou créditos. |
| `UltimaAtualizacao`| `DateTime` | Data da última movimentação. |

## Entidade: Transaction (Movimentação)
*Histórico de transações.*

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `Id` | `Guid` | Identificador único. |
| `Tipo` | `TransactionType` | Enum: Recarga, Consumo (Extração), Consumo (IA). |
| `Valor` | `decimal` | Valor da transação (positivo para Recarga, negativo para Consumo). |
| `Descricao` | `string` | Descrição amigável (ex: "Recarga Pix", "Extração de 100 leads"). |
| `Status` | `TransactionStatus` | Enum: Pendente, Confirmado, Cancelado. |

## Regras de Negócio

- **RN01**: O saldo nunca pode ficar negativo. Antes de qualquer operação de consumo, o BFF deve verificar a disponibilidade.
- **RN02**: Operações de recarga podem ser iniciadas pelo Tenant, mas só atualizam o saldo após webhook de confirmação do Gateway de Pagamento.
- **RN03**: O custo da extração é dinâmico e definido pelo Host (Admin).
