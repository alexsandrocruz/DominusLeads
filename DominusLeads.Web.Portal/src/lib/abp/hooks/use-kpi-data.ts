import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";

export interface KPIData {
    activeProcesses: number;
    newCasesMonth: number;
    pendingTasks: number;
    overdueTasks: number;
    processesByPhase: { name: string; value: number }[];
    tasksByExecutor: { name: string; value: number }[];
    tasksTimeline: { date: string; value: number }[];
    pipelineStats: { name: string; value: number }[];
}

export function useKpiData() {
    return useQuery({
        queryKey: ["dashboard", "kpi"],
        queryFn: async (): Promise<KPIData> => {
            // Fetch total counts from new DominusLeads entities
            const [leadsRes, creditsRes] = await Promise.all([
                apiClient.get("/api/app/lead", { params: { maxResultCount: 1 } }),
                apiClient.get("/api/app/credit", { params: { maxResultCount: 1 } }),
            ]);

            const activeProcesses = leadsRes.data?.totalCount || 0;
            const pendingTasks = 0; // Legacy tasks no longer exist
            const totalClients = leadsRes.data?.totalCount || 0;
            const credits = creditsRes.data?.totalCount || 0;

            // For presentation, we'll keep some distribution mocks but use real totals
            return {
                activeProcesses,
                newCasesMonth: Math.round(activeProcesses * 0.15), // Derived for demo
                pendingTasks,
                overdueTasks: Math.round(pendingTasks * 0.2), // Derived for demo
                processesByPhase: [
                    { name: "Inicial", value: Math.round(activeProcesses * 0.3) },
                    { name: "Instrução", value: Math.round(activeProcesses * 0.4) },
                    { name: "Recurso", value: Math.round(activeProcesses * 0.2) },
                    { name: "Execução", value: Math.round(activeProcesses * 0.1) },
                ],
                tasksByExecutor: [
                    { name: "Equipe", value: pendingTasks },
                ],
                tasksTimeline: [
                    { date: "Seg", value: 5 },
                    { date: "Ter", value: 8 },
                    { date: "Qua", value: 12 },
                    { date: "Qui", value: 7 },
                    { date: "Sex", value: 13 },
                ],
                pipelineStats: [
                    { name: "Leads", value: activeProcesses },
                    { name: "Créditos", value: credits },
                ]
            };
        },
        staleTime: 30000,
    });
}
