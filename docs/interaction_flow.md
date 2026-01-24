# Fluxo de Interação e Navegação - Dominus Leads

Este documento mapeia a arquitetura de informação e o fluxo de telas da aplicação **Dominus Leads**, consolidando os protótipos de UI (Google Stitch) e a implementação base encontrada em `navigation-flux/code.html`.

## 1. Visão Geral da Navegação

A aplicação segue uma estrutura híbrida focada em mobile-first (baseada no código existente), mas com módulos administrativos robustos (baseados nos diretórios de protótipos).

### Estrutura Principal (App/Tenant View)
A navegação primária ocorre via **Bottom Navigation Bar** com 5 pilares:

1.  **Início (Dashboard)**: Visão geral de consumo, atalhos e notificações.
2.  **CRM (Leads)**: Gestão de listas de leads (Funil: Quente, Respondeu, Validado).
3.  **Buscar (Finder)**: Motor de busca de novos leads (CNAE, Geolocalização).
4.  **Automação**: Gerenciamento de campanhas e disparos.
5.  **Ajustes**: Perfil, Faturamento, Suporte e Configurações Gerais.

---

## 2. Mapa de Telas e Interações

### A. Fluxo de Entrada (Onboarding & Auth)
*Ocorre antes do acesso ao shell principal da aplicação.*

1.  **Bem-vindo ao Dominus Leads**: Tela de abertura.
2.  **Onboarding [1-3]**: Carrossel explicativo (Encontre leads -> Automação Inteligente -> Previsibilidade).
    *   *Ação*: Botão "Pular" ou "Próximo".
3.  **Login**: Autenticação via E-mail/Senha ou Social (Google).
    *   *Link*: "Esqueceu a senha?" -> **Recuperar Senha**.
    *   *Link*: "Cadastre-se" -> **Cadastro Dominus Leads**.

### B. Módulo: Início (Dashboard)
*Ponto central de controle.*

*   **Dashboard Executivo**:
    *   *Display*: Saldos de créditos, atalhos rápidos.
    *   *Interação*: Card "Créditos Ativos" -> leva para **Créditos e Faturamento**.
    *   *Interação*: Barra de Busca Rápida -> leva para **Find New Leads** (com filtro pré-preenchido).
    *   *Interação*: Lista "Atividade Recente" -> clique no item leva para **Detalhes do Lead**.
    *   *Interação*: Ícone Notificações -> **Central de Notificações / Logs**.

### C. Módulo: Buscar (Lead Finder)
*Motor de aquisição de dados.*

1.  **Find New Leads (Busca)**:
    *   *Input*: Filtros por CNAE, Estado, Cidade, Faixa de Quantidade.
    *   *Feedback*: "Prévia dos Resultados" (atualiza em tempo real estimativa de leads).
2.  **Resultados / Seleção**:
    *   *Ação*: "Iniciar Campanha" -> leva para **Configuração de Campanhas**.

### D. Módulo: Automação (Campaigns)
*Orquestração de contato.*

1.  **Lista de Automações**:
    *   *Tabs*: "Minhas Automações" vs "Logs de Erro".
    *   *Display*: Cards de campanhas ativas com contadores (ex: "45 leads hoje").
    *   *Ação*: Clique no card -> **Detalhes da Automação**.
    *   *Ação*: Botão FAB (+) -> **Configuração de Campanhas** (Nova).
2.  **Configuração de Campanhas**:
    *   *Etapas*:
        1.  Definir Nome.
        2.  Seleção de Canal (WhatsApp / SMS / E-mail).
        3.  **Componentes de Mensagem** (Editor de Templates com tags dinâmicas `{nome}`).
        4.  Definição de Gatilhos (Fluxo de Automação e IA).
    *   *Ação*: "Salvar Template" ou "Ativar Campanha".
    *   *Sub-telas associadas*:
        *   **Janelas de Envio**: Configurar horários permitidos.
        *   **Treinamento da IA (Prompt)**: Ajustar persona do bot.

### E. Módulo: CRM (Gestão de Clientes)
*Gestão do ciclo de vida do lead.*

1.  **Dominus CRM Leads (Lista)**:
    *   *Filtros*: Tabs (Todos, Quente, Respondeu, Validado).
    *   *Busca*: Filtro textual local.
    *   *Display*: Lista de cards com status e indicadores visuais.
    *   *Ação*: Clique no lead -> **Detalhes do Lead**.
2.  **Detalhes do Lead e Histórico**:
    *   *Display*: Dados da empresa (CNPJ, Endereço), Histórico de conversas.
    *   *Ações Rápidas*: WhatsApp, Ligar, Alterar Status.
    *   **Monitoramento de Chamadas/Logs**: Visualizar transcrições ou status de disparos.

### F. Módulo: Ajustes & Administrativo
*Configurações da conta e do sistema.*

1.  **Perfil e Ajustes**: Menu principal de configurações.
2.  **Dados da Empresa**: Edição de dados cadastrais do tenant.
3.  **Créditos e Faturamento**:
    *   *Display*: Consumo do mês, Histórico.
    *   *Ação*: Comparar Planos / Recarga -> Integração Checkout.
4.  **Central de Ajuda**: FAQ e Suporte.
5.  **Gestão de Custos e APIs Global** (Admin/Host):
    *   *Display*: Relatório de ROI, Custos de API.
    *   *Sub-tela*: **Status do Sistema e APIs** (Health monitor).
6.  **Integrações Webhooks**: Configuração técnica para conectar CRM externo.

---

## 3. Matriz de Relacionamento (Diretórios x Funcionalidade)

Com base nos diretórios importados do Figma/Stitch:

| Diretório (Protótipo) | Funcionalidade Mapeada |
| :--- | :--- |
| `login_dominus_leads`, `recuperar_senha`, `cadastro...` | **Auth Flow** |
| `dominus_leads_dashboard`, `dashboard_executivo_host` | **Dashboard** (Tenant vs Host) |
| `find_new_leads`, `resultados_reais_b2b` | **Busca / Finder** |
| `automacao_de_prospeccao`, `configuracao_de_campanhas` | **Automação** |
| `fluxo_de_automacao_e_ia`, `treinamento_da_ia_prompt` | **Configuração Avançada de IA** |
| `dominus_crm_leads`, `gestao_de_clientes...` | **CRM / Listagem** |
| `detalhes_do_lead...`, `monitoramento_de_chamadas` | **Detalhes / Logs** |
| `creditos_e_faturamento`, `relatorio_de_custos...` | **Billing & Financeiro** |
| `logs_de_ia_input`, `automacoes_e_logs...` | **Observabilidade / Logs** |

## 4. Oportunidades de Melhoria no Código Base

O arquivo `navigation-flux/code.html` implementa com sucesso o "Caminho Feliz" (Onboarding -> Login -> Dash -> Finder -> CRM). Para atingir o escopo completo proposto pelos protótipos, faltam implementar:

1.  **Conexão com IA**: As telas de "Treinamento da IA" e "Logs de IA" não existem no código atual.
2.  **Billing Real**: A tela de faturamento é estática; precisa conectar fluxo de upgrade real.
3.  **Visão Host vs Tenant**: O código atual assume uma visão única de usuário final. Os protótipos sugerem uma visão "Dashboard Executivo Host" (Admin da Plataforma).
4.  **Agendamento**: Telas de "Janelas de Envio" sugerem controle complexo de horários de disparo, ausente no código simples de automação atual.
