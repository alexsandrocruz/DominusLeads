import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Textarea } from "@/components/ui/Textarea";
import {
    MessageSquare,
    Phone,
    Copy,
    MapPin,
    Mail,
    ArrowLeft,
    MoreVertical,
    CheckCircle2,
    Send,
    Bot,
    History,
    Loader2,
    RefreshCw,
    FileText,
    StickyNote
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getLead, addLeadNote, type LeadDto } from "@/lib/services/LeadService";
import { getLeadEvents, type EventDto } from "@/lib/services/EventService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// EventType: WhatsApp=1, Ligacao=2, Email=3, Automacao=4, MudancaStatus=5, Nota=6
const getEventIcon = (tipo: number) => {
    switch (tipo) {
        case 1: return MessageSquare; // WhatsApp
        case 2: return Phone;         // Ligação
        case 3: return Mail;          // Email
        case 4: return Bot;           // Automação
        case 5: return RefreshCw;     // Mudança de Status
        case 6: return StickyNote;    // Nota
        default: return History;
    }
};

const getEventStyles = (tipo: number) => {
    switch (tipo) {
        case 1: return { color: "text-emerald-500", bgColor: "bg-emerald-100" };   // WhatsApp
        case 2: return { color: "text-primary", bgColor: "bg-primary/10" };         // Ligação
        case 3: return { color: "text-blue-500", bgColor: "bg-blue-100" };          // Email
        case 4: return { color: "text-purple-500", bgColor: "bg-purple-100" };      // Automação
        case 5: return { color: "text-sky-500", bgColor: "bg-sky-100" };            // Mudança de Status
        case 6: return { color: "text-amber-500", bgColor: "bg-amber-100" };        // Nota
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
    const [noteText, setNoteText] = useState("");
    const [submittingNote, setSubmittingNote] = useState(false);

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

    const handleAddNote = async () => {
        if (!noteText.trim() || !id) return;
        setSubmittingNote(true);
        try {
            await addLeadNote(id, noteText.trim());
            setNoteText("");
            toast.success("Nota adicionada com sucesso!");
            // Refresh events to show new note
            const eventsRes = await getLeadEvents(id);
            setEvents(eventsRes.data);
        } catch (err) {
            console.error("Erro ao adicionar nota:", err);
            toast.error("Erro ao adicionar nota.");
        } finally {
            setSubmittingNote(false);
        }
    };

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

                {/* Add Note Section */}
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="pb-3 border-b border-muted/50">
                        <CardTitle className="text-base font-black flex items-center gap-2">
                            <FileText className="size-5 text-primary" />
                            Adicionar Nota
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        <Textarea
                            placeholder="Escreva uma observação, registro de contato, ou anotação sobre este lead..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="min-h-[80px] resize-none border-muted focus-visible:ring-primary/20"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    handleAddNote();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-muted-foreground font-medium">⌘+Enter para enviar</p>
                            <Button
                                size="sm"
                                className="gap-2 font-bold shadow-lg shadow-primary/20"
                                onClick={handleAddNote}
                                disabled={!noteText.trim() || submittingNote}
                            >
                                {submittingNote ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Salvar Nota
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
                        <Badge variant="secondary" className="text-[10px] font-bold">
                            {events.length} evento{events.length !== 1 ? "s" : ""}
                        </Badge>
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
                            <div className="py-8 text-center">
                                <History className="size-8 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground italic">Nenhum evento registrado ainda.</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">Adicione uma nota acima para começar.</p>
                            </div>
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
