import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, CheckSquare, AlertTriangle, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKpiData } from "@/lib/abp/hooks/use-kpi-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ProcessesPhaseChart, TasksTimelineChart, ExecutorWorkloadChart, PipelineFunnelChart } from "@/components/dashboard/lexus-charts";

export default function DashboardPage() {
    const { data: stats, isLoading } = useKpiData();

    const statConfig = [
        {
            key: "activeProcesses",
            title: "Processos Ativos",
            description: "Casos em andamento",
            icon: Scale,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            key: "newCasesMonth",
            title: "Novos Casos",
            description: "Neste mês",
            icon: FileText,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            key: "pendingTasks",
            title: "Tarefas Pendentes",
            description: "A aguardar conclusão",
            icon: CheckSquare,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            key: "overdueTasks",
            title: "Tarefas Atrasadas",
            description: "Prioridade alta",
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Operacional</h1>
                        <p className="text-muted-foreground">
                            Visão geral da produtividade e prazos do escritório.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="size-4" />
                            Jan 2026
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Download className="size-4" />
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statConfig.map((stat) => (
                        <Card key={stat.key} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`size-4 ${stat.color}`} />
                                </div >
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">
                                            {stats?.[stat.key as keyof typeof stats]?.toLocaleString() ?? "-"}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Dashboard Content */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                    {/* Processos por Fase */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Processos por Fase</CardTitle>
                            <CardDescription>
                                Distribuição atual dos casos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <ProcessesPhaseChart data={stats?.processesByPhase || []} />}
                        </CardContent>
                    </Card>

                    {/* Timeline Tarefas */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Prazos e Entregas</CardTitle>
                            <CardDescription>
                                Volume de tarefas nesta semana
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <TasksTimelineChart data={stats?.tasksTimeline || []} />}
                        </CardContent>
                    </Card>

                    {/* Carga de Trabalho */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Carga de Trabalho</CardTitle>
                            <CardDescription>
                                Tarefas pendentes por advogado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <ExecutorWorkloadChart data={stats?.tasksByExecutor || []} />}
                        </CardContent>
                    </Card>

                    {/* Pipeline Funnel */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Saúde do Pipeline</CardTitle>
                            <CardDescription>
                                Pré-processos e conversão
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <PipelineFunnelChart data={stats?.pipelineStats || []} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
