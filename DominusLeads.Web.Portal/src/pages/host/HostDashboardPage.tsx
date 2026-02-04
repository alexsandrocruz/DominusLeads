import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Rocket,
    ShieldCheck,
    ArrowUpRight,
    BarChart3,
    Activity,
    Landmark,
    Users2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HostDashboardPage() {
    const kpis = [
        { label: "MRR Global", value: "R$ 148.250", change: "+5.2%", trending: "up", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "ARR Global", value: "R$ 1.8M", change: "+8.1%", trending: "up", icon: Landmark, color: "text-indigo-500", bg: "bg-indigo-50" },
        { label: "Churn Rate", value: "2.4%", change: "-0.5%", trending: "down", icon: Users2, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Crescimento", value: "+15.8%", change: "+2.3%", trending: "up", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    const topTenants = [
        { name: "Alpha Solutions", plan: "Enterprise", mrr: "R$ 12.400", share: "8.4%", color: "bg-blue-500" },
        { name: "Beta Tech", plan: "Growth", mrr: "R$ 9.850", share: "6.6%", color: "bg-indigo-500" },
        { name: "Delta Marketing", plan: "Enterprise", mrr: "R$ 8.200", share: "5.5%", color: "bg-purple-500" },
        { name: "Nexus Core", plan: "Pro", mrr: "R$ 7.150", share: "4.8%", color: "bg-emerald-500" },
        { name: "Zenith IT", plan: "Growth", mrr: "R$ 6.900", share: "4.6%", color: "bg-orange-500" },
    ];

    return (
        <AppShell>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <ShieldCheck className="size-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Dashboard Executivo</h1>
                            <p className="text-muted-foreground font-medium italic">Visão consolidada da saúde financeira e crescimento da plataforma.</p>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid sm:grid-cols-4 gap-6">
                    {kpis.map((kpi, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all bg-white">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                                        <kpi.icon className="size-5" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
                                        kpi.trending === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        {kpi.trending === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {kpi.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{kpi.label}</p>
                                    <h3 className="text-2xl font-black tracking-tight">{kpi.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <Card className="lg:col-span-2 border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-muted">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <BarChart3 className="size-5 text-primary" />
                                        Crescimento de Base
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium italic">Novas assinaturas vs Churn Rate nos últimos 12 meses.</CardDescription>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black">NOVOS</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-black uppercase">Churn</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 h-[300px] flex items-end justify-between gap-2">
                            {/* Mock Bar Chart */}
                            {[40, 65, 45, 80, 55, 90, 70, 85, 95, 75, 88, 100].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <div className="w-full relative h-[80%] flex items-end">
                                        <div
                                            className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all cursor-pointer relative"
                                            style={{ height: `${val}%` }}
                                        >
                                            <div className="absolute inset-0 bg-primary opacity-50 rounded-t-lg h-[40%] mt-auto" style={{ height: `${val * 0.1}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-muted-foreground">M{i + 1}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Top Tenants Card */}
                    <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Top Tenants</CardTitle>
                            <CardDescription className="text-xs font-medium italic">Líderes em faturamento e escala na plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-muted">
                                {topTenants.map((tenant, idx) => (
                                    <div key={idx} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className={cn("size-10 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg", tenant.color)}>
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-sm tracking-tight">{tenant.name}</h4>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-muted-foreground border-none p-0">{tenant.plan}</Badge>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <p className="text-sm font-black">{tenant.mrr}</p>
                                            <p className="text-[10px] font-bold text-emerald-600">{tenant.share} share</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-muted/20 text-center">
                                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary gap-2">
                                    Ver Todos os Clientes
                                    <ArrowUpRight className="size-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Efficiency Funnel Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { label: "Trials Ativos", value: "450", desc: "Monitorando novas contas", icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: "Taxa de Ativação", value: "18.5%", desc: "Conversão Trial -> Pago", icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
                        { label: "LTV Médio", value: "R$ 2.450", desc: "Lifetime Value por Tenant", icon: Landmark, color: "text-purple-500", bg: "bg-purple-50" }
                    ].map((item, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-3xl overflow-hidden bg-white group hover:border-primary/20 transition-all">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                    <item.icon className="size-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-black tracking-tight">{item.value}</h4>
                                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 rounded">+12%</span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">{item.label}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground italic mt-1">{item.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
