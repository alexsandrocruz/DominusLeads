import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
    ArrowLeft,
    Play,
    Square,
    Plus,
    Bot,
    MessageSquare,
    HelpCircle,
    BrainCircuit,
    Rocket,
    Save,
    Settings2,
    ChevronDown,
    Zap,
    Phone
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/Select";

export default function AutomationFlowPage() {
    const [, setLocation] = useLocation();

    return (
        <AppShell>
            <div className="max-w-xl mx-auto space-y-6 pb-32 relative min-h-[calc(100vh-100px)]">
                {/* Header Navigation */}
                <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-2 z-50">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/automation")} className="gap-2 -ml-2">
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h1 className="text-lg font-black tracking-tight">Configuração de Fluxo</h1>
                    <Button variant="ghost" size="sm" className="text-primary font-bold">
                        Testar
                    </Button>
                </div>

                {/* Flow Title Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-primary/10">
                    <div className="bg-primary rounded-xl p-3 text-white shadow-lg shadow-primary/20">
                        <Zap className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-base">Dominus Leads: Prospecção B2B</h3>
                        <p className="text-xs text-muted-foreground font-medium">Ativo • Última edição há 2h</p>
                    </div>
                </div>

                {/* Flow Visualizer */}
                <div className="relative space-y-0">
                    {/* Step 1: Initial Trigger */}
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white z-10 shadow-lg shadow-primary/20 ring-4 ring-background">
                                <MessageSquare className="size-5" />
                            </div>
                            <div className="w-[2px] bg-primary grow min-h-[60px]" />
                        </div>
                        <div className="flex-1 pb-10">
                            <h4 className="font-black text-sm mb-2">1. Disparo Inicial WhatsApp</h4>
                            <Card className="bg-muted/30 border-muted group-hover:border-primary/20 transition-all overflow-hidden">
                                <CardContent className="p-3 flex gap-4">
                                    <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
                                        <div className="w-full h-full bg-slate-200 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <p className="text-xs italic text-muted-foreground line-clamp-2">"Olá! Vi que sua empresa no setor de construção está crescendo..."</p>
                                        <Badge variant="outline" className="w-fit text-[9px] font-bold text-primary border-primary/20 uppercase">Mídia: intro_v1.png</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Step 2: Conditional */}
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="w-[2px] bg-primary h-6" />
                            <div className="size-10 rounded-xl bg-background border-2 border-primary flex items-center justify-center text-primary z-10 rotate-45 shadow-sm">
                                <HelpCircle className="size-5 -rotate-45" />
                            </div>
                            <div className="w-[2px] bg-muted grow min-h-[40px]" />
                        </div>
                        <div className="flex-1 pb-10 pt-4">
                            <h4 className="font-black text-sm">2. Condicional: Se responder</h4>
                            <p className="text-xs text-muted-foreground font-medium mb-3">Aguardar interação por até 24h</p>
                            <div className="flex gap-2">
                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20 text-[10px] uppercase font-bold px-2 py-0.5">Sim: Seguir fluxo</Badge>
                                <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 border-rose-500/20 text-[10px] uppercase font-bold px-2 py-0.5">Não: Encerrar</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: IA Processing */}
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="w-[2px] bg-muted h-6" />
                            <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white z-10 shadow-lg shadow-purple-500/20 ring-4 ring-background">
                                <BrainCircuit className="size-5" />
                            </div>
                            <div className="w-[2px] bg-primary grow min-h-[80px]" />
                        </div>
                        <div className="flex-1 pb-10 pt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <h4 className="font-black text-sm">3. Processamento IA</h4>
                                <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/10 border-purple-500/20 text-[9px] font-bold uppercase">n8n Workflow</Badge>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Webhook n8n</label>
                                    <Select defaultValue="lead-v2">
                                        <SelectTrigger className="h-12 bg-muted/30 border-muted font-bold focus:ring-primary">
                                            <SelectValue placeholder="Selecione o workflow" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lead-v2" className="font-medium">Classification_Lead_V2 (Ativo)</SelectItem>
                                            <SelectItem value="interest" className="font-medium">Check_Interest_Score</SelectItem>
                                            <SelectItem value="demo" className="font-medium">Schedule_Demo_Trigger</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Instruções da IA (Prompt)</label>
                                    <Textarea
                                        className="min-h-[140px] bg-muted/30 border-muted font-medium text-xs leading-relaxed focus:ring-primary p-4"
                                        placeholder="Defina o comportamento da IA..."
                                    >
                                        {`Analise a resposta do lead e classifique em: 
1. INTERESSE_IMEDIATO (Deseja call ou demo)
2. CURIOSO (Fez perguntas técnicas)
3. NEGATIVO (Pediu para não contatar)

Se 1, extraia o horário sugerido se houver.`}
                                    </Textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Final Action */}
                    <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="w-[2px] bg-primary h-6" />
                            <div className="size-10 rounded-full bg-foreground flex items-center justify-center text-background z-10 shadow-lg ring-4 ring-background">
                                <Rocket className="size-5" />
                            </div>
                        </div>
                        <div className="flex-1 pt-4 space-y-4">
                            <h4 className="font-black text-sm">4. Ação Final</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center gap-2 text-center group-hover:bg-primary/10 transition-colors">
                                    <Bot className="size-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Sincronizar CRM</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex flex-col items-center gap-2 text-center opacity-50">
                                    <Phone className="size-5" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Agendar Call</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Add Button */}
                <Button size="icon" className="fixed bottom-28 right-6 size-14 rounded-full shadow-2xl z-50 ring-4 ring-background">
                    <Plus className="size-7" />
                </Button>

                {/* Bottom Persistent Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t flex gap-3 max-w-xl mx-auto z-50">
                    <Button variant="outline" className="flex-1 h-14 font-black rounded-2xl gap-2">
                        <Square className="size-4 fill-current" />
                        Pausar Fluxo
                    </Button>
                    <Button className="flex-[1.5] h-14 font-black rounded-2xl gap-2 shadow-lg shadow-primary/20">
                        <Save className="size-4" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
