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
    User,
    FileText,
    Settings,
    MessageSquare,
    CheckCircle2,
    Clock
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useAdvTarefases, useUpdateAdvTarefas } from "@/lib/abp/hooks/useAdvTarefases";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    descricao: z.string().min(1, "Descrição é obrigatória"),
    idTipoTarefa: z.number().min(1, "Tipo de tarefa é obrigatório"),
    dataParaFinalizacao: z.string().optional(),
    idResponsavel: z.number().optional(),
    idExecutor: z.number().optional(),
    idProcesso: z.number().optional(),
    idCliente: z.number().optional(),
    observacao: z.string().optional(),
    agendada: z.boolean(),
    ativo: z.boolean(),
    finalizado: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditAdvTarefaPage() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("overview");

    const { data: tarefases, isLoading: loadingData } = useAdvTarefases();
    const tarefa = tarefases?.items?.find((item: any) => item.id === id);

    const updateMutation = useUpdateAdvTarefas();

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
        if (tarefa) {
            reset(tarefa);
        }
    }, [tarefa, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        try {
            await updateMutation.mutateAsync({ id: id!, data: formData });
            toast.success("Tarefa atualizada com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar tarefa");
        }
    };

    const sections = [
        { id: "overview", label: "Visão Geral", icon: CheckCircle2 },
        { id: "basic", label: "Dados Básicos", icon: FileText },
        { id: "responsibility", label: "Responsáveis", icon: User },
        { id: "context", label: "Contexto", icon: Settings },
        { id: "scheduling", label: "Prazos e Agenda", icon: Calendar },
        { id: "notes", label: "Observações", icon: MessageSquare },
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

    if (!tarefa) {
        return (
            <Shell>
                <div className="p-12 text-center">
                    <h2 className="text-xl font-bold">Tarefa não encontrada</h2>
                    <Button onClick={() => setLocation("/admin/adv-tarefas")} className="mt-4">
                        Voltar para a lista
                    </Button>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation("/admin/adv-tarefas")}
                            className="rounded-full hover:bg-primary/10 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold tracking-tight">Editar Tarefa</h1>
                                <Badge variant={tarefa.finalizado ? "default" : "secondary"}>
                                    {tarefa.finalizado ? "Concluída" : "Pendente"}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">ID: {tarefa.idTarefa || "Sem ID"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setLocation("/admin/adv-tarefas")}>
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
                                    <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <p className="text-primary font-semibold mb-2 flex items-center gap-1">
                                                <Clock className="h-4 w-4" /> Resumo da Atividade
                                            </p>
                                            <h2 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{tarefa.descricao}</h2>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20">
                                                    <span className="text-muted-foreground mr-2">Prazo:</span>
                                                    <span className="font-bold">{tarefa.dataParaFinalizacao ? new Date(tarefa.dataParaFinalizacao).toLocaleDateString() : "Sem prazo"}</span>
                                                </div>
                                                <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20">
                                                    <span className="text-muted-foreground mr-2">Status:</span>
                                                    <span className="font-bold">{tarefa.finalizado ? "Finalizada" : "Em Aberto"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="absolute -right-8 -bottom-8 h-48 w-48 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                    </div>

                                    <div className="flex items-center space-x-2 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
                                        <Checkbox
                                            id="finalizado_check"
                                            checked={watch("finalizado")}
                                            onCheckedChange={(checked) => setValue("finalizado", !!checked)}
                                        />
                                        <label htmlFor="finalizado_check" className="text-lg font-semibold cursor-pointer">
                                            Marcar tarefa como concluída
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeSection === "basic" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Informações da Atividade
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao">Descrição da Tarefa</Label>
                                            <Input id="descricao" {...register("descricao")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idTipoTarefa">Tipo de Tarefa</Label>
                                            <Input id="idTipoTarefa" type="number" {...register("idTipoTarefa", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "responsibility" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Atribuição
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="idResponsavel">ID Responsável</Label>
                                            <Input id="idResponsavel" type="number" {...register("idResponsavel", { valueAsNumber: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idExecutor">ID Executor</Label>
                                            <Input id="idExecutor" type="number" {...register("idExecutor", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "context" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-primary" />
                                        Relacionamentos
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="idProcesso">ID Processo</Label>
                                            <Input id="idProcesso" type="number" {...register("idProcesso", { valueAsNumber: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idCliente">ID Cliente</Label>
                                            <Input id="idCliente" type="number" {...register("idCliente", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "scheduling" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Prazos
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dataParaFinalizacao">Prazo Final</Label>
                                            <Input id="dataParaFinalizacao" type="date" {...register("dataParaFinalizacao")} />
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                            <Checkbox
                                                id="agendada"
                                                checked={watch("agendada")}
                                                onCheckedChange={(checked) => setValue("agendada", !!checked)}
                                            />
                                            <label htmlFor="agendada" className="text-sm font-medium leading-none cursor-pointer">
                                                Esta tarefa deve aparecer na agenda
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "notes" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        Observações
                                    </h3>
                                    <Textarea id="observacao" rows={6} {...register("observacao")} />
                                </div>
                            )}

                        </form>
                    </main>
                </div>
            </div>
        </Shell>
    );
}
