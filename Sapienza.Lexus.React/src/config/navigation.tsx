import {
    LayoutDashboard,
    Building2,
    Users,
    Shield,
    Settings,
    Crown,
    User,
    UserPlus,
    FileText,
    ShieldAlert,
    Users2,
    Network,
    ShieldCheck,
    Box,
    Scale,
    Gavel,
    Handshake,
    DollarSign,
    Landmark,
    Settings2,
    Sliders,
    Database,
    GitMerge,
    Briefcase,
    CalendarCheck,
    Archive
} from "lucide-react";
import React from "react";

// Page Imports
import DashboardPage from "@/pages/dashboard";
import CrmDashboardPage from "@/pages/dashboard/crm/CrmDashboardPage";
import TenantDashboardPage from "@/pages/dashboard/tenant-dashboard";
import HostWorkspacesPage from "@/pages/host/workspaces";
import HostUsersPage from "@/pages/host/users";
import HostRolesPage from "@/pages/host/roles";
import HostSettingsPage from "@/pages/host/settings";
import HostEditionsPage from "@/pages/host/editions";
import InvitationsPage from "@/pages/host/invitations";
import AuditLogsPage from "@/pages/host/audit-logs";
import SecurityLogsPage from "@/pages/host/security-logs";
import OrgUnitsPage from "@/pages/host/org-units";
import PermissionGroupsPage from "@/pages/host/permission-groups";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ProfilePage from "@/pages/profile";
import UserSessionsPage from "@/pages/sessions";
import LgpdPage from "@/pages/profile/lgpd";
import TermsPage from "@/pages/legal/terms";
import PrivacyPage from "@/pages/legal/privacy";
import LawyerPage from "@/pages/admin/lawyer";
import LawyerFormPage from "@/pages/admin/lawyer-form";
import CasePage from "@/pages/admin/case";
import ClientPage from "@/pages/admin/client";
import SpecializationPage from "@/pages/admin/specialization";
import LegalProcessPage from "@/pages/admin/legal-process";
import LawyerSpecializationPage from "@/pages/admin/lawyer-specialization";
import ProposalPage from "@/pages/admin/proposal";
import ProposalFormPage from "@/pages/admin/proposal/form";
import PropostalItemPage from "@/pages/admin/propostal-item";
import PropostalItemFormPage from "@/pages/admin/propostal-item/form";
import _versaoBDPage from "@/pages/admin/-versao-bd";
import advCliBairrosPage from "@/pages/admin/adv-cli-bairros";
import advCliComoChegouPage from "@/pages/admin/adv-cli-como-chegou";
import advCliLocaisAtendidoPage from "@/pages/admin/adv-cli-locais-atendido";
import advCliLogPage from "@/pages/admin/adv-cli-log";
import advCliPrioridadesPage from "@/pages/admin/adv-cli-prioridades";
import advClientesConvertidosPage from "@/pages/admin/adv-clientes-convertidos";
import advClientesModelosPage from "@/pages/admin/adv-clientes-modelos";
import advClientes_bkpPage from "@/pages/admin/adv-clientes-bkp";
import advPautaObsPage from "@/pages/admin/adv-pauta-obs";
import advPreArquivosStatusPage from "@/pages/admin/adv-pre-arquivos-status";
import advPreLogStatusPage from "@/pages/admin/adv-pre-log-status";
import advPreMetasPage from "@/pages/admin/adv-pre-metas";
import advPreMotivosPerdaPage from "@/pages/admin/adv-pre-motivos-perda";
import advPreOrigensPage from "@/pages/admin/adv-pre-origens";
import advPreProcessosCheckListsPage from "@/pages/admin/adv-pre-processos-check-lists";
import advProEscritoriosPage from "@/pages/admin/adv-pro-escritorios";
import advProFasesPage from "@/pages/admin/adv-pro-fases";
import advProInstanciasPage from "@/pages/admin/adv-pro-instancias";
import advProOrgaosPage from "@/pages/admin/adv-pro-orgaos";
import advProProbabilidadesPage from "@/pages/admin/adv-pro-probabilidades";
import advProRelevanciasPage from "@/pages/admin/adv-pro-relevancias";
import advProSentencasPage from "@/pages/admin/adv-pro-sentencas";
import advProStatusPage from "@/pages/admin/adv-pro-status";
import advProTiposPage from "@/pages/admin/adv-pro-tipos";
import advProVarasPage from "@/pages/admin/adv-pro-varas";
import advTarefasAtualizacoesPage from "@/pages/admin/adv-tarefas-atualizacoes";
import autoFTPPage from "@/pages/admin/auto-ftp";
import fabConfigPage from "@/pages/admin/fab-config";
import fabDatasEFeriadosPage from "@/pages/admin/fab-datas-eferiados";
import fabFormasPagamentoPage from "@/pages/admin/fab-formas-pagamento";
import fabFormasRecebimentoPage from "@/pages/admin/fab-formas-recebimento";
import fabMotivosAproveitamentoPage from "@/pages/admin/fab-motivos-aproveitamento";
import fabMotivosPerdaPage from "@/pages/admin/fab-motivos-perda";
import fabRegioesPage from "@/pages/admin/fab-regioes";
import fdtDevsPage from "@/pages/admin/fdt-devs";
import finCentrosResultadoPage from "@/pages/admin/fin-centros-resultado";
import finContasClientesPage from "@/pages/admin/fin-contas-clientes";
import finLancamentos_BKPPage from "@/pages/admin/fin-lancamentos-bkp";
import finPlanoContasDetPage from "@/pages/admin/fin-plano-contas-det";
import finProcuracoesRPVPage from "@/pages/admin/fin-procuracoes-rpv";
import finRateiosPage from "@/pages/admin/fin-rateios";
import finRateiosPadraoPage from "@/pages/admin/fin-rateios-padrao";
import finRecibosPage from "@/pages/admin/fin-recibos";
import finUnidadesPage from "@/pages/admin/fin-unidades";
import flwConfigPage from "@/pages/admin/flw-config";
import advAgeTiposCompromissosPage from "@/pages/admin/adv-age-tipos-compromissos";
import advAgeTiposTarefasPage from "@/pages/admin/adv-age-tipos-tarefas";
import advCliCargosPage from "@/pages/admin/adv-cli-cargos";
import advCliGruposPage from "@/pages/admin/adv-cli-grupos";
import advCliSituacoesPage from "@/pages/admin/adv-cli-situacoes";
import advCliTiposArquivosPage from "@/pages/admin/adv-cli-tipos-arquivos";
import advCliTiposHistoricosPage from "@/pages/admin/adv-cli-tipos-historicos";
import advClientesINSSStatusPage from "@/pages/admin/adv-clientes-inssstatus";
import advFornecedoresPage from "@/pages/admin/adv-fornecedores";
import advPostosINSSPage from "@/pages/admin/adv-postos-inss";
import advPreCheckListsGruposPage from "@/pages/admin/adv-pre-check-lists-grupos";
import advPreStatusTiposPage from "@/pages/admin/adv-pre-status-tipos";
import advProMeritosPage from "@/pages/admin/adv-pro-meritos";
import advProNaturezasPage from "@/pages/admin/adv-pro-naturezas";
import advVerTiposPage from "@/pages/admin/adv-ver-tipos";
import fabCondicoesPagamentoPage from "@/pages/admin/fab-condicoes-pagamento";
import fabHistoricoTiposPage from "@/pages/admin/fab-historico-tipos";
import fabPaisesPage from "@/pages/admin/fab-paises";
import fabPermissoesTiposPage from "@/pages/admin/fab-permissoes-tipos";
import finAreasPage from "@/pages/admin/fin-areas";
import finCentrosCustoPage from "@/pages/admin/fin-centros-custo";
import finContasPage from "@/pages/admin/fin-contas";
import finGruposDREPage from "@/pages/admin/fin-grupos-dre";
import flwAcoesPage from "@/pages/admin/flw-acoes";
import logAcoesPage from "@/pages/admin/log-acoes";
import opoSituacoesPage from "@/pages/admin/opo-situacoes";
import opoTiposPage from "@/pages/admin/opo-tipos";
import usuAreasPage from "@/pages/admin/usu-areas";
import advClientesPage from "@/pages/admin/adv-clientes";
import CreateClientePage from "@/pages/admin/adv-clientes/create";
import EditClientePage from "@/pages/admin/adv-clientes/[id]/edit";
import advClientesArquivosPage from "@/pages/admin/adv-clientes-arquivos";
import advClientesAtualizacoesPage from "@/pages/admin/adv-clientes-atualizacoes";
import advClientesChecklistPage from "@/pages/admin/adv-clientes-checklist";
import advClientesINSSPage from "@/pages/admin/adv-clientes-inss";
import advPreCheckListsPage from "@/pages/admin/adv-pre-check-lists";
import advPreStatusPage from "@/pages/admin/adv-pre-status";
import advProcessosPage from "@/pages/admin/adv-processos";
import CreateProcessPage from "@/pages/admin/adv-processos/create";
import EditProcessPage from "@/pages/admin/adv-processos/[id]/edit";
import advProcessosClientesPage from "@/pages/admin/adv-processos-clientes";
import advProcessosHonorariosPage from "@/pages/admin/adv-processos-honorarios";
import advProcessosMeritosPage from "@/pages/admin/adv-processos-meritos";
import fabEstadosPage from "@/pages/admin/fab-estados";
import fabPermissoesPage from "@/pages/admin/fab-permissoes";
import finExtratoPage from "@/pages/admin/fin-extrato";
import finPlanoContasGruposPage from "@/pages/admin/fin-plano-contas-grupos";
import flwConfigExcecoesPage from "@/pages/admin/flw-config-excecoes";
import flwGradeHorariosPage from "@/pages/admin/flw-grade-horarios";
import logCamposPage from "@/pages/admin/log-campos";
import usuCargosPage from "@/pages/admin/usu-cargos";
import advClientesHistoricosPage from "@/pages/admin/adv-clientes-historicos";
import advCompromissosPage from "@/pages/admin/adv-compromissos";
import CreateAdvCompromissoPage from "@/pages/admin/adv-compromissos/create";
import EditAdvCompromissoPage from "@/pages/admin/adv-compromissos/[id]/edit";
import advProcessosAlteracoesPage from "@/pages/admin/adv-processos-alteracoes";
import advProcessosDadosHerdeirosPage from "@/pages/admin/adv-processos-dados-herdeiros";
import advProfissionaisPage from "@/pages/admin/adv-profissionais";
import CreateProfissionalPage from "@/pages/admin/adv-profissionais/create";
import EditProfissionalPage from "@/pages/admin/adv-profissionais/[id]/edit";
import advProfissionaisEstadosPage from "@/pages/admin/adv-profissionais-estados";
import advProfissionaisNaturezasPage from "@/pages/admin/adv-profissionais-naturezas";
import advRevisaoDocumentosPage from "@/pages/admin/adv-revisao-documentos";
import advTarefasPage from "@/pages/admin/adv-tarefas";
import CreateAdvTarefaPage from "@/pages/admin/adv-tarefas/create";
import EditAdvTarefaPage from "@/pages/admin/adv-tarefas/[id]/edit";
import advVerbasPage from "@/pages/admin/adv-verbas";
import fabCidadesPage from "@/pages/admin/fab-cidades";
import fabLembretesPage from "@/pages/admin/fab-lembretes";
import finPlanoContasPage from "@/pages/admin/fin-plano-contas";
import opoOportunidadesPage from "@/pages/admin/opo-oportunidades";
import opoOrcamentosPage from "@/pages/admin/opo-orcamentos";
import usuAcessosPage from "@/pages/admin/usu-acessos";
import usuDistanciasPage from "@/pages/admin/usu-distancias";
import finLancamentosPage from "@/pages/admin/fin-lancamentos";
import FinDashboardPage from "@/pages/admin/fin-dashboard/index";
import CreateFinLancamentoPage from "@/pages/admin/fin-lancamentos/create";
import EditFinLancamentoPage from "@/pages/admin/fin-lancamentos/[id]/edit";
import finPrestacaoContasPage from "@/pages/admin/fin-prestacao-contas";
import flwFollowsPage from "@/pages/admin/flw-follows";
import DocumentIngestionPage from "@/pages/documents/DocumentIngestionPage";
// <GEN-IMPORTS>

