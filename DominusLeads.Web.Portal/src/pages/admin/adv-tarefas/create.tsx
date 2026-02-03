import { useState } from "react";
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
    MessageSquare
} from "lucide-react";
import { useLocation } from "wouter";
import { useCreateAdvTarefas } from "@/lib/abp/hooks/useAdvTarefases";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateAdvTarefaPage() {
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("basic");
    const createMutation = useCreateAdvTarefas();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agendada: false,
            ativo: true,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success("Tarefa criada com sucesso!");
            setLocation("/admin/adv-tarefas");
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar tarefa");
        }
    };

    const sections = [
        { id: "basic", label: "Dados Básicos", icon: FileText },
        { id: "responsibility", label: "Responsáveis", icon: User },
        { id: "context", label: "Contexto (Processo/Cliente)", icon: Settings },
        { id: "scheduling", label: "Prazos e Agenda", icon: Calendar },
        { id: "notes", label: "Observações", icon: MessageSquare },
    ];

    return (
        <Shell>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation("/admin/adv-tarefas")}
                            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nova Tarefa</h1>
                            <p className="text-muted-foreground text-sm">Crie uma nova atividade para o fluxo de trabalho</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setLocation("/admin/adv-tarefas")}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2 shadow-lg shadow-primary/20">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Tarefa
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
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

                            {activeSection === "basic" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Informações da Atividade
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao">Descrição da Tarefa</Label>
                                            <Input
                                                id="descricao"
                                                placeholder="Ex: Elaborar petição inicial"
                                                {...register("descricao")}
                                                className={cn(errors.descricao && "border-destructive")}
                                            />
                                            {errors.descricao && (
                                                <p className="text-xs text-destructive">{errors.descricao.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idTipoTarefa">Tipo de Tarefa</Label>
                                            <Input
                                                id="idTipoTarefa"
                                                type="number"
                                                placeholder="Selecione o tipo..."
                                                {...register("idTipoTarefa", { valueAsNumber: true })}
                                                className={cn(errors.idTipoTarefa && "border-destructive")}
                                            />
                                            {errors.idTipoTarefa && (
                                                <p className="text-xs text-destructive">{errors.idTipoTarefa.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "responsibility" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Atribuição de Responsabilidade
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="idResponsavel">ID Responsável</Label>
                                            <Input
                                                id="idResponsavel"
                                                type="number"
                                                {...register("idResponsavel", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idExecutor">ID Executor</Label>
                                            <Input
                                                id="idExecutor"
                                                type="number"
                                                {...register("idExecutor", { valueAsNumber: true })}
                                            />
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
                                            <Input
                                                id="idProcesso"
                                                type="number"
                                                {...register("idProcesso", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idCliente">ID Cliente</Label>
                                            <Input
                                                id="idCliente"
                                                type="number"
                                                {...register("idCliente", { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "scheduling" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Prazos e Agendamento
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dataParaFinalizacao">Prazo Final</Label>
                                            <Input
                                                id="dataParaFinalizacao"
                                                type="date"
                                                {...register("dataParaFinalizacao")}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                            <Checkbox
                                                id="agendada"
                                                checked={watch("agendada")}
                                                onCheckedChange={(checked) => setValue("agendada", !!checked)}
                                            />
                                            <label htmlFor="agendada" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
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
                                        Detalhes Adicionais
                                    </h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="observacao">Observações Internas</Label>
                                        <Textarea
                                            id="observacao"
                                            rows={6}
                                            placeholder="Descreva detalhes específicos da tarefa aqui..."
                                            {...register("observacao")}
                                        />
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
