import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
    BrainCircuit,
    Activity,
    Search,
    Terminal,
    Cpu,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
    Zap,
    History,
    Network
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiLogsPage() {
    const logs = [
        {
            id: 1,
            time: "14:25:02",
            lead: "Tech Solutions",
            input: "Tenho interesse no produto, quanto custa?",
            output: "INTERESSE_IMEDIATO",
            confidence: 0.98,
            tokens: 145,
            status: "Success"
        },
        {
            id: 2,
            time: "14:21:45",
            lead: "Green Energy",
            input: "Não ligue mais para cá.",
            output: "DESCARTE",
            confidence: 0.99,
            tokens: 82,
            status: "Success"
        },
        {
            id: 3,
            time: "14:18:30",
            lead: "Global Log",
            input: "Quais os horários de suporte?",
            output: "CURIOSO",
            confidence: 0.85,
            tokens: 120,
            status: "Success"
        }
    ];

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Logs e Status da IA</h1>
                        <p className="text-muted-foreground font-medium italic">Monitore a transparência e saúde dos seus assistentes inteligentes em tempo real.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                            <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                            Sistemas Online
                        </Badge>
                    </div>
                </div>

                {/* System Health Overview */}
                <div className="grid sm:grid-cols-4 gap-4">
                    {[
                        { label: "IA Classification", status: "Online", icon: BrainCircuit, color: "text-primary" },
                        { label: "n8n Webhooks", status: "Online", icon: Network, color: "text-indigo-500" },
                        { label: "WhatsApp API", status: "Online", icon: Zap, color: "text-emerald-500" },
                        { label: "Latency", status: "1.2s", icon: Activity, color: "text-orange-500" }
                    ].map((sys, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-2xl group hover:border-primary/20 transition-all">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                <div className={cn("p-2 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors", sys.color)}>
                                    <sys.icon className="size-5" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{sys.label}</p>
                                <p className="text-sm font-black">{sys.status}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Logs Table Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <Terminal className="size-5 text-primary" />
                            Histórico de Processamento
                        </h3>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input placeholder="Filtrar por lead..." className="h-10 pl-9 bg-muted/30 border-muted rounded-xl text-xs font-bold" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {logs.map((log) => (
                            <Card key={log.id} className="border-muted hover:border-primary/20 transition-all rounded-2xl overflow-hidden group">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-12 items-center divide-x divide-muted">
                                        <div className="md:col-span-1 p-4 flex flex-col items-center justify-center bg-muted/10 group-hover:bg-primary/5 transition-colors">
                                            <Clock className="size-4 text-muted-foreground mb-1" />
                                            <span className="text-[10px] font-black">{log.time}</span>
                                        </div>

                                        <div className="md:col-span-4 p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary">Lead</Badge>
                                                <span className="text-xs font-black">{log.lead}</span>
                                            </div>
                                            <p className="text-sm font-medium italic text-muted-foreground line-clamp-1">"{log.input}"</p>
                                        </div>

                                        <div className="md:col-span-4 p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className="text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 border-none">Classificação IA</Badge>
                                                <Badge variant="outline" className="text-[9px] font-black border-emerald-500/20 text-emerald-600 p-0 px-1">{Math.round(log.confidence * 100)}% conf.</Badge>
                                            </div>
                                            <p className="text-sm font-black tracking-tight flex items-center gap-2">
                                                <Cpu className="size-3 text-primary" />
                                                {log.output}
                                            </p>
                                        </div>

                                        <div className="md:col-span-3 p-4 flex items-center justify-between bg-muted/10 group-hover:bg-primary/5 transition-colors">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tokens</span>
                                                <span className="text-xs font-black">{log.tokens}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="size-9 rounded-xl hover:bg-white hover:text-primary shadow-sm hover:shadow-md transition-all">
                                                    <Eye className="size-4" />
                                                </Button>
                                                <CheckCircle2 className="size-5 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button variant="outline" className="rounded-xl font-bold gap-2 text-xs h-10 px-6">
                            <History className="size-4" />
                            Carregar Mais Logs
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
