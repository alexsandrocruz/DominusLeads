import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Play,
    Square,
    Plus,
    Search,
    Cpu,
    History,
    AlertCircle,
    MoreVertical,
    BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function DominusAutomationPage() {
    const [, setLocation] = useLocation();
    const automations = [
        {
            id: 1,
            name: "Prospecção Advogados SP",
            description: "Busca diária em diretórios jurídicos e OAB SP.",
            status: "Running",
            lastRun: "hoje às 09:30",
            leadsToday: 45,
            totalLeads: 1240
        },
        {
            id: 2,
            name: "Leads Imobiliárias RJ",
            description: "Extração de contatos de portais imobiliários no Rio.",
            status: "Paused",
            lastRun: "ontem às 18:15",
            leadsToday: 0,
            totalLeads: 856
        }
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Automações de Prospecção</h1>
                        <p className="text-muted-foreground font-medium italic">Seus robôs trabalhando 24/7 na extração de leads qualificados.</p>
                    </div>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20 h-11 px-6">
                        <Plus className="h-4 w-4" />
                        Nova Automação
                    </Button>
                </div>

                <div className="grid gap-6">
                    <div className="flex items-center gap-4 border-b border-primary/10 pb-2">
                        <button className="text-sm font-bold text-primary border-b-2 border-primary pb-2 px-2">Minhas Automações</button>
                        <button className="text-sm font-bold text-muted-foreground hover:text-foreground pb-2 px-2 flex items-center gap-2">
                            Logs de Execução
                            <Badge variant="outline" className="text-[10px] h-4 px-1">2</Badge>
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {automations.map((bot) => (
                            <Card
                                key={bot.id}
                                className="hover:border-primary/50 transition-colors overflow-hidden group cursor-pointer"
                                onClick={() => setLocation("/automation/flow")}
                            >
                                <CardHeader className="flex flex-row items-start justify-between pb-2 bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-lg flex items-center justify-center",
                                            bot.status === 'Running' ? "bg-emerald-100 text-emerald-600 animate-pulse" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <Cpu className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold">{bot.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{bot.description}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Leads Hoje</p>
                                            <p className="text-xl font-black text-primary">{bot.leadsToday}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Extraído</p>
                                            <p className="text-xl font-black">{bot.totalLeads}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-muted">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                                            <History className="h-3 w-3" />
                                            Última execução: {bot.lastRun}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {bot.status === 'Running' ? (
                                                <Button variant="secondary" size="sm" className="h-8 gap-1 font-bold text-xs">
                                                    <Square className="h-3 w-3 fill-current" />
                                                    Pausar
                                                </Button>
                                            ) : (
                                                <Button size="sm" className="h-8 gap-1 font-bold text-xs">
                                                    <Play className="h-3 w-3 fill-current" />
                                                    Ativar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <button className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="font-bold">Criar Nova Automação</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
