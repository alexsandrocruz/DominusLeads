import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Target,
    Zap,
    Search,
    Globe,
    ArrowUpRight,
    Plus,
    Building2,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HostStatsPage() {
    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-8 pb-32">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Insights <span className="text-primary italic">Globais</span></h1>
                        <p className="text-muted-foreground font-medium italic">Análise agregada de performance e comportamento de todos os robôs da rede.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Global Funnel */}
                    <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Target className="size-5 text-primary" />
                                Funil de Rede
                            </CardTitle>
                            <CardDescription className="text-xs font-medium italic">Eficiência de prospecção em toda a base Dominus.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {[
                                { label: "Leads Encontrados", value: "1.2M", percent: 100, color: "bg-slate-200" },
                                { label: "Contatos Iniciados", value: "450K", percent: 37, color: "bg-primary/20" },
                                { label: "Respostas Recebidas", value: "82K", percent: 18, color: "bg-primary/50" },
                                { label: "Leads Qualificados", value: "15K", percent: 3.3, color: "bg-primary" },
                            ].map((step) => (
                                <div key={step.label} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{step.label}</span>
                                        <span className="text-sm font-black">{step.value} <span className="text-[10px] text-muted-foreground font-normal italic">({step.percent}%)</span></span>
                                    </div>
                                    <div className="h-4 w-full bg-muted/20 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", step.color)} style={{ width: `${step.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Channel Distribution */}
                    <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <PieChart className="size-5 text-primary" />
                                Share de Canais
                            </CardTitle>
                            <CardDescription className="text-xs font-medium italic">Distribuição de disparos por plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
                            {/* Simple Pie Mockup */}
                            <div className="size-48 rounded-full border-[1.5rem] border-primary flex items-center justify-center relative shadow-2xl shadow-primary/20">
                                <div className="absolute inset-0 border-[1.5rem] border-emerald-500 rounded-full clip-path-polygon-[50%_0,100%_0,100%_50%,50%_50%]" />
                                <div className="text-center">
                                    <p className="text-2xl font-black italic">65%</p>
                                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp</p>
                                </div>
                            </div>
                        </CardContent>
                        <div className="px-8 pb-8 flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> <span className="text-[9px] font-black uppercase">WhatsApp (65%)</span></div>
                            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500" /> <span className="text-[9px] font-black uppercase">E-mail (25%)</span></div>
                            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-slate-300" /> <span className="text-[9px] font-black uppercase">SMS (10%)</span></div>
                        </div>
                    </Card>
                </div>

                {/* Popular Segments (CNAEs) */}
                <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden italic">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black">Setores em Alta (Hot CNAEs)</CardTitle>
                        <CardDescription className="text-xs font-medium">Os 5 segmentos com maior taxa de conversão na plataforma hoje.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                            {[
                                { name: "Software / SaaS", rate: "12.4%", trend: "+1.2%" },
                                { name: "Logística", rate: "9.8%", trend: "+0.5%" },
                                { name: "Energia Solar", rate: "8.2%", trend: "+4.1%" },
                                { name: "Contabilidade", rate: "7.5%", trend: "-0.2%" },
                                { name: "Indústria Têxtil", rate: "6.9%", trend: "+0.8%" }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2 p-4 rounded-2xl bg-muted/20 border border-muted/50 hover:border-primary/20 transition-all text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter leading-tight h-8 flex items-center justify-center">{item.name}</p>
                                    <div className="pt-2">
                                        <p className="text-lg font-black tracking-tight">{item.rate}</p>
                                        <p className={cn("text-[9px] font-bold italic", item.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                                            {item.trend} WoW
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}


