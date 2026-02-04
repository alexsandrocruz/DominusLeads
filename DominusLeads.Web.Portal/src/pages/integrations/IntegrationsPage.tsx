import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import {
    Plus,
    Copy,
    Trash2,
    Activity,
    Zap,
    Webhook,
    CloudSync,
    CheckCircle2,
    Play
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
    const [activeWebhooks] = useState([
        { id: 1, name: "Enviar para n8n", url: "https://n8n.dominus.leads/webhook/123-abc-456", event: "Lead Qualificado", active: true, icon: Webhook },
        { id: 2, name: "Backup Pipedrive", url: "https://pipedrive.com/api/v1/leads/sync", event: "Novo Lead", active: false, icon: CloudSync }
    ]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground italic">Integrações <span className="text-primary">&</span> Webhooks</h1>
                        <p className="text-muted-foreground font-medium italic">Conecte a plataforma ao seu ecossistema (n8n, Pipedrive, Salesforce).</p>
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-primary/5">
                    <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                        <Zap className="size-8" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-xl font-black tracking-tight text-foreground">Potencialize seu Fluxo</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                            Envie dados validados pelos robôs diretamente para o seu CRM ou ferramenta de automação preferida em tempo real.
                        </p>
                    </div>
                    <Button className="md:ml-auto h-12 px-8 rounded-xl font-black gap-2 shadow-xl shadow-primary/20 shrink-0">
                        <Plus className="size-4" />
                        Novo Webhook
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Webhooks de Saída</h3>
                            <Badge variant="outline" className="text-[10px] font-black italic text-primary border-primary/20 uppercase">SaaS Pro</Badge>
                        </div>

                        <div className="space-y-4">
                            {activeWebhooks.map((webhook) => (
                                <Card key={webhook.id} className="border-muted dark:border-primary/10 hover:border-primary/30 transition-all rounded-[2.5rem] overflow-hidden group bg-card shadow-sm">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col sm:flex-row gap-8">
                                            <div className={cn(
                                                "size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform",
                                                webhook.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground opacity-50"
                                            )}>
                                                <webhook.icon className="size-6" />
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-lg tracking-tight text-foreground italic uppercase leading-none">{webhook.name}</h4>
                                                        <Badge variant="secondary" className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-2 h-4 italic">
                                                            {webhook.event}
                                                        </Badge>
                                                    </div>
                                                    <Switch checked={webhook.active} className="data-[state=checked]:bg-primary" />
                                                </div>

                                                <div className="flex items-center gap-2 bg-muted/50 dark:bg-slate-900 p-3 rounded-2xl border border-muted dark:border-primary/5 group-hover:bg-background transition-all">
                                                    <code className="text-[10px] font-mono text-muted-foreground truncate flex-1 italic">{webhook.url}</code>
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => copyToClipboard(webhook.url)}>
                                                        <Copy className="size-3 text-primary" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 italic uppercase tracking-tighter">
                                                            <Activity className="size-3" />
                                                            Último: 12 min
                                                        </span>
                                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1 italic uppercase tracking-tighter">
                                                            <CheckCircle2 className="size-3" />
                                                            200 OK
                                                        </span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Quick Config Section */}
                    <div className="space-y-6">
                        <div className="px-1">
                            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Configuração Expressa</h3>
                        </div>
                        <Card className="border-muted dark:border-primary/10 shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card overflow-hidden sticky top-24">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-black italic uppercase tracking-tight">Adicionar Hook</CardTitle>
                                <CardDescription className="text-xs font-medium italic">Endpoint de destino para os leads.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest px-1 italic">URL do Endpoint</label>
                                    <Input placeholder="https://..." className="h-12 bg-muted/30 dark:bg-slate-900 border-muted dark:border-primary/5 rounded-xl font-mono text-xs shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest px-1 italic">Evento Gatilho</label>
                                    <select className="w-full h-12 bg-muted/30 dark:bg-slate-900 border border-muted dark:border-primary/5 rounded-xl font-black text-xs px-4 outline-none focus:ring-2 ring-primary/20 appearance-none shadow-inner text-foreground italic uppercase">
                                        <option>Lead Qualificado</option>
                                        <option>Lead Enriquecido</option>
                                        <option>Novo Lead</option>
                                    </select>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 text-sm italic">
                                        <Play className="size-4 fill-current" />
                                        SALVAR CONEXÃO
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
