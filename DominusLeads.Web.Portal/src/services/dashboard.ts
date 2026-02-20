import { apiClient } from "../lib/abp/api-client";

export interface DashboardStats {
    totalLeads: number;
    leadsThisMonth: number;
    creditsBalance: number;
    activeSearches: number;
    conversionRate: number;
}

export interface LeadEvolutionPoint {
    period: string;
    count: number;
}

export interface RecentActivity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    color?: string;
    icon?: string;
}

export interface DashboardSummary {
    stats: DashboardStats;
    evolution: LeadEvolutionPoint[];
    recentActivities: RecentActivity[];
}

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response = await apiClient.get<DashboardSummary>("/api/app/dashboard/summary");
        return response.data;
    },
};
