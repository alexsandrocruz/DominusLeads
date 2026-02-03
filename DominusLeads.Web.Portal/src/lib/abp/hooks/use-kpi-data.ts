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
            // Fetch total counts using maxResultCount: 1 to minimize payload
            const [processesRes, clientsRes, tasksRes] = await Promise.all([
                apiClient.get("/api/app/adv-processos", { params: { maxResultCount: 1 } }),
                apiClient.get("/api/app/adv-clientes", { params: { maxResultCount: 1, prospect: false } }),
                apiClient.get("/api/app/adv-tarefas", { params: { maxResultCount: 1 } }),
            ]);

            const activeProcesses = processesRes.data?.totalCount || 0;
            const pendingTasks = tasksRes.data?.totalCount || 0;
            const totalClients = clientsRes.data?.totalCount || 0;

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
                    { name: "Clientes", value: totalClients },
                ]
            };
        },
        staleTime: 30000,
    });
}
