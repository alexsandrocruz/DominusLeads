import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import {
    ArrowLeft,
    MessageSquare,
    Mail,
    Plus,
    Save,
    Play,
    Zap,
    CheckCircle2,
    LayoutTemplate,
    Variable,
    Info,
    Smartphone
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Custom icon for SMS since lucide doesn't have an 'Sms' named icon
const MobileSms = Smartphone;

export default function CampaignConfigPage() {
    const [, setLocation] = useLocation();
    const [selectedChannel, setSelectedChannel] = useState("WhatsApp");
    const [template, setTemplate] = useState("Olá {nome_contato}, vi que a {nome_empresa} atua no setor de {cnae} e gostaria de apresentar uma solução personalizada para vocês. Podemos conversar?");

    const insertVariable = (variable: string) => {
        setTemplate(prev => prev + ` {${variable}}`);
    };

    return (
        <AppShell>
            <div className="max-w-xl mx-auto space-y-8 pb-32 relative min-h-[calc(100vh-100px)]">
                {/* Header Navigation */}
                <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-2 z-50">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/automation")} className="gap-2 -ml-2">
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h1 className="text-lg font-black tracking-tight text-center flex-1">Configuração de Campanhas</h1>
                    <div className="w-8" />
                </div>

                {/* Campaign Name Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <LayoutTemplate className="size-5 text-primary" />
                        <h3 className="text-base font-black">Nome da Campanha</h3>
                    </div>
                    <Input
                        className="h-14 bg-muted/30 border-muted font-bold focus:ring-primary rounded-xl"
                        placeholder="Ex: Prospecção Outbound - Q3"
                        defaultValue="Campanha de Leads Qualificados"
                    />
                </div>

                {/* Channel Selection */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Seleção de Canal</h3>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-muted/30 rounded-2xl border border-muted">
                        {[
                            { id: "WhatsApp", icon: MessageSquare },
                            { id: "SMS", icon: MobileSms },
                            { id: "E-mail", icon: Mail }
                        ].map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel.id)}
                                className={cn(
                                    "flex items-center justify-center gap-2 h-12 rounded-xl transition-all font-bold text-sm",
                                    selectedChannel === channel.id
                                        ? "bg-background text-primary shadow-sm ring-1 ring-primary/10"
                                        : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                <channel.icon className="size-4" />
                                {channel.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Template Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Editor de Template</h3>
                        <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5 uppercase">Dicas de IA ativas</Badge>
                    </div>

                    <Card className="overflow-hidden border-muted shadow-lg shadow-slate-200/50 rounded-2xl focus-within:ring-2 ring-primary/20 transition-all">
                        <div className="flex items-center gap-2 p-2 border-b border-muted bg-muted/30 overflow-x-auto no-scrollbar">
                            {[
                                { label: "nome_contato", value: "nome_contato" },
                                { label: "nome_empresa", value: "nome_empresa" },
                                { label: "cnae", value: "cnae" }
                            ].map((tag) => (
                                <Button
                                    key={tag.value}
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 shrink-0 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-[10px] rounded-full border border-primary/10"
                                    onClick={() => insertVariable(tag.value)}
                                >
                                    <Plus className="size-3" />
                                    {`{${tag.label}}`}
                                </Button>
                            ))}
                        </div>
                        <Textarea
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="min-h-[160px] border-none focus-visible:ring-0 bg-transparent font-medium text-sm leading-relaxed p-4 h-auto"
                            placeholder="Escreva sua mensagem inicial aqui..."
                        />
                    </Card>
                    <div className="flex items-center gap-2 px-1">
                        <Info className="size-3 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground font-medium">As variáveis dinâmicas serão substituídas automaticamente pelo robô no momento do envio.</p>
                    </div>
                </div>

                {/* Automation Summary Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Fluxo de Automação Associado</h3>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20">
                                <Zap className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Gatilho (Start)</span>
                                <p className="text-sm font-bold leading-tight">Se o prospect responder à mensagem do template acima</p>
                            </div>
                        </div>

                        <div className="ml-5 h-8 border-l-2 border-dashed border-primary/20" />

                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ação Automática</span>
                                <p className="text-sm font-bold leading-tight">Marcar como Lead Qualificado no CRM e notificar equipe</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-50">
                    <div className="max-w-xl mx-auto grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-14 rounded-2xl font-black gap-2 hover:bg-muted/50">
                            Salvar Template
                        </Button>
                        <Button className="h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 brightness-110 active:scale-[0.98] transition-all">
                            <Play className="size-4 fill-current" />
                            Ativar Campanha
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
