import {
    LayoutDashboard,
    Activity,
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
    Search,
    Zap,
    CreditCard,
    LayoutTemplate,
    BarChart3,
    History,
    Share2
} from "lucide-react";
import React from "react";

// Page Imports
import DashboardPage from "@/pages/dashboard";
import SearchLeadsPage from "@/pages/search/SearchLeadsPage";
import LeadsListPage from "@/pages/leads/LeadsListPage";
import LeadDetailPage from "@/pages/leads/LeadDetailPage";
import DominusAutomationPage from "@/pages/automation/DominusAutomationPage";
import AutomationFlowPage from "@/pages/automation/AutomationFlowPage";
import AiTrainingPage from "@/pages/automation/AiTrainingPage";
import AiLogsPage from "@/pages/automation/AiLogsPage";
import CampaignListPage from "@/pages/campaigns/CampaignListPage";
import CampaignConfigPage from "@/pages/campaigns/CampaignConfigPage";
import BillingDashboardPage from "@/pages/billing/BillingDashboardPage";
import RoiReportPage from "@/pages/reports/RoiReportPage";
import CompanySettingsPage from "@/pages/settings/CompanySettingsPage";
import IntegrationsPage from "@/pages/integrations/IntegrationsPage";
import SchedulingPage from "@/pages/automation/SchedulingPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import SupportPage from "@/pages/support/SupportPage";
import HostDashboardPage from "@/pages/host/HostDashboardPage";
import HostTenantsPage from "@/pages/host/HostTenantsPage";
import HostStatsPage from "@/pages/host/HostStatsPage";
import HostSystemHealthPage from "@/pages/host/HostSystemHealthPage";
import GlobalCostsPage from "@/pages/host/GlobalCostsPage";
import SecurityDashboardPage from "@/pages/host/SecurityDashboardPage";
import DominusBillingPage from "@/pages/billing/DominusBillingPage";
// Core Layout & Settings (Keeping for reference/template)
import HostUsersPage from "@/pages/host/users";
import HostRolesPage from "@/pages/host/roles";
import HostSettingsPage from "@/pages/host/settings";
import HostEditionsPage from "@/pages/host/editions";
import AuditLogsPage from "@/pages/host/audit-logs";
import SecurityLogsPage from "@/pages/host/security-logs";
import OrgUnitsPage from "@/pages/host/org-units";
import PermissionGroupsPage from "@/pages/host/permission-groups";

// Auth & Profile
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ProfilePage from "@/pages/profile";

// Legal/System
import TermsPage from "@/pages/legal/terms";
import PrivacyPage from "@/pages/legal/privacy";
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
    { path: "/leads/:id", component: LeadDetailPage },
    { path: "/search", component: SearchLeadsPage },
    { path: "/automation", component: DominusAutomationPage },
    { path: "/automation/flow", component: AutomationFlowPage },
    { path: "/automation/training", component: AiTrainingPage },
    { path: "/automation/logs", component: AiLogsPage },
    { path: "/campaigns", component: CampaignListPage },
    { path: "/campaigns/config", component: CampaignConfigPage },
    { path: "/settings/company", component: CompanySettingsPage },
    { path: "/settings/integrations", component: IntegrationsPage },
    { path: "/automation/scheduling", component: SchedulingPage },
    { path: "/onboarding", component: OnboardingPage },
    { path: "/support", component: SupportPage },
    { path: "/host/dashboard", component: HostDashboardPage },
    { path: "/host/tenants", component: HostTenantsPage },
    { path: "/host/stats", component: HostStatsPage },
    { path: "/host/health", component: HostSystemHealthPage },
    { path: "/host/costs", component: GlobalCostsPage },
    { path: "/host/security", component: SecurityDashboardPage },
    { path: "/reports/roi", component: RoiReportPage },
    { path: "/billing", component: BillingDashboardPage },
    { path: "/billing/legacy", component: DominusBillingPage },
    { path: "/auth/login", component: LoginPage },
    { path: "/auth/register", component: RegisterPage },
    { path: "/auth/forgot-password", component: ForgotPasswordPage },
    { path: "/profile", component: ProfilePage },
    { path: "/legal/terms", component: TermsPage },
    { path: "/legal/privacy", component: PrivacyPage },
    { path: "/host/users", component: HostUsersPage, permission: "AbpIdentity.Users" },
    { path: "/host/roles", component: HostRolesPage, permission: "AbpIdentity.Roles" },
    { path: "/host/settings", component: HostSettingsPage, permission: "AbpSettingManagement.Settings" },
    { path: "/host/editions", component: HostEditionsPage, permission: "Saas.Editions" },
    { path: "/host/audit-logs", component: AuditLogsPage, permission: "AbpAuditLogging.AuditLogs" },
    { path: "/host/security-logs", component: SecurityLogsPage, permission: "AbpIdentity.SecurityLogs" },
    { path: "/host/org-units", component: OrgUnitsPage, permission: "AbpIdentity.OrganizationUnits" },
    { path: "/host/permission-groups", component: PermissionGroupsPage },
];

export const menuItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
    { label: "Gestão de Leads", href: "/leads", icon: Users, section: "main" },
    { label: "Busca e Filtros", href: "/search", icon: Search, section: "main" },
    { label: "Automações", href: "/automation", icon: Zap, section: "main" },
    { label: "Logs de IA", href: "/automation/logs", icon: History, section: "main" },
    { label: "Campanhas", href: "/campaigns", icon: LayoutTemplate, section: "main" },
    { label: "Faturamento", href: "/billing", icon: CreditCard, section: "main" },
    { label: "Relatórios ROI", href: "/reports/roi", icon: BarChart3, section: "main" },
    { label: "Integrações", href: "/settings/integrations", icon: Share2, section: "main" },
    { label: "Status do Sistema", href: "/host/health", icon: Activity, section: "main" },
    { label: "Gestão de Custos", href: "/host/costs", icon: DollarSign, section: "main" },
    { label: "Segurança Global", href: "/host/security", icon: ShieldAlert, section: "main" },
    { label: "Dados da Empresa", href: "/settings/company", icon: Building2, section: "main" },
    { label: "Configurações", href: "/host/settings", icon: Settings, section: "main" },
    // <GEN-MENU>
];

