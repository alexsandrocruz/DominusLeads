import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Rocket, Search, Database, CheckCircle, Clock, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

export default function DominusDashboardPage() {
    const { data: dashboard, isLoading, error } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: () => dashboardService.getSummary(),
        refetchInterval: 30000, // Refresh every 30s
    });

    if (isLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Rocket className="h-12 w-12 text-primary animate-bounce" />
                        <p className="text-muted-foreground animate-pulse">Carregando seus dados...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-destructive">
                        <AlertCircle className="h-12 w-12" />
                        <p>Erro ao carregar o dashboard. Tente novamente mais tarde.</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    const { stats, evolution, recentActivities } = dashboard!;

    return (
        <AppShell>
            <div className="space-y-6 pb-10">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
                    <p className="text-muted-foreground italic">
                        Bem-vindo de volta, Especialista em Leads. Seus robôs estão trabalhando.
                    </p>
                </div>

                {/* Top Grid: Credits & Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden bg-primary/5 border-primary/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Créditos Ativos
                            </CardTitle>
                            <Database className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.creditsBalance.toLocaleString('pt-BR')}</div>
                            <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-[10px] text-primary hover:bg-primary/10">
                                Recarregar
                            </Button>
                        </CardContent>
                        <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
                            <Database className="h-20 w-20" />
                        </div>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Total de Leads
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalLeads}</div>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1 font-bold">
                                <TrendingUp className="h-3 w-3" />
                                +{stats.leadsThisMonth} este mês
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Buscas Realizadas
                            </CardTitle>
                            <Search className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeSearches}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tight">
                                Consultas ao Big Data
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Taxa de Conversão
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tight">
                                Média de fechamentos
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Activity */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Evolution Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Evolução de Leads (Semanal)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] pl-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={evolution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis
                                        dataKey="period"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', fontSize: '12px' }}
                                        itemStyle={{ color: 'hsl(var(--primary))' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        name="Leads"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-semibold">Atividade Recente</CardTitle>
                            <Link href="/automation/logs">
                                <Button variant="ghost" size="sm" className="h-7 text-[10px]">Ver tudo</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3 border-b border-muted/50 pb-3 last:border-0 last:pb-0">
                                        <div className={cn(
                                            "mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                            activity.color ? `bg-${activity.color}/10 border-${activity.color}/20 text-${activity.color}` : "bg-primary/10 border-primary/20 text-primary"
                                        )}>
                                            <Rocket className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold leading-tight line-clamp-1">{activity.title}</p>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1">{activity.description}</p>
                                            <p className="text-[9px] text-muted-foreground/60 flex items-center gap-1 mt-1">
                                                <Clock className="h-2 w-2" />
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 space-y-2">
                                    <Database className="h-8 w-8 text-muted/30 mx-auto" />
                                    <p className="text-xs text-muted-foreground italic">Nenhuma atividade recente encontrada.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Actions */}
                <Card className="p-4 bg-muted/20 border-none">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="space-y-1 text-center sm:text-left">
                            <h4 className="text-sm font-bold">Inicie uma nova prospecção rápida</h4>
                            <p className="text-[11px] text-muted-foreground italic">Encontre novos clientes ideais em segundos.</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Link href="/search" className="flex-1 sm:flex-none">
                                <Button variant="outline" size="sm" className="w-full text-xs">Busca Filtrada</Button>
                            </Link>
                            <Button size="sm" className="flex-1 sm:flex-none gap-2 text-xs">
                                <Rocket className="h-3 w-3" />
                                Extrair Leads
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
