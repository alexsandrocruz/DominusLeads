import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Rocket,
    CheckCircle2,
    ArrowRight,
    Zap,
    Plus,
    Building2,
    Target,
    Sparkles,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const [, setLocation] = useLocation();

    const steps = [
        {
            id: 1,
            title: "Configurar Empresa",
            desc: "Complete os dados jurídicos e técnicos do seu tenant.",
            icon: Building2,
            href: "/settings/company",
            completed: true
        },
        {
            id: 2,
            title: "Treinar sua IA",
            desc: "Defina o comportamento e o tom de voz do seu robô.",
            icon: Sparkles,
            href: "/automation/training",
            completed: false
        },
        {
            id: 3,
            title: "Definir Alvo (CNAE)",
            desc: "Escolha quais setores você deseja prospectar agora.",
            icon: Target,
            href: "/search",
            completed: false
        },
        {
            id: 4,
            title: "Criar Primeira Campanha",
            desc: "Cadastre seu template de mensagem e ative o robô.",
            icon: Rocket,
            href: "/campaigns",
            completed: false
        }
    ];

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                {/* Hero section */}
                <div className="text-center space-y-4 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="size-3" />
                        Pronto para decolar
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-tight italic">
                        Bem-vindo, <span className="text-primary italic">Especialista.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto leading-relaxed">
                        Seu exército de robôs de prospecção está pronto. Vamos configurar o básico para você começar a gerar leads qualificados 24/7.
                    </p>
                </div>

                {/* Progress Wheel Mockup */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2 px-1">
                            <CheckCircle2 className="size-5 text-primary" />
                            Seu Check-list Inicial
                        </h3>
                        <div className="space-y-3">
                            {steps.map((step) => (
                                <Card
                                    key={step.id}
                                    className={cn(
                                        "border-muted hover:border-primary/20 transition-all cursor-pointer rounded-3xl overflow-hidden group",
                                        step.completed ? "bg-primary/5" : "bg-white shadow-lg shadow-slate-200/40"
                                    )}
                                    onClick={() => setLocation(step.href)}
                                >
                                    <CardContent className="p-5 flex items-center gap-5">
                                        <div className={cn(
                                            "size-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                            step.completed ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                        )}>
                                            <step.icon className="size-6" />
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <h4 className="font-black text-sm tracking-tight flex items-center gap-2">
                                                {step.title}
                                                {step.completed && <CheckCircle2 className="size-3 text-primary" />}
                                            </h4>
                                            <p className="text-[10px] text-muted-foreground font-bold italic leading-tight">{step.desc}</p>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-primary to-indigo-600 rounded-[3rem] p-12 flex flex-col justify-between text-white shadow-2xl shadow-primary/40 overflow-hidden group">
                            <div className="absolute -top-12 -right-12 size-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000" />

                            <div className="space-y-2 relative">
                                <Badge className="bg-white/20 text-white border-none text-[9px] font-black tracking-widest uppercase">ESTADO ATUAL</Badge>
                                <h3 className="text-3xl font-black tracking-tighter italic">25% Configurado</h3>
                                <p className="text-sm font-medium opacity-80 leading-relaxed italic">Faltam apenas 3 passos para você soltar o primeiro robô na internet.</p>
                            </div>

                            <div className="relative">
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '25%' }} />
                                </div>
                                <Button className="w-full h-14 rounded-2xl bg-white text-primary font-black hover:bg-slate-100 gap-2 transition-all">
                                    Continuar Configuração
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick actions/support */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                    <p className="text-xs font-bold text-muted-foreground italic flex items-center gap-2">
                        Precisa de ajuda com o n8n ou IA?
                    </p>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary gap-2" onClick={() => setLocation("/support")}>
                            Central de Ajuda
                        </Button>
                        <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary gap-2">
                            Falar com Mentor
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
