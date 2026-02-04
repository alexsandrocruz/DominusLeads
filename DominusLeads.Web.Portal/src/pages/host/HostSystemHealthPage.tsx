import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    Activity,
    Cpu,
    Globe,
    AlertCircle,
    RefreshCw,
    Server,
    Zap,
    MessageSquare,
    Database,
    Clock,
    CheckCircle2,
    Play
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HostSystemHealthPage() {
    const monitors = [
        { name: "WHATSAPP API", latency: "140 ms", uptime: "99.9%", status: "Healthy" },
        { name: "SMS GATEWAY", latency: "85 ms", uptime: "100%", status: "Healthy" },
        { name: "N8N INSTANCE", latency: "210 ms", uptime: "98.5%", status: "Warning" },
        { name: "POSTGRESQL", latency: "12 ms", uptime: "100%", status: "Healthy" }
    ];

    const incidents = [
        { title: "Instabilidade n8n Cluster B", time: "Hoje às 09:15 • 12 min de duração", status: "RESOLVIDO", color: "text-emerald-500 bg-emerald-500/10" },
        { title: "Manutenção PostgreSQL", time: "Ontem às 23:00 • Backup agendado", status: "CONCLUÍDO", color: "text-slate-500 bg-slate-500/10" }
    ];

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Activity className="size-5" />
                        </Button>
                        <h1 className="text-xl font-black tracking-tight uppercase">Status do Sistema</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl border-muted">
                        <RefreshCw className="size-4" />
                    </Button>
                </div>

                {/* Critical Alert Banner */}
                <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                            <AlertCircle className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight leading-none mb-1">Serviços instáveis detectados</h3>
                            <p className="text-xs font-bold text-rose-500 italic">A latência da API de IA e WhatsApp está acima do limite de 500ms.</p>
                        </div>
                    </div>
                    <Button className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20">
                        Ver logs de erro
                    </Button>
                </div>

                {/* Monitor Sections */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1 italic">Monitor de Saúde</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {monitors.map((m) => (
                            <Card key={m.name} className="border-muted shadow-sm rounded-[2rem] bg-white dark:bg-[#1c2638] overflow-hidden p-6 space-y-4 group hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.name}</h4>
                                    <div className={cn("size-2 rounded-full", m.status === 'Healthy' ? "bg-emerald-500" : "bg-amber-500")} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-end gap-2">
                                        <p className="text-2xl font-black italic">{m.latency.split(' ')[0]}</p>
                                        <p className="text-xs font-bold text-muted-foreground mb-1 italic">ms</p>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-muted-foreground italic uppercase">Uptime</span>
                                        <span className={m.status === 'Healthy' ? "text-emerald-500" : "text-amber-500"}>{m.uptime}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* IA Engine Major Card */}
                    <Card className="border-muted shadow-sm rounded-[2rem] bg-white dark:bg-[#1c2638] overflow-hidden p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">IA ENGINE (OPENAI & ANTHROPIC)</h4>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-rose-500 text-white border-none text-[8px] font-black italic tracking-widest px-2 pb-0.5">CRITICAL LATENCY</Badge>
                                </div>
                            </div>
                            <div className="size-2 rounded-full bg-rose-500" />
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <div className="flex items-end gap-2 text-rose-500">
                                    <p className="text-4xl font-black italic leading-none">4.2</p>
                                    <p className="text-lg font-black italic mb-1 uppercase">s</p>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground italic uppercase">Tempo médio de resposta (30min)</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest italic">SLA Diário</p>
                                <p className="text-sm font-black text-rose-500 italic leading-none">95.2%</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Incidents Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic font-black">Incidentes Recentes</h3>
                        <Button variant="link" className="text-[10px] font-black uppercase text-primary tracking-widest p-0 italic">Ver histórico completo</Button>
                    </div>

                    {incidents.map((i, idx) => (
                        <Card key={idx} className="bg-slate-50 border-none rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                    <Server className="size-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black tracking-tight">{i.title}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-tighter">{i.time}</p>
                                </div>
                            </div>
                            <Badge className={cn("border-none text-[8px] font-black h-6 px-3", i.color)}>{i.status}</Badge>
                        </Card>
                    ))}
                </div>

                {/* Floating Action Button - Simulation */}
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-sm px-8 z-50">
                    <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 gap-3 group">
                        <Activity className="size-5 group-hover:animate-pulse" />
                        Simular Teste de Ponta a Ponta
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}

