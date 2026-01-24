# Especificação da API de Dados (CNPJ & IBGE)

Esta especificação define os endpoints para o serviço de consulta de dados de empresas e localização. O serviço deve ser performático, suportando buscas por múltiplos critérios.

## 1. Autenticação e Segurança

O serviço utilizará uma autenticação simplificada via **API Key** no Header, eliminando a complexidade de gestão de tokens JWT para este microserviço interno.

-   **Método:** Header HTTP
-   **Chave:** `X-API-KEY`
-   **Valor:** Hash de 32/64 caracteres gerado estaticamente para os consumidores autorizados (ex: Backend .NET).

**Exemplo de Request:**
```http
GET /v1/companies/12345678000199 HTTP/1.1
Host: data-service.internal
X-API-KEY: sk_live_59384...
```

---

## 2. Endpoints

### 2.1. Buscar Empresa por CNPJ
Retorna os detalhes completos de uma empresa específica.

-   **GET** `/v1/companies/{cnpj}`

**Parâmetros de Rota:**
-   `cnpj`: String (14 dígitos, apenas números).

**Resposta de Sucesso (200 OK):**
```json
{
  "cnpj": "12345678000199",
  "razao_social": "EMPRESA EXEMPLO LTDA",
  "nome_fantasia": "Tech Solutions",
  "data_abertura": "2020-05-15",
  "situacao_cadastral": "ATIVA",
  "natureza_juridica": "206-2",
  "capital_social": 50000.00,
  "porte": "ME",
  "endereco": {
    "logradouro": "Av Paulista",
    "numero": "1000",
    "complemento": "Sala 10",
    "bairro": "Bela Vista",
    "municipio": "São Paulo",
    "uf": "SP",
    "cep": "01310-100",
    "ibge_municipio_id": 3550308
  },
  "cnae_principal": {
    "codigo": "6201-5-01",
    "descricao": "Desenvolvimento de programas de computador sob encomenda"
  },
  "cnaes_secundarios": [
    { "codigo": "6202-3-00", "descricao": "Desenvolvimento de software customizável" }
  ],
  "telefones": [
    { "ddd": "11", "numero": "999999999", "tipo": "MOVEL" }
  ],
  "emails": ["contato@techsolutions.com.br"],
  "socios": [
    { "nome": "JOAO DA SILVA", "qualificacao": "Sócio-Administrador" }
  ]
}
```

**Erros Possíveis:**
-   `404 Not Found`: CNPJ não encontrado.
-   `400 Bad Request`: Formato de CNPJ inválido.

---

### 2.2. Pesquisa Simples (Listagem)
Busca rápida via GET para filtros simples.

-   **GET** `/v1/companies`

**Query Parameters:**
-   `cnae_principal`: (Opcional) Código CNAE único (ex: 6911-7-01).
-   `uf`: (Opcional) Sigla do estado.
-   `page`: (Opcional) Paginacao.

---

### 2.3. Pesquisa Avançada (Busca por Segmento/Múltiplos CNAEs)
Endpoint robusto via POST para permitir o envio de listas extensas de CNAEs (o que resolveria o caso de buscar por "Advogados", enviando todos os códigos relacionados de uma vez).

-   **POST** `/v1/companies/search`

**Body da Requisição (JSON):**
```json
{
  "cnaes": ["6911-7-01", "6911-7-03", "6666-6-00"], 
  "uf": "SP",
  "municipio_ibge": 3550308,
  "capital_min": 1000,
  "porte": ["ME", "EPP"],
  "excluir_mei": true,
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```
*Nota: O campo "cnaes" aceita um array. Isso permite que sua aplicação principal traduza "Advogados" para uma lista de 20 códigos CNAE e envie tudo nesta consulta.*

**Resposta de Sucesso (200 OK):**
```json
{
  "meta": {
    "page": 1,
    "limit": 50,
    "total_items": 850
  },
  "data": [
    {
      "cnpj": "99999999000199",
      "razao_social": "ADVOCACIA SILVA",
      "cnae_principal": { "codigo": "6911-7-01", "descricao": "Serviços advocatícios" }
    }
  ]
}
```

---

### 2.4. Health Check
Verifica a saúde da API e status da conexão com o banco de dados.

-   **GET** `/health`

**Resposta de Sucesso (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0",
  "uptime": "24h"
}
```

---

## 3. Estrutura de Erro Padrão
Todas as respostas de erro (4xx, 5xx) devem seguir este formato JSON:

```json
{
  "error": {
    "code": "INVALID_PARAM",
    "message": "O parâmetro 'uf' deve conter apenas 2 caracteres.",
    "details": "Esperado 'SP', recebido 'SAO PAULO'" 
  }
}
```