export interface NavItem {
    label: string;
    href?: string;
    icon: any; // LucideIcon
    section?: "main" | "host" | "admin" | "entities";
    permission?: string;
    items?: NavItem[];
}

export interface RouteConfig {
    path: string;
    component: React.ComponentType<any>;
    permission?: string;
}

export const routes: RouteConfig[] = [
    { path: "/dashboard", component: DashboardPage },
    { path: "/dashboard/crm", component: CrmDashboardPage },
    { path: "/tenant-dashboard", component: TenantDashboardPage },
    { path: "/auth/login", component: LoginPage },
    { path: "/auth/register", component: RegisterPage },
    { path: "/auth/forgot-password", component: ForgotPasswordPage },
    { path: "/profile", component: ProfilePage },
    { path: "/host/workspaces", component: HostWorkspacesPage },
    { path: "/host/tenants", component: HostWorkspacesPage },
    { path: "/host/tenant", component: HostWorkspacesPage },
    { path: "/host/users", component: HostUsersPage },
    { path: "/host/roles", component: HostRolesPage },
    { path: "/host/settings", component: HostSettingsPage },
    { path: "/host/editions", component: HostEditionsPage },
    { path: "/host/invitations", component: InvitationsPage },
    { path: "/host/audit-logs", component: AuditLogsPage },
    { path: "/host/security-logs", component: SecurityLogsPage },
    { path: "/host/org-units", component: OrgUnitsPage },
    { path: "/host/permission-groups", component: PermissionGroupsPage },
    { path: "/sessions", component: UserSessionsPage },
    { path: "/profile/lgpd", component: LgpdPage },
    { path: "/legal/terms", component: TermsPage },
    { path: "/legal/privacy", component: PrivacyPage },
    { path: "/admin/lawyer", component: LawyerPage },
    { path: "/admin/lawyer/create", component: LawyerFormPage },
    { path: "/admin/lawyer/:id/edit", component: LawyerFormPage },
    { path: "/admin/case", component: CasePage },
    { path: "/admin/client", component: ClientPage },
    { path: "/admin/specialization", component: SpecializationPage },
    { path: "/admin/legal-process", component: LegalProcessPage },
    { path: "/admin/lawyer-specialization", component: LawyerSpecializationPage },
    { path: "/admin/proposal/create", component: ProposalFormPage },
    { path: "/admin/proposal/:id/edit", component: ProposalFormPage },
    { path: "/admin/proposal", component: ProposalPage },
    { path: "/admin/propostal-item", component: PropostalItemPage },
    { path: "/admin/propostal-item/create", component: PropostalItemFormPage },
    { path: "/admin/propostal-item/:id/edit", component: PropostalItemFormPage },
    { path: "/admin/-versao-bd", component: _versaoBDPage },
    { path: "/admin/adv-cli-bairros", component: advCliBairrosPage },
    { path: "/admin/adv-cli-como-chegou", component: advCliComoChegouPage },
    { path: "/admin/adv-cli-locais-atendido", component: advCliLocaisAtendidoPage },
    { path: "/admin/adv-cli-log", component: advCliLogPage },
    { path: "/admin/adv-cli-prioridades", component: advCliPrioridadesPage },
    { path: "/admin/adv-clientes-convertidos", component: advClientesConvertidosPage },
    { path: "/admin/adv-clientes-modelos", component: advClientesModelosPage },
    { path: "/admin/adv-clientes-bkp", component: advClientes_bkpPage },
    { path: "/admin/adv-pauta-obs", component: advPautaObsPage },
    { path: "/admin/adv-pre-arquivos-status", component: advPreArquivosStatusPage },
    { path: "/admin/adv-pre-log-status", component: advPreLogStatusPage },
    { path: "/admin/adv-pre-metas", component: advPreMetasPage },
    { path: "/admin/adv-pre-motivos-perda", component: advPreMotivosPerdaPage },
    { path: "/admin/adv-pre-origens", component: advPreOrigensPage },
    { path: "/admin/adv-pre-processos-check-lists", component: advPreProcessosCheckListsPage },
    { path: "/admin/adv-pro-escritorios", component: advProEscritoriosPage },
    { path: "/admin/adv-pro-fases", component: advProFasesPage },
    { path: "/admin/adv-pro-instancias", component: advProInstanciasPage },
    { path: "/admin/adv-pro-orgaos", component: advProOrgaosPage },
    { path: "/admin/adv-pro-probabilidades", component: advProProbabilidadesPage },
    { path: "/admin/adv-pro-relevancias", component: advProRelevanciasPage },
    { path: "/admin/adv-pro-sentencas", component: advProSentencasPage },
    { path: "/admin/adv-pro-status", component: advProStatusPage },
    { path: "/admin/adv-pro-tipos", component: advProTiposPage },
    { path: "/admin/adv-pro-varas", component: advProVarasPage },
    { path: "/admin/adv-tarefas-atualizacoes", component: advTarefasAtualizacoesPage },
    { path: "/admin/auto-ftp", component: autoFTPPage },
    { path: "/admin/fab-config", component: fabConfigPage },
    { path: "/admin/fab-datas-eferiados", component: fabDatasEFeriadosPage },
    { path: "/admin/fab-formas-pagamento", component: fabFormasPagamentoPage },
    { path: "/admin/fab-formas-recebimento", component: fabFormasRecebimentoPage },
    { path: "/admin/fab-motivos-aproveitamento", component: fabMotivosAproveitamentoPage },
    { path: "/admin/fab-motivos-perda", component: fabMotivosPerdaPage },
    { path: "/admin/fab-regioes", component: fabRegioesPage },
    { path: "/admin/fdt-devs", component: fdtDevsPage },
    { path: "/admin/fin-centros-resultado", component: finCentrosResultadoPage },
    { path: "/admin/fin-contas-clientes", component: finContasClientesPage },
    { path: "/admin/fin-lancamentos-bkp", component: finLancamentos_BKPPage },
    { path: "/admin/fin-plano-contas-det", component: finPlanoContasDetPage },
    { path: "/admin/fin-procuracoes-rpv", component: finProcuracoesRPVPage },
    { path: "/admin/fin-rateios", component: finRateiosPage },
    { path: "/admin/fin-rateios-padrao", component: finRateiosPadraoPage },
    { path: "/admin/fin-recibos", component: finRecibosPage },
    { path: "/admin/fin-unidades", component: finUnidadesPage },
    { path: "/admin/flw-config", component: flwConfigPage },
    { path: "/admin/adv-age-tipos-compromissos", component: advAgeTiposCompromissosPage },
    { path: "/admin/adv-age-tipos-tarefas", component: advAgeTiposTarefasPage },
    { path: "/admin/adv-cli-cargos", component: advCliCargosPage },
    { path: "/admin/adv-cli-grupos", component: advCliGruposPage },
    { path: "/admin/adv-cli-situacoes", component: advCliSituacoesPage },
    { path: "/admin/adv-cli-tipos-arquivos", component: advCliTiposArquivosPage },
    { path: "/admin/adv-cli-tipos-historicos", component: advCliTiposHistoricosPage },
    { path: "/admin/adv-clientes-inssstatus", component: advClientesINSSStatusPage },
    { path: "/admin/adv-fornecedores", component: advFornecedoresPage },
    { path: "/admin/adv-postos-inss", component: advPostosINSSPage },
    { path: "/admin/adv-pre-check-lists-grupos", component: advPreCheckListsGruposPage },
    { path: "/admin/adv-pre-status-tipos", component: advPreStatusTiposPage },
    { path: "/admin/adv-pro-meritos", component: advProMeritosPage },
    { path: "/admin/adv-pro-naturezas", component: advProNaturezasPage },
    { path: "/admin/adv-ver-tipos", component: advVerTiposPage },
    { path: "/admin/fab-condicoes-pagamento", component: fabCondicoesPagamentoPage },
    { path: "/admin/fab-historico-tipos", component: fabHistoricoTiposPage },
    { path: "/admin/fab-paises", component: fabPaisesPage },
    { path: "/admin/fab-permissoes-tipos", component: fabPermissoesTiposPage },
    { path: "/admin/fin-areas", component: finAreasPage },
    { path: "/admin/fin-centros-custo", component: finCentrosCustoPage },
    { path: "/admin/fin-contas", component: finContasPage },
    { path: "/admin/fin-grupos-dre", component: finGruposDREPage },
    { path: "/admin/flw-acoes", component: flwAcoesPage },
    { path: "/admin/log-acoes", component: logAcoesPage },
    { path: "/admin/opo-situacoes", component: opoSituacoesPage },
    { path: "/admin/opo-tipos", component: opoTiposPage },
    { path: "/admin/usu-areas", component: usuAreasPage },
    { path: "/admin/adv-clientes", component: advClientesPage },
    { path: "/admin/adv-clientes/create", component: CreateClientePage },
    { path: "/admin/adv-clientes/:id/edit", component: EditClientePage },
    { path: "/admin/adv-clientes-arquivos", component: advClientesArquivosPage },
    { path: "/admin/adv-clientes-atualizacoes", component: advClientesAtualizacoesPage },
    { path: "/admin/adv-clientes-checklist", component: advClientesChecklistPage },
    { path: "/admin/adv-clientes-inss", component: advClientesINSSPage },
    { path: "/admin/adv-pre-check-lists", component: advPreCheckListsPage },
    { path: "/admin/adv-pre-status", component: advPreStatusPage },
    { path: "/admin/adv-processos", component: advProcessosPage },
    { path: "/admin/adv-processos/create", component: CreateProcessPage },
    { path: "/admin/adv-processos/:id/edit", component: EditProcessPage },
    { path: "/admin/adv-processos-clientes", component: advProcessosClientesPage },
    { path: "/admin/adv-processos-honorarios", component: advProcessosHonorariosPage },
    { path: "/admin/adv-processos-meritos", component: advProcessosMeritosPage },
    { path: "/admin/fab-estados", component: fabEstadosPage },
    { path: "/admin/fab-permissoes", component: fabPermissoesPage },
    { path: "/admin/fin-extrato", component: finExtratoPage },
    { path: "/admin/fin-plano-contas-grupos", component: finPlanoContasGruposPage },
    { path: "/admin/flw-config-excecoes", component: flwConfigExcecoesPage },
    { path: "/admin/flw-grade-horarios", component: flwGradeHorariosPage },
    { path: "/admin/log-campos", component: logCamposPage },
    { path: "/admin/usu-cargos", component: usuCargosPage },
    { path: "/admin/adv-clientes-historicos", component: advClientesHistoricosPage },
    { path: "/admin/adv-compromissos", component: advCompromissosPage },
    { path: "/admin/adv-compromissos/create", component: CreateAdvCompromissoPage },
    { path: "/admin/adv-compromissos/:id/edit", component: EditAdvCompromissoPage },
    { path: "/admin/adv-processos-alteracoes", component: advProcessosAlteracoesPage },
    { path: "/admin/adv-processos-dados-herdeiros", component: advProcessosDadosHerdeirosPage },
    { path: "/admin/adv-profissionais", component: advProfissionaisPage },
    { path: "/admin/adv-profissionais/create", component: CreateProfissionalPage },
    { path: "/admin/adv-profissionais/:id/edit", component: EditProfissionalPage },
    { path: "/admin/adv-profissionais-estados", component: advProfissionaisEstadosPage },
    { path: "/admin/adv-profissionais-naturezas", component: advProfissionaisNaturezasPage },
    { path: "/admin/adv-revisao-documentos", component: advRevisaoDocumentosPage },
    { path: "/admin/adv-tarefas", component: advTarefasPage },
    { path: "/admin/adv-tarefas/create", component: CreateAdvTarefaPage },
    { path: "/admin/adv-tarefas/:id/edit", component: EditAdvTarefaPage },
    { path: "/admin/adv-verbas", component: advVerbasPage },
    { path: "/admin/fab-cidades", component: fabCidadesPage },
    { path: "/admin/fab-lembretes", component: fabLembretesPage },
    { path: "/admin/fin-plano-contas", component: finPlanoContasPage },
    { path: "/admin/opo-oportunidades", component: opoOportunidadesPage },
    { path: "/admin/opo-orcamentos", component: opoOrcamentosPage },
    { path: "/admin/usu-acessos", component: usuAcessosPage },
    { path: "/admin/usu-distancias", component: usuDistanciasPage },
    { path: "/admin/fin-dashboard", component: FinDashboardPage },
    { path: "/admin/fin-lancamentos", component: finLancamentosPage },
    { path: "/admin/fin-lancamentos/create", component: CreateFinLancamentoPage },
    { path: "/admin/fin-lancamentos/:id/edit", component: EditFinLancamentoPage },
    { path: "/admin/fin-prestacao-contas", component: finPrestacaoContasPage },
    { path: "/admin/flw-follows", component: flwFollowsPage },
    { path: "/admin/adv-document-ingestion", component: DocumentIngestionPage },
    // <GEN-ROUTES>
];

