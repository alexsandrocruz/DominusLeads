import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    AlertTriangle,
    Calendar,
    ArrowLeft,
    ChevronRight,
    Search,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GlobalCostsPage() {
    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-6 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Gestão de Custos</h1>
                            <p className="text-xs text-muted-foreground font-medium">Dominus Leads Global</p>
                        </div>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl border-muted">
                        <Calendar className="size-4" />
                    </Button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="border-muted shadow-sm rounded-2xl bg-white dark:bg-[#1c2638] overflow-hidden">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex justify-between items-start">
                                <p className="text-muted-foreground text-sm font-medium">Custo Infra Total</p>
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <Activity className="size-4" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">R$ 42.500</h2>
                            <div className="flex items-center gap-1 text-emerald-500">
                                <TrendingUp className="size-3" />
                                <p className="text-xs font-bold">+5.2% vs mês ant.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-t-2 border-primary border-x-muted border-b-muted shadow-sm rounded-2xl bg-white dark:bg-[#1c2638] overflow-hidden">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex justify-between items-start">
                                <p className="text-muted-foreground text-sm font-medium">Margem Bruta</p>
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <TrendingUp className="size-4" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-primary">32.5%</h2>
                            <div className="flex items-center gap-1 text-rose-500">
                                <TrendingDown className="size-3" />
                                <p className="text-xs font-bold">-1.8% vs target</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Distribution Section */}
                <div className="space-y-3">
                    <h3 className="text-lg font-black tracking-tight px-1">Distribuição por Provedor</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {[
                            { name: "WhatsApp", amount: "18k", sub: "Meta: 70% | Twilio: 30%", color: "bg-primary" },
                            { name: "SMS", amount: "8.2k", sub: "Global Providers", color: "bg-emerald-500" },
                            { name: "VOIP", amount: "6.1k", sub: "Tarifa por Minuto", color: "bg-amber-500" },
                            { name: "OpenAI/IA", amount: "10.2k", sub: "GPT-4o & Embedding", color: "bg-purple-500" }
                        ].map((provider) => (
                            <Card key={provider.name} className="min-w-[200px] border-muted shadow-sm rounded-2xl bg-white dark:bg-[#1c2638] p-4 flex flex-col items-center text-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                                <div className="relative size-24 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-800" />
                                    <div className={cn("absolute inset-0 rounded-full border-8 border-t-transparent border-l-transparent -rotate-45", provider.color)} />
                                    <div className="flex flex-col items-center">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">{provider.name}</p>
                                        <p className="text-base font-black">R$ {provider.amount}</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">{provider.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">{provider.sub}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Volume Table Section */}
                <div className="space-y-3">
                    <h3 className="text-lg font-black tracking-tight px-1">Volume e Processamento</h3>
                    <Card className="border-muted shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-[#1c2638]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-muted">
                                    <tr>
                                        <th className="p-4 text-xs font-black text-muted-foreground uppercase tracking-wider italic">Serviço</th>
                                        <th className="p-4 text-xs font-black text-muted-foreground uppercase tracking-wider italic">Volume</th>
                                        <th className="p-4 text-xs font-black text-muted-foreground uppercase tracking-wider text-right italic">Custo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted">
                                    {[
                                        { service: "WhatsApp Business", volume: "1.240.500 msg", cost: "R$ 18.020", color: "bg-primary" },
                                        { service: "SMS Marketing", volume: "450.000 msg", cost: "R$ 8.190", color: "bg-emerald-500" },
                                        { service: "VOIP / Chamadas", volume: "12.500 min", cost: "R$ 6.090", color: "bg-amber-500" },
                                        { service: "OpenAI / Agentes", volume: "85M tokens", cost: "R$ 10.200", color: "bg-purple-500" }
                                    ].map((row) => (
                                        <tr key={row.service} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 flex items-center gap-2">
                                                <div className={cn("size-2 rounded-full", row.color)} />
                                                <span className="text-sm font-black tracking-tight">{row.service}</span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground font-medium italic">{row.volume}</td>
                                            <td className="p-4 text-sm font-black text-right">{row.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Gross Margin Monitor Widget */}
                <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <Activity className="size-5" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest italic">Monitor de Saúde Financeira</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest italic">
                                    <span className="text-muted-foreground">Receita Estimada (Créditos)</span>
                                    <span>R$ 130.800</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full" style={{ width: "100%" }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest italic">
                                    <span className="text-muted-foreground">Custo de APIs</span>
                                    <span>R$ 42.500</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full" style={{ width: "32.5%" }} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                            <span className="text-sm font-bold text-muted-foreground italic tracking-tight">ROI do Ecossistema</span>
                            <span className="text-2xl font-black text-primary italic">3.07x</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Alert Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-muted z-50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-2xl shadow-lg shadow-rose-200/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-black tracking-tight leading-none">Saldo Baixo em Provedores</p>
                                <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase italic tracking-widest">Twilio: R$ 450,00 restantes</p>
                            </div>
                        </div>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs h-10 px-6 rounded-xl shadow-lg shadow-rose-600/20">
                            RECARREGAR
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
