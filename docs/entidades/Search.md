# Entidade: Search (Consulta)

A entidade **Search** registra as pesquisas realizadas pelos usuários na ferramenta de Inteligência de Mercado.

## Propriedades

| Propriedade | Tipo | Descrição | Validação |
| :--- | :--- | :--- | :--- |
| `Id` | `Guid` | Identificador único. | |
| `UserId` | `Guid` | Id do usuário que realizou a busca. | |
| `Criterios` | `string` | JSON contendo os filtros (CNAE, Cidade, Estado, etc). | |
| `ResultadosContagem` | `int` | Quantidade de leads encontrados na API externa. | |
| `DataCriacao` | `DateTime` | Data e hora da consulta. | |
| `TenantId` | `Guid?` | Id do Tenant. | |

## Comportamento Esperado

1.  **Auditoria**: Toda busca realizada na tela de Inteligência de Mercado deve ser persistida para análise de comportamento do usuário.
2.  **Otimização**: Se um usuário repetir a mesma busca (mesmos critérios) em um curto espaço de tempo, o BFF pode sugerir o uso dos dados em cache.
3.  **Histórico**: O usuário deve conseguir ver suas últimas buscas realizadas para repetir filtros complexos rapidamente.
