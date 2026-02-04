import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import {
    Clock,
    Calendar,
    Save,
    AlertTriangle,
    Info,
    Minus,
    Plus,
    Globe,
    Zap,
    History
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SchedulingPage() {
    const [rateLimit, setRateLimit] = useState(50);
    const [schedule, setSchedule] = useState([
        { day: "Segunda-feira", active: true, start: "09:00", end: "18:00" },
        { day: "Terça-feira", active: true, start: "09:00", end: "18:00" },
        { day: "Quarta-feira", active: true, start: "09:00", end: "18:00" },
        { day: "Quinta-feira", active: true, start: "09:00", end: "18:00" },
        { day: "Sexta-feira", active: true, start: "09:00", end: "18:00" },
        { day: "Sábado", active: false, start: "10:00", end: "14:00" },
        { day: "Domingo", active: false, start: "10:00", end: "14:00" },
    ]);

    const toggleDay = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].active = !newSchedule[index].active;
        setSchedule(newSchedule);
    };

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Janelas de Envio</h1>
                        <p className="text-muted-foreground font-medium italic">Determine os horários mágicos para seus robôs atuarem com máxima eficiência.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Planejamento Semanal</h3>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary h-7 gap-1">
                                <History className="size-3" />
                                Replicar Horários
                            </Button>
                        </div>

                        <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                            <CardContent className="p-0 divide-y divide-muted">
                                {schedule.map((item, idx) => (
                                    <div key={item.day} className={cn("p-6 transition-colors", !item.active && "bg-muted/10 opacity-60")}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "size-8 rounded-lg flex items-center justify-center transition-all",
                                                    item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 text-slate-400"
                                                )}>
                                                    <Calendar className="size-4" />
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{item.day}</span>
                                            </div>
                                            <Switch checked={item.active} onCheckedChange={() => toggleDay(idx)} className="data-[state=checked]:bg-primary" />
                                        </div>

                                        {item.active && (
                                            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex-1 space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest px-1">Início</label>
                                                    <div className="h-11 bg-muted/30 border border-muted rounded-xl flex items-center px-4 font-black text-sm">
                                                        {item.start}
                                                    </div>
                                                </div>
                                                <div className="flex items-center pt-6">
                                                    <div className="w-4 h-0.5 bg-muted rounded-full" />
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest px-1">Fim</label>
                                                    <div className="h-11 bg-muted/30 border border-muted rounded-xl flex items-center px-4 font-black text-sm">
                                                        {item.end}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="px-1">
                            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Controles de Cadência</h3>
                        </div>

                        <div className="space-y-4 sticky top-24">
                            <Card className="border-muted shadow-2xl shadow-slate-200/60 rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <Zap className="size-5 text-primary" />
                                        Rate Limit
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium italic">Limite de mensagens por hora para evitar bloqueios.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <Button variant="outline" size="icon" className="size-12 rounded-xl border-muted shrink-0" onClick={() => setRateLimit(Math.max(1, rateLimit - 5))}>
                                            <Minus className="size-5" />
                                        </Button>
                                        <div className="text-center">
                                            <p className="text-4xl font-black tracking-tighter text-primary">{rateLimit}</p>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Msg/Hora</p>
                                        </div>
                                        <Button variant="outline" size="icon" className="size-12 rounded-xl border-muted shrink-0" onClick={() => setRateLimit(Math.min(200, rateLimit + 5))}>
                                            <Plus className="size-5" />
                                        </Button>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <AlertTriangle className="size-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Importante</span>
                                        </div>
                                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed italic">
                                            Manter o limite abaixo de 60 mensagens por hora ajuda a manter a saúde da sua conta nas plataformas.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2.5rem] bg-primary text-white overflow-hidden p-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Globe className="size-6 opacity-50" />
                                    <Badge className="bg-white/20 text-white border-none text-[9px] font-black">ACTIVE</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-lg leading-tight tracking-tight text-white">Fuso Horário Inteligente</h4>
                                    <p className="text-[10px] font-bold opacity-80 leading-relaxed italic text-white">
                                        Seus robôs respeitam automaticamente a localização do Lead para não incomodar no meio da noite.
                                    </p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-white data-[state=checked]:[&>span]:bg-primary" />
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer CTA */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-50">
                    <div className="max-w-3xl mx-auto flex gap-4">
                        <Button className="flex-1 h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 brightness-110">
                            <Save className="size-4" />
                            Salvar Configurações
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
