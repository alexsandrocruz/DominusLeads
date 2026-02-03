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
    Archive,
    Search
} from "lucide-react";
import React from "react";

// Page Imports
import DashboardPage from "@/pages/dashboard/DominusDashboardPage";
import SearchLeadsPage from "@/pages/search/SearchLeadsPage";
import LeadsListPage from "@/pages/leads/LeadsListPage";
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
    { path: "/leads", component: LeadsListPage },
    { path: "/search", component: SearchLeadsPage },
    { path: "/auth/login", component: LoginPage },
    // <GEN-ROUTES>
];

export const menuItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
    { label: "Gestão de Leads", href: "/leads", icon: Users, section: "main" },
    { label: "Busca e Filtros", href: "/search", icon: Search, section: "main" },
    { label: "Configurações", href: "/host/settings", icon: Settings, section: "main" },
    // <GEN-MENU>
];

