import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import {
    ArrowLeft,
    BrainCircuit,
    Target,
    Save,
    PlusCircle,
    CheckCircle2,
    MessageCircle,
    X,
    Send,
    Terminal,
    Bold,
    Italic,
    List,
    Code,
    Variable
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AiTrainingPage() {
    const [, setLocation] = useLocation();
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    const examples = [
        { response: "Pode ligar amanhã", classification: "Lead Quente" },
        { response: "Não tenho interesse", classification: "Descarte" }
    ];

    return (
        <AppShell>
            <div className="max-w-xl mx-auto space-y-8 pb-32 relative min-h-[calc(100vh-100px)]">
                {/* Header Navigation */}
                <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-2 z-50">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/automation")} className="gap-2 -ml-2">
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h1 className="text-lg font-black tracking-tight">Treinamento da IA</h1>
                    <div className="w-8" />
                </div>

                {/* Section: Goal */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Target className="size-5 text-primary" />
                        <h3 className="text-base font-black">Objetivo da Classificação</h3>
                    </div>
                    <div className="space-y-2">
                        <Input
                            className="h-14 bg-muted/30 border-muted font-bold focus:ring-primary rounded-xl"
                            placeholder="Ex: Identificar decisores e interesse real"
                        />
                        <p className="text-[10px] text-muted-foreground font-medium px-1">Defina o que a IA deve buscar nas mensagens dos leads.</p>
                    </div>
                </div>

                {/* Section: Prompt Builder */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="size-5 text-primary" />
                            <h3 className="text-base font-black">Prompt Builder</h3>
                        </div>
                        <Button variant="link" className="text-xs font-bold text-primary p-0">Ver Dicas</Button>
                    </div>

                    <Card className="overflow-hidden border-muted shadow-lg shadow-slate-200/50 rounded-2xl">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-muted bg-muted/30">
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><Bold className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><Italic className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><List className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><Code className="size-4" /></Button>
                            </div>
                            <Button variant="secondary" size="sm" className="h-8 gap-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-[10px] uppercase">
                                <Variable className="size-3" />
                                Variáveis
                            </Button>
                        </div>
                        <Textarea
                            className="min-h-[200px] border-none focus-visible:ring-0 bg-transparent font-mono text-[13px] leading-relaxed p-4"
                            placeholder="Aja como um SDR experiente da Dominus Leads. Analise a resposta do cliente e classifique o estágio de interesse..."
                        />
                    </Card>
                </div>

                {/* Section: Few-shot Training */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Terminal className="size-5 text-primary" />
                            <h3 className="text-base font-black">Exemplos (Few-shot)</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary font-bold gap-2">
                            <PlusCircle className="size-4" />
                            Novo
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {examples.map((ex, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Resposta</label>
                                    <Input
                                        readOnly
                                        value={ex.response}
                                        className="h-10 text-xs bg-muted/30 border-muted font-medium rounded-xl"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Classificação</label>
                                    <div className="relative">
                                        <Input
                                            readOnly
                                            value={ex.classification}
                                            className="h-10 text-xs bg-primary/5 border-primary/20 text-primary font-black rounded-xl pr-10"
                                        />
                                        <CheckCircle2 className="size-4 text-primary absolute right-3 top-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test Simulator Trigger */}
                <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl gap-3 font-black border-dashed border-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => setIsSimulatorOpen(true)}
                >
                    <MessageCircle className="size-5 text-primary" />
                    Testar Prompt no Simulador
                </Button>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-50">
                    <div className="max-w-xl mx-auto">
                        <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                            <Save className="size-5" />
                            Salvar e Aplicar ao Fluxo
                        </Button>
                    </div>
                </div>

                {/* Chat Simulator Overlay (Visual representation) */}
                {isSimulatorOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end animate-in fade-in duration-300">
                        <div className="bg-background w-full max-w-xl mx-auto rounded-t-[2.5rem] p-6 h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
                            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 shrink-0" />

                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <BrainCircuit className="size-5" />
                                    </div>
                                    <h4 className="text-xl font-black">Simulador de IA</h4>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsSimulatorOpen(false)}>
                                    <X className="size-6 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto mb-6 px-2 custom-scrollbar">
                                <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <p className="text-sm font-medium leading-relaxed italic">
                                        Envie uma mensagem de teste para ver como a IA irá classificá-la com base no seu novo prompt.
                                    </p>
                                </div>

                                <div className="ml-auto bg-primary text-white p-4 rounded-3xl rounded-tr-none max-w-[85%] shadow-lg shadow-primary/20">
                                    <p className="text-sm font-bold">"Tenho interesse mas só consigo falar na sexta."</p>
                                </div>

                                <div className="flex flex-col items-center py-4">
                                    <Badge className="bg-primary/10 border-primary/20 text-primary px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Resultado IA:</span>
                                        <span className="text-sm font-black italic">Lead Quente (Follow-up)</span>
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2 p-1 shrink-0">
                                <Input
                                    className="flex-1 h-14 bg-muted/50 border-none rounded-2xl px-6 font-bold focus-visible:ring-primary"
                                    placeholder="Digite uma mensagem de teste..."
                                />
                                <Button size="icon" className="size-14 rounded-2xl shrink-0 shadow-lg shadow-primary/20 bg-primary">
                                    <Send className="size-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
