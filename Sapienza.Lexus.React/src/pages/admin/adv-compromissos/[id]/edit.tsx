import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronLeft,
    Save,
    Loader2,
    Calendar,
    Clock,
    FileText,
    Users,
    MapPin,
    AlertTriangle,
    History,
    ExternalLink
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useAdvCompromissoses, useUpdateAdvCompromissos } from "@/lib/abp/hooks/useAdvCompromissoses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    descricao: z.string().min(1, "Descrição é obrigatória"),
    idTipoCompromisso: z.number().min(1, "Tipo de compromisso é obrigatório"),
    dataPrazoInterno: z.string().optional(),
    dataPrazoFatal: z.string().optional(),
    horarioInicial: z.number().optional(),
    horarioFinal: z.number().optional(),
    idProcesso: z.number().optional(),
    onde: z.string().optional(),
    pauta: z.boolean(),
    ativo: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditAdvCompromissoPage() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("overview");

    const { data: compromissoses, isLoading: loadingData } = useAdvCompromissoses();
    const compromisso = compromissoses?.items?.find((item: any) => item.id === id);

    const updateMutation = useUpdateAdvCompromissos();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (compromisso) {
            reset(compromisso);
        }
    }, [compromisso, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        try {
            await updateMutation.mutateAsync({ id: id!, data: formData });
            toast.success("Compromisso atualizado com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar compromisso");
        }
    };

    const sections = [
        { id: "overview", label: "Visão Geral", icon: Calendar },
        { id: "basic", label: "Dados Básicos", icon: FileText },
        { id: "times", label: "Horários e Prazos", icon: Clock },
        { id: "location", label: "Local e Pauta", icon: MapPin },
        { id: "context", label: "Relacionamentos", icon: Users },
    ];

    if (loadingData) {
        return (
            <Shell>
                <div className="flex items-center justify-center p-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Shell>
        );
    }

    if (!compromisso) {
        return (
            <Shell>
                <div className="p-12 text-center">
                    <h2 className="text-xl font-bold">Compromisso não encontrado</h2>
                    <Button onClick={() => setLocation("/admin/adv-compromissos")} className="mt-4">
                        Voltar para a agenda
                    </Button>
                </div>
            </Shell>
        );
    }

    const isFatal = compromisso.dataPrazoFatal && new Date(compromisso.dataPrazoFatal) <= new Date();

    return (
        <Shell>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation("/admin/adv-compromissos")}
                            className="rounded-full hover:bg-primary/10 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold tracking-tight">Editar Compromisso</h1>
                                <Badge variant={compromisso.ativo ? "default" : "secondary"}>
                                    {compromisso.ativo ? "Ativo" : "Inativo"}
                                </Badge>
                                {compromisso.pauta && (
                                    <Badge variant="outline" className="border-primary text-primary">Em Pauta</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">ID: {compromisso.idCompromisso || "Sem ID"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setLocation("/admin/adv-compromissos")}>
                            Voltar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2 shadow-lg shadow-primary/20">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <aside className="md:col-span-1 space-y-1">
                        <nav className="sticky top-24">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                            activeSection === section.id
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Form Content */}
                    <main className="md:col-span-3">
                        <form className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                            {activeSection === "overview" && (
                                <div className="space-y-6">
                                    {/* Focus Card */}
                                    <div className={cn(
                                        "p-8 rounded-3xl relative overflow-hidden group border",
                                        isFatal ? "bg-red-500/5 border-red-500/20" : "bg-primary/5 border-primary/20"
                                    )}>
                                        <div className="relative z-10">
                                            <p className={cn("font-semibold mb-2 flex items-center gap-1", isFatal ? "text-red-600" : "text-primary")}>
                                                <Calendar className="h-4 w-4" /> Resumo do Agendamento
                                            </p>
                                            <h2 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{compromisso.descricao}</h2>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20">
                                                    <span className="text-muted-foreground mr-2">Onde:</span>
                                                    <span className="font-bold">{compromisso.onde || "Não informado"}</span>
                                                </div>
                                                <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20">
                                                    <span className="text-muted-foreground mr-2">Pauta:</span>
                                                    <span className="font-bold">{compromisso.pauta ? "Sim" : "Não"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <History className="absolute -right-8 -bottom-8 h-48 w-48 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-card p-6 rounded-2xl border border-border/50 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Início</p>
                                                <p className="text-2xl font-bold">{compromisso.horarioInicial || "---"}</p>
                                            </div>
                                            <Clock className="h-8 w-8 text-primary/20" />
                                        </div>
                                        <div className="bg-card p-6 rounded-2xl border border-border/50 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Término</p>
                                                <p className="text-2xl font-bold">{compromisso.horarioFinal || "---"}</p>
                                            </div>
                                            <Clock className="h-8 w-8 text-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "basic" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Informações Centrais
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao">Descrição</Label>
                                            <Input id="descricao" {...register("descricao")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idTipoCompromisso">Tipo de Compromisso</Label>
                                            <Input id="idTipoCompromisso" type="number" {...register("idTipoCompromisso", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "times" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Prazos e Alarmes
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="dataPrazoInterno">Prazo Interno</Label>
                                            <Input id="dataPrazoInterno" type="date" {...register("dataPrazoInterno")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dataPrazoFatal" className="text-red-500">Prazo Fatal</Label>
                                            <Input id="dataPrazoFatal" type="date" {...register("dataPrazoFatal")} className="border-red-500/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="horarioInicial">Hora Início (HHMM)</Label>
                                            <Input id="horarioInicial" type="number" {...register("horarioInicial", { valueAsNumber: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="horarioFinal">Hora Fim (HHMM)</Label>
                                            <Input id="horarioFinal" type="number" {...register("horarioFinal", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "location" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Onde e Visibilidade
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="onde">Local</Label>
                                            <Input id="onde" {...register("onde")} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                                <Checkbox
                                                    id="pauta_edit"
                                                    checked={watch("pauta")}
                                                    onCheckedChange={(checked) => setValue("pauta", !!checked)}
                                                />
                                                <label htmlFor="pauta_edit" className="text-sm font-medium leading-none cursor-pointer">
                                                    Em Pauta
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                                <Checkbox
                                                    id="ativo_edit"
                                                    checked={watch("ativo")}
                                                    onCheckedChange={(checked) => setValue("ativo", !!checked)}
                                                />
                                                <label htmlFor="ativo_edit" className="text-sm font-medium leading-none cursor-pointer">
                                                    Ativo
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "context" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Vínculo Jurídico
                                    </h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="idProcesso">ID Processo</Label>
                                        <div className="flex gap-2">
                                            <Input id="idProcesso" type="number" {...register("idProcesso", { valueAsNumber: true })} className="flex-1" />
                                            {compromisso.idProcesso && (
                                                <Button variant="outline" size="icon" title="Ver Processo">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </main>
                </div>
            </div>
        </Shell>
    );
}
