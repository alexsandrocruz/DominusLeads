import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    History
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
    const [, setLocation] = useLocation();

    // Mock data based on prototype
    const lead = {
        name: "Tecnologia Avançada Ltda",
        cnae: "6201-5/01",
        description: "Desenvolvimento de software sob encomenda",
        status: "Quente",
        email: "contato@tecavancada.com.br",
        phone: "(11) 98765-4321",
        address: "Av. Paulista, 1000 - Bela Vista",
        city: "São Paulo, SP",
        origin: "Prospecção Ativa (Linkedin)",
        events: [
            {
                type: "reply",
                title: "Resposta Recebida",
                description: '"Olá, vi a apresentação e gostei. Podemos marcar uma call amanhã às 10h?"',
                time: "Hoje, 14:20",
                icon: MessageSquare,
                color: "text-emerald-500",
                bgColor: "bg-emerald-100",
                isItalic: true
            },
            {
                type: "sent",
                title: "WhatsApp Enviado",
                description: 'Script: "Primeiro Contato - Abordagem Consultiva"',
                time: "Hoje, 09:15",
                icon: Send,
                color: "text-primary",
                bgColor: "bg-primary/10"
            },
            {
                type: "automation",
                title: "Validado pelo n8n",
                description: "Status: Perfil compatível com ICP verificado via automação.",
                time: "Ontem, 17:45",
                icon: Bot,
                color: "text-purple-500",
                bgColor: "bg-purple-100"
            },
            {
                type: "created",
                title: "Lead Criado no CRM",
                description: "Origem: Prospecção Ativa (Linkedin)",
                time: "Ontem, 17:40",
                icon: UserPlus,
                color: "text-slate-500",
                bgColor: "bg-slate-100"
            }
        ]
    };

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
                                Lead {lead.status}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{lead.name}</h1>
                        <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            CNAE: {lead.cnae}
                            <span className="text-muted-foreground/30">•</span>
                            <span className="font-medium italic">{lead.description}</span>
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
                                    <p className="text-sm font-bold">{lead.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-white">
                                <Copy className="size-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <Phone className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Celular (Decisor)</p>
                                    <p className="text-sm font-bold">{lead.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
                                    <MessageSquare className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Endereço</p>
                                    <p className="text-sm font-bold">{lead.address}</p>
                                    <p className="text-xs font-medium text-muted-foreground">{lead.city}</p>
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
                        {lead.events.map((event, idx) => (
                            <div key={idx} className="relative group">
                                <div className={cn(
                                    "absolute -left-10 top-0 size-8 rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm",
                                    event.bgColor,
                                    event.color
                                )}>
                                    <event.icon className="size-4" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold">{event.title}</p>
                                        <span className="text-[10px] font-medium text-muted-foreground">{event.time}</span>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-xl text-xs font-medium border border-muted/50",
                                        event.isItalic ? "italic bg-emerald-50/30 border-emerald-100" : "bg-muted/10"
                                    )}>
                                        {event.description}
                                    </div>
                                </div>
                            </div>
                        ))}
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
