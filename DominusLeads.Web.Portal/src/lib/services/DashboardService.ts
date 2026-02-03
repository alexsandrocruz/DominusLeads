import { apiClient } from "../abp/api-client";
// Types defined in this file

// Defining interfaces here if not using separate types file, but to keep it clean I will define them here
export interface TaskSummary {
    usuarioId: number;
    usuarioNome: string;
    openTasks: number;
    delayedTasks: number;
    completedTasks: number;
}

export interface FollowUpSummary {
    usuarioId: number;
    usuarioNome: string;
    count: number;
}

export interface ConversionRate {
    usuarioId: number;
    usuarioNome: string;
    opportunitiesCount: number;
    convertedCount: number;
    rate: number;
}

export interface FinancialSummary {
    inflow: number;
    outflow: number;
    balance: number;
    accountsReceivable: number;
    overdueReceivable: number;
}

export interface CashFlowDaily {
    date: string;
    inflow: number;
    outflow: number;
}

export interface DashboardOperationalData {
    tasksByEmployee: TaskSummary[];
    recentFollowUps: FollowUpSummary[];
    conversionRates: ConversionRate[];
    delayedTasksCount: number;
    openTasksCount: number;
    preProcessesPendingCount: number;
}

export interface DashboardManagerialData {
    financials: FinancialSummary;
    cashFlow: CashFlowDaily[];
    totalPortfolioValue: number;
    salesPipelineValue: number;
    newClientsThisMonth: number;
}

export const getOperationalDashboard = async (startDate?: string, endDate?: string) => {
    return apiClient.get<DashboardOperationalData>("/api/app/dashboard/operational-dashboard", {
        params: { startDate, endDate },
    });
};

export const getManagerialDashboard = async () => {
    return apiClient.get<DashboardManagerialData>("/api/app/dashboard/managerial-dashboard");
};