export const menuItems: NavItem[] = [
    { label: "Painel", href: "/dashboard", icon: LayoutDashboard, section: "main" },
    { label: "Meu Perfil", href: "/profile", icon: User, section: "main" },

    // ============================================
    // JURÍDICO (Legal)
    // ============================================
    {
        label: "Jurídico",
        icon: Scale,
        section: "entities",
        items: [
            { label: "Processos", href: "/admin/adv-processos", icon: Scale },
            { label: "Ingestão de Pareceres", href: "/admin/adv-document-ingestion", icon: FileText },
            { label: "Tarefas e Prazos", href: "/admin/adv-tarefas", icon: CalendarCheck },
            { label: "Agenda", href: "/admin/adv-compromissos", icon: CalendarCheck },
            { label: "Advogados", href: "/admin/adv-profissionais", icon: Briefcase },
            {
                label: "Auxiliares Jurídico",
                icon: Database,
                items: [
                    // advPro*
                    { label: "Fases Processuais", href: "/admin/adv-pro-fases", icon: Box },
                    { label: "Varas", href: "/admin/adv-pro-varas", icon: Box },
                    { label: "Órgãos", href: "/admin/adv-pro-orgaos", icon: Box },
                    { label: "Instâncias", href: "/admin/adv-pro-instancias", icon: Box },
                    { label: "Tipos de Processo", href: "/admin/adv-pro-tipos", icon: Box },
                    { label: "Status Processual", href: "/admin/adv-pro-status", icon: Box },
                    { label: "Sentenças", href: "/admin/adv-pro-sentencas", icon: Box },
                    { label: "Méritos", href: "/admin/adv-pro-meritos", icon: Box },
                    { label: "Naturezas", href: "/admin/adv-pro-naturezas", icon: Box },
                    { label: "Relevâncias", href: "/admin/adv-pro-relevancias", icon: Box },
                    { label: "Probabilidades", href: "/admin/adv-pro-probabilidades", icon: Box },
                    { label: "Escritórios Envolvidos", href: "/admin/adv-pro-escritorios", icon: Box },
                    // advVer*
                    { label: "Verbas", href: "/admin/adv-verbas", icon: Box },
                    { label: "Tipos de Verbas", href: "/admin/adv-ver-tipos", icon: Box },
                    // advAge*
                    { label: "Tipos de Compromisso", href: "/admin/adv-age-tipos-compromissos", icon: Box },
                    { label: "Tipos de Tarefa", href: "/admin/adv-age-tipos-tarefas", icon: Box },
                    // Outros Processuais
                    { label: "Status (Arquivos)", href: "/admin/adv-pre-arquivos-status", icon: Box },
                    { label: "Alterações", href: "/admin/adv-processos-alteracoes", icon: Box },
                    { label: "Clientes x Processo", href: "/admin/adv-processos-clientes", icon: Box },
                    { label: "Herdeiros", href: "/admin/adv-processos-dados-herdeiros", icon: Box },
                    { label: "Honorários", href: "/admin/adv-processos-honorarios", icon: Box },
                    { label: "Méritos Detalhes", href: "/admin/adv-processos-meritos", icon: Box },
                    // Profissionais
                    { label: "Profissionais Estados", href: "/admin/adv-profissionais-estados", icon: Box },
                    { label: "Profissionais Naturezas", href: "/admin/adv-profissionais-naturezas", icon: Box },
                    { label: "Revisão Docs", href: "/admin/adv-revisao-documentos", icon: Box },
                ]
            }
        ]
    },

    // ============================================
    // CRM
    // ============================================
    {
        label: "CRM e Clientes",
        icon: Users,
        section: "entities",
        items: [
            { label: "Dashboard CRM", href: "/dashboard/crm", icon: LayoutDashboard },
            { label: "Clientes", href: "/admin/adv-clientes", icon: Users },
            { label: "Oportunidades", href: "/admin/opo-oportunidades", icon: Handshake },
            { label: "Orçamentos", href: "/admin/opo-orcamentos", icon: FileText },
            {
                label: "Auxiliares CRM",
                icon: Database,
                items: [
                    // advCli*
                    { label: "Bairros", href: "/admin/adv-cli-bairros", icon: Box },
                    { label: "Cargos", href: "/admin/adv-cli-cargos", icon: Box },
                    { label: "Grupos", href: "/admin/adv-cli-grupos", icon: Box },
                    { label: "Situações", href: "/admin/adv-cli-situacoes", icon: Box },
                    { label: "Como Chegou", href: "/admin/adv-cli-como-chegou", icon: Box },
                    { label: "Locais Atendidos", href: "/admin/adv-cli-locais-atendido", icon: Box },
                    { label: "Logs Clientes", href: "/admin/adv-cli-log", icon: Box },
                    { label: "Prioridades", href: "/admin/adv-cli-prioridades", icon: Box },
                    { label: "Tipos Arquivos", href: "/admin/adv-cli-tipos-arquivos", icon: Box },
                    { label: "Tipos Históricos", href: "/admin/adv-cli-tipos-historicos", icon: Box },

                    // Clientes Detalhes
                    { label: "Arquivos", href: "/admin/adv-clientes-arquivos", icon: Box },
                    { label: "Atualizações", href: "/admin/adv-clientes-atualizacoes", icon: Box },
                    { label: "Checklists", href: "/admin/adv-clientes-checklist", icon: Box },
                    { label: "INSS", href: "/admin/adv-clientes-inss", icon: Box },
                    { label: "INSS Status", href: "/admin/adv-clientes-inssstatus", icon: Box },
                    { label: "Convertidos", href: "/admin/adv-clientes-convertidos", icon: Box },
                    { label: "Históricos", href: "/admin/adv-clientes-historicos", icon: Box },
                    { label: "Modelos", href: "/admin/adv-clientes-modelos", icon: Box },
                    { label: "Backup Clientes", href: "/admin/adv-clientes-bkp", icon: Box },
                    { label: "Fornecedores", href: "/admin/adv-fornecedores", icon: Box },
                    { label: "Postos INSS", href: "/admin/adv-postos-inss", icon: Box },

                    // opo*
                    { label: "Situações Oportunidade", href: "/admin/opo-situacoes", icon: Box },
                    { label: "Tipos Oportunidade", href: "/admin/opo-tipos", icon: Box },

                    // advPre*
                    { label: "Pré - Checklists", href: "/admin/adv-pre-check-lists", icon: Box },
                    { label: "Pré - Checklists Grupos", href: "/admin/adv-pre-check-lists-grupos", icon: Box },
                    { label: "Pré - Status", href: "/admin/adv-pre-status", icon: Box },
                    { label: "Pré - Status Tipos", href: "/admin/adv-pre-status-tipos", icon: Box },
                    { label: "Pré - Logs", href: "/admin/adv-pre-log-status", icon: Box },
                    { label: "Pré - Metas", href: "/admin/adv-pre-metas", icon: Box },
                    { label: "Pré - Motivos Perda", href: "/admin/adv-pre-motivos-perda", icon: Box },
                    { label: "Pré - Origens", href: "/admin/adv-pre-origens", icon: Box },
                    { label: "Pré - Processos Checklist", href: "/admin/adv-pre-processos-check-lists", icon: Box },
                ]
            }
        ]
    },


    // ============================================
    // FINANCEIRO
    // ============================================
    {
        label: "Financeiro",
        icon: DollarSign,
        section: "entities",
        items: [
            { label: "Dashboard Gerencial", href: "/admin/fin-dashboard", icon: LayoutDashboard },
            { label: "Lançamentos e Extrato", href: "/admin/fin-lancamentos", icon: DollarSign },
            { label: "Extrato (View)", href: "/admin/fin-extrato", icon: FileText },
            { label: "Prestação de Contas", href: "/admin/fin-prestacao-contas", icon: FileText },
            { label: "Recibos", href: "/admin/fin-recibos", icon: FileText },
            { label: "Procurações RPV", href: "/admin/fin-procuracoes-rpv", icon: FileText },

            {
                label: "Cadastros Financeiros",
                icon: Database,
                items: [
                    { label: "Contas", href: "/admin/fin-contas", icon: Box },
                    { label: "Contas Clientes", href: "/admin/fin-contas-clientes", icon: Box },
                    { label: "Plano de Contas", href: "/admin/fin-plano-contas", icon: Box },
                    { label: "Plano de Contas Detalhes", href: "/admin/fin-plano-contas-det", icon: Box },
                    { label: "Plano de Contas Grupos", href: "/admin/fin-plano-contas-grupos", icon: Box },
                    { label: "Centros de Custo", href: "/admin/fin-centros-custo", icon: Box },
                    { label: "Centros de Resultado", href: "/admin/fin-centros-resultado", icon: Box },
                    { label: "Áreas Financeiras", href: "/admin/fin-areas", icon: Box },
                    { label: "Grupos DRE", href: "/admin/fin-grupos-dre", icon: Box },
                    { label: "Rateios", href: "/admin/fin-rateios", icon: Box },
                    { label: "Rateios Padrão", href: "/admin/fin-rateios-padrao", icon: Box },
                    { label: "Unidades", href: "/admin/fin-unidades", icon: Box },
                    { label: "Lançamentos BKP", href: "/admin/fin-lancamentos-bkp", icon: Box },
                ]
            }
        ]

    },

    // ============================================
    // ADMIN E CONFIGURAÇÕES
    // ============================================
    {
        label: "Administração",
        icon: Settings2,
        section: "entities",
        items: [
            { label: "Configurações Globais", href: "/admin/fab-config", icon: Settings },
            { label: "Integração FTP", href: "/admin/auto-ftp", icon: Network },
            {
                label: "Tabelas Auxiliares",
                icon: Database,
                items: [
                    // fab*
                    { label: "Cidades", href: "/admin/fab-cidades", icon: Box },
                    { label: "Estados", href: "/admin/fab-estados", icon: Box },
                    { label: "Países", href: "/admin/fab-paises", icon: Box },
                    { label: "Regiões", href: "/admin/fab-regioes", icon: Box },
                    { label: "Datas e Feriados", href: "/admin/fab-datas-eferiados", icon: Box },
                    { label: "Formas Pagamento", href: "/admin/fab-formas-pagamento", icon: Box },
                    { label: "Condições Pagamento", href: "/admin/fab-condicoes-pagamento", icon: Box },
                    { label: "Formas Recebimento", href: "/admin/fab-formas-recebimento", icon: Box },
                    { label: "Motivos Aproveitamento", href: "/admin/fab-motivos-aproveitamento", icon: Box },
                    { label: "Motivos Perda", href: "/admin/fab-motivos-perda", icon: Box },
                    { label: "Permissões", href: "/admin/fab-permissoes", icon: Box },
                    { label: "Permissões Tipos", href: "/admin/fab-permissoes-tipos", icon: Box },
                    { label: "Lembretes", href: "/admin/fab-lembretes", icon: Box },
                    { label: "Histórico Tipos", href: "/admin/fab-historico-tipos", icon: Box },

                    // usu*
                    { label: "Acessos Usuário", href: "/admin/usu-acessos", icon: Box },
                    { label: "Áreas Usuário", href: "/admin/usu-areas", icon: Box },
                    { label: "Cargos Usuário", href: "/admin/usu-cargos", icon: Box },
                    { label: "Distâncias Usuário", href: "/admin/usu-distancias", icon: Box },

                    // flw*
                    { label: "Workflow Config", href: "/admin/flw-config", icon: Box },
                    { label: "Workflow Ações", href: "/admin/flw-acoes", icon: Box },
                    { label: "Workflow Follows", href: "/admin/flw-follows", icon: Box },
                    { label: "Workflow Grade Horários", href: "/admin/flw-grade-horarios", icon: Box },
                    { label: "Workflow Exceções", href: "/admin/flw-config-excecoes", icon: Box },

                    // log*
                    { label: "Log Ações", href: "/admin/log-acoes", icon: Box },
                    { label: "Log Campos", href: "/admin/log-campos", icon: Box },

                    // Outros
                    { label: "Devs FDT", href: "/admin/fdt-devs", icon: Box },
                    { label: "Pauta Obs", href: "/admin/adv-pauta-obs", icon: Box },
                    { label: "Versão BD", href: "/admin/-versao-bd", icon: Box },
                    { label: "Especializações", href: "/admin/specialization", icon: Box },
                    { label: "Advogado Especialização", href: "/admin/lawyer-specialization", icon: Box },
                ]
            }
        ]
    },


    // Host Administration
    { label: "Espaços de Trabalho", href: "/host/workspaces", icon: Building2, section: "host" },
    { label: "Edições", href: "/host/editions", icon: Crown, section: "host" },


    // Administration (Tenant / Shared)
    {
        label: "Gerenciamento de Identidade",
        icon: Users2,
        section: "admin",
        items: [
            { label: "Unidades Organizacionais", href: "/host/org-units", icon: Network },
            { label: "Grupos de Permissão", href: "/host/permission-groups", icon: ShieldCheck },
            { label: "Perfis de Acesso", href: "/host/roles", icon: Shield },
            { label: "Usuários", href: "/host/users", icon: Users },
            { label: "Convites", href: "/host/invitations", icon: UserPlus, section: "admin" },
            { label: "Logs de Segurança", href: "/host/security-logs", icon: ShieldAlert },
        ]
    },
    { label: "Configurações", href: "/host/settings", icon: Settings, section: "admin" },
    { label: "Logs de Auditoria", href: "/host/audit-logs", icon: FileText, section: "admin" },
    // <GEN-MENU>
];

