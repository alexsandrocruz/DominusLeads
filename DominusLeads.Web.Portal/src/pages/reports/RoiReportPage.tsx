import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    DollarSign,
    Users,
    Target,
    Download,
    Filter,
    ArrowUpRight,
    Building,
    Calendar,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoiReportPage() {
    return (
        <AppShell>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Relatório de ROI e Performance</h1>
                        <p className="text-muted-foreground font-medium italic">Análise estratégica de conversão, custos e retorno sobre a prospecção IA.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl font-bold gap-2">
                            <Calendar className="size-4" />
                            Últimos 30 dias
                            <ChevronDown className="size-4" />
                        </Button>
                        <Button className="rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                            <Download className="size-4" />
                            Exportar PDF
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid sm:grid-cols-4 gap-6">
                    {[
                        { label: "Investimento Total", value: "R$ 2.450,00", desc: "Créditos e API", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Leads Qualificados", value: "184", desc: "Match com IA", icon: Target, color: "text-purple-500", bg: "bg-purple-50" },
                        { label: "Custo por Lead (CPL)", value: "R$ 13,31", desc: "Média do período", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Economia Gerada", value: "R$ 4.200,00", desc: "vs. Humano (SDR)", icon: Building, color: "text-orange-500", bg: "bg-orange-50" }
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-3">
                                <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground italic mt-0.5">{stat.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Charts Area */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-muted bg-muted/10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <BarChart3 className="size-5 text-primary" />
                                        Conversão por Segmento (CNAE)
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium italic">Distribuição de leads qualificados pelos robôs de prospecção.</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon"><Filter className="size-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                {[
                                    { label: "Tecnologia / SaaS", leads: 85, color: "bg-primary" },
                                    { label: "Indústria Metalúrgica", leads: 42, color: "bg-indigo-500" },
                                    { label: "Serviços Jurídicos", leads: 31, color: "bg-purple-500" },
                                    { label: "Imobiliário", leads: 26, color: "bg-emerald-500" }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-black">
                                            <span className="uppercase tracking-wider">{item.label}</span>
                                            <span className="text-primary">{item.leads} leads</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                                                style={{ width: `${(item.leads / 85) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-gradient-to-b from-primary/5 to-transparent">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <PieChart className="size-5 text-primary" />
                                Funil de Eficiência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="size-48 rounded-full border-[16px] border-primary flex flex-col items-center justify-center bg-white shadow-2xl">
                                    <p className="text-4xl font-black italic text-primary leading-none">7.6%</p>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">Taxa de Conversão</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/60 border border-muted rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                            <Users className="size-4" />
                                        </div>
                                        <span className="text-xs font-bold">Total Tentativas</span>
                                    </div>
                                    <span className="text-sm font-black">2.420</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/60 border border-muted rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                            <TrendingUp className="size-4" />
                                        </div>
                                        <span className="text-xs font-bold">Respostas Válidas</span>
                                    </div>
                                    <span className="text-sm font-black">642</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
