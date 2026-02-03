import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import {
    Scale,
    CheckCircle2,
    AlertCircle,
    Clock,
    TrendingUp,
    LayoutDashboard
} from "lucide-react";
import { useAdvProcessoses } from "@/lib/abp/hooks/useAdvProcessoses";
import { useAdvTarefases } from "@/lib/abp/hooks/useAdvTarefases";
import { useAdvCompromissoses } from "@/lib/abp/hooks/useAdvCompromissoses";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvProfissionalKPIsProps {
    idProfissional?: string;
}

export function AdvProfissionalKPIs({ idProfissional }: AdvProfissionalKPIsProps) {
    const isGlobal = !idProfissional;

    // Fetching data
    const { data: processes, isLoading: loadingProcesses } = useAdvProcessoses({
        idResponsavel: idProfissional ? parseInt(idProfissional) : undefined,
        maxResultCount: 1000,
    });

    const { data: tasks, isLoading: loadingTasks } = useAdvTarefases({
        idExecutor: idProfissional ? parseInt(idProfissional) : undefined,
        maxResultCount: 1000,
    });

    const { data: appointments, isLoading: loadingAppointments } = useAdvCompromissoses({
        pautaIdUsuarioResp: idProfissional ? parseInt(idProfissional) : undefined,
        maxResultCount: 1000,
    });

    // Calculate Metrics
    const metrics = useMemo(() => {
        if (!processes || !tasks || !appointments) return null;

        const activeProcesses = processes.items?.filter((p: any) => p.ativo).length || 0;
        const pendingTasks = tasks.items?.filter((t: any) => !t.finalizado).length || 0;
        const completedTasks = tasks.items?.filter((t: any) => t.finalizado).length || 0;

        // Deadlines in next 7 days
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const upcomingDeadlines = appointments.items?.filter((a: any) => {
            if (!a.dataPrazoFatal) return false;
            const deadLine = new Date(a.dataPrazoFatal);
            return deadLine >= now && deadLine <= nextWeek;
        }).length || 0;

        // Task Completion Rate
        const totalTasks = pendingTasks + completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
            activeProcesses,
            pendingTasks,
            upcomingDeadlines,
            completionRate,
            tasksByStatus: [
                { name: "Concluídas", value: completedTasks, color: "hsl(var(--primary))" },
                { name: "Pendentes", value: pendingTasks, color: "hsl(var(--muted-foreground))" },
            ],
            // Add more data transformations here as needed for charts
        };
    }, [processes, tasks, appointments]);

    if (loadingProcesses || loadingTasks || loadingAppointments) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-1" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-semibold">
                    {isGlobal ? "Visão Geral do Escritório" : "Painel de Performance"}
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Processos Ativos</CardTitle>
                        <Scale className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeProcesses}</div>
                        <p className="text-xs text-muted-foreground">
                            {isGlobal ? "Total de processos ativos" : "Sob sua responsabilidade"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.pendingTasks}</div>
                        <p className="text-xs text-muted-foreground">Aguardando execução</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Prazos Fatais</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.upcomingDeadlines}</div>
                        <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.completionRate}%</div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                                style={{ width: `${metrics.completionRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Visão Geral de Tarefas</CardTitle>
                        <CardDescription>Comparativo entre tarefas concluídas e pendentes</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.tasksByStatus}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <RechartsTooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {metrics.tasksByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Eficiência de Entrega</CardTitle>
                        <CardDescription>Status atual das demandas vinculadas</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{metrics.completionRate}%</div>
                            <div className="text-sm text-muted-foreground">Produtividade Geral</div>
                        </div>
                        {/* We could add a simple Pie chart here or just remain with the visual text */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
