import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import {
    MessageSquare,
    Phone,
    Calendar,
    Copy,
    MapPin,
    Mail,
    ArrowLeft,
    MoreVertical,
    CheckCircle2,
    Send,
    Bot,
    UserPlus,
    History,
    Loader2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getLead, type LeadDto } from "@/lib/services/LeadService";
import { getLeadEvents, type EventDto } from "@/lib/services/EventService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getEventIcon = (tipo: number) => {
    switch (tipo) {
        case 0: return UserPlus;
        case 1: return MessageSquare;
        case 2: return MessageSquare; // WhatsApp
        case 3: return Phone;
        case 4: return Mail;
        case 5: return Bot;
        default: return History;
    }
};

const getEventStyles = (tipo: number) => {
    switch (tipo) {
        case 0: return { color: "text-slate-500", bgColor: "bg-slate-100" };
        case 2: return { color: "text-emerald-500", bgColor: "bg-emerald-100" };
        case 5: return { color: "text-purple-500", bgColor: "bg-purple-100" };
        case 3: return { color: "text-primary", bgColor: "bg-primary/10" };
        default: return { color: "text-slate-500", bgColor: "bg-slate-100" };
    }
};

const getStatusLabel = (status: number) => {
    switch (status) {
        case 1: return "Novo";
        case 2: return "Contatado";
        case 3: return "Qualificado";
        case 4: return "Proposta";
        case 5: return "Fechado";
        case 6: return "Descartado";
        default: return "Novo";
    }
};

export default function LeadDetailPage({ id }: { id: string }) {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState<LeadDto | null>(null);
    const [events, setEvents] = useState<EventDto[]>([]);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (id: string) => {
        setLoading(true);
        try {
            const [leadRes, eventsRes] = await Promise.all([
                getLead(id),
                getLeadEvents(id)
            ]);
            setLead(leadRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            console.error("Erro ao buscar dados do lead:", err);
        } finally {
            setLoading(false);
        }
    };

    // Mock data based on prototype
    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="size-8 text-primary animate-spin" />
                </div>
            </AppShell>
        );
    }

    if (!lead) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-muted-foreground font-medium">Lead não encontrado.</p>
                    <Button onClick={() => setLocation("/leads")}>Voltar para lista</Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/leads")} className="gap-2 -ml-2">
                        <ArrowLeft className="size-4" />
                        Voltar para lista
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="size-5" />
                        </Button>
                    </div>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="size-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Bot className="size-12 text-primary" />
                    </div>
                    <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20 px-2 py-0 text-[10px] uppercase font-bold tracking-wider">
                                Lead {getStatusLabel(lead.status)}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{lead.razaoSocial}</h1>
                        <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            CNPJ: {lead.cnpj}
                            {lead.cnaePrincipal && (
                                <>
                                    <span className="text-muted-foreground/30">•</span>
                                    CNAE: {lead.cnaePrincipal}
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="flex-col h-auto py-4 gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 group transition-all">
                        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                            <MessageSquare className="size-5" />
                        </div>
                        <span className="text-xs font-bold">WhatsApp</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-4 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 group transition-all">
                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Phone className="size-5" />
                        </div>
                        <span className="text-xs font-bold">Ligar</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-4 gap-2 hover:border-slate-300 transition-all">
                        <div className="p-2 rounded-full bg-slate-100 text-slate-600">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <span className="text-xs font-bold">Status</span>
                    </Button>
                </div>

                {/* Contact Info Card */}
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="pb-3 border-b border-muted/50">
                        <CardTitle className="text-base font-black">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">E-mail Corporativo</p>
                                    <p className="text-sm font-bold">{lead.email || "Não informado"}</p>
                                </div>
                            </div>
                            {lead.email && (
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-white">
                                    <Copy className="size-4" />
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <Phone className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Celular (Decisor)</p>
                                    <p className="text-sm font-bold">{lead.telefone || "Não informado"}</p>
                                </div>
                            </div>
                            {lead.telefone && (
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
                                        <MessageSquare className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Endereço</p>
                                    <p className="text-sm font-bold">
                                        {lead.logradouro ? `${lead.logradouro}, ${lead.numero || "S/N"}` : "Não informado"}
                                    </p>
                                    {lead.bairro && <p className="text-xs text-muted-foreground">{lead.bairro} - {lead.cidade}/{lead.uf}</p>}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-white">
                                <MapPin className="size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="size-5 text-primary" />
                            <h3 className="text-base font-black">Linha do Tempo</h3>
                        </div>
                        <Button variant="link" className="text-xs font-bold text-primary px-0">Ver Tudo</Button>
                    </div>

                    <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                        {events.length > 0 ? events.map((event, idx) => {
                            const Icon = getEventIcon(event.tipo);
                            const styles = getEventStyles(event.tipo);
                            return (
                                <div key={event.id || idx} className="relative group">
                                    <div className={cn(
                                        "absolute -left-10 top-0 size-8 rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm",
                                        styles.bgColor,
                                        styles.color
                                    )}>
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold">{event.titulo}</p>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {format(new Date(event.timestamp), "dd/MM, HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-xl text-xs font-medium border border-muted/50 bg-muted/10"
                                        )}>
                                            {event.descricao}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-xs text-muted-foreground italic">Nenhum evento registrado ainda.</p>
                        )}
                    </div>
                </div>

                {/* Sticky Mobile Action */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t lg:hidden flex justify-center z-50">
                    <Button className="w-full max-w-sm gap-2 h-12 font-black shadow-lg shadow-primary/20">
                        <MessageSquare className="size-5" />
                        Abrir no WhatsApp
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
