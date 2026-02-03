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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    ChevronLeft,
    Save,
    DollarSign,
    Tag,
    Calendar,
    Repeat,
    FileText,
    AlertCircle,
    LayoutDashboard,
    ArrowUpCircle,
    ArrowDownCircle,
    CheckCircle2,
    Clock
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useFinLancamentos, useUpdateFinLancamentos } from "@/lib/abp/hooks/useFinLancamentoses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
    descricao: z.string().min(1, "Descrição é obrigatória"),
    valor: z.number().min(0, "Valor deve ser maior ou igual a zero"),
    operacao: z.enum(["E", "S"]),
    idConta: z.number(),
    idPlanoConta: z.number(),
    idCentroCusto: z.number(),
    dataVencimento: z.string().optional(),
    dataEmissao: z.string().optional(),
    dataQuitacao: z.string().optional(),
    quitado: z.boolean(),
    nrDocumento: z.string().optional(),
    observacao: z.string().optional(),
    parcelado: z.boolean(),
    recorrente: z.boolean(),
    ativo: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const SECTIONS = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { id: "basicos", label: "Dados do Lançamento", icon: DollarSign },
    { id: "classificacao", label: "Classificação", icon: Tag },
    { id: "datas", label: "Datas e Liquidação", icon: Calendar },
    { id: "recorrencia", label: "Parcelamento / Recorrência", icon: Repeat },
    { id: "outros", label: "Observações", icon: FileText },
];

export default function EditFinLancamentoPage() {
    const { id } = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("overview");

    const { data: lancamento, isLoading: loadingLancamento } = useFinLancamentos(id!);
    const updateMutation = useUpdateFinLancamentos();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (lancamento) {
            reset(lancamento);
        }
    }, [lancamento, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await updateMutation.mutateAsync({ id: id!, data });
            toast.success("Lançamento atualizado com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar lançamento");
        }
    };

    const formatCurrency = (value?: number) => {
        if (value === undefined) return "R$ 0,00";
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (loadingLancamento) {
        return (
            <Shell>
                <div className="max-w-[1200px] mx-auto space-y-6">
                    <Skeleton className="h-20 w-full" />
                    <div className="grid grid-cols-[280px_1fr] gap-8">
                        <Skeleton className="h-[400px] w-full" />
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation("/admin/fin-lancamentos")}
                            className="rounded-full"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{lancamento?.descricao || `Lançamento #${lancamento?.idLancamento}`}</h1>
                            <p className="text-muted-foreground">ID: #{lancamento?.idLancamento} • Ref: {lancamento?.nrDocumento || "N/A"}</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="gap-2 px-6"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Alterações
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="space-y-2 sticky top-6 self-start">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        activeSection === section.id
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {section.label}
                                </button>
                            );
                        })}
                    </aside>

                    {/* Content Areas */}
                    <div className="space-y-8 pb-20">
                        {/* Seção: Overview */}
                        <section id="overview" className={cn("space-y-6", activeSection !== "overview" && "hidden")}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={cn(
                                    "p-6 border rounded-2xl",
                                    lancamento?.operacao === "E"
                                        ? "bg-green-500/10 border-green-500/20"
                                        : "bg-red-500/10 border-red-500/20"
                                )}>
                                    {lancamento?.operacao === "E" ? (
                                        <ArrowUpCircle className="h-8 w-8 text-green-500 mb-2" />
                                    ) : (
                                        <ArrowDownCircle className="h-8 w-8 text-red-500 mb-2" />
                                    )}
                                    <div className={cn(
                                        "text-2xl font-bold",
                                        lancamento?.operacao === "E" ? "text-green-600" : "text-red-600"
                                    )}>
                                        {formatCurrency(lancamento?.valor)}
                                    </div>
                                    <div className="text-sm opacity-70">
                                        {lancamento?.operacao === "E" ? "Entrada" : "Saída"}
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-6 border rounded-2xl",
                                    lancamento?.quitado
                                        ? "bg-blue-500/10 border-blue-500/20"
                                        : "bg-orange-500/10 border-orange-500/20"
                                )}>
                                    {lancamento?.quitado ? (
                                        <CheckCircle2 className="h-8 w-8 text-blue-500 mb-2" />
                                    ) : (
                                        <Clock className="h-8 w-8 text-orange-500 mb-2" />
                                    )}
                                    <div className={cn(
                                        "text-2xl font-bold",
                                        lancamento?.quitado ? "text-blue-600" : "text-orange-600"
                                    )}>
                                        {lancamento?.quitado ? "Quitado" : "Pendente"}
                                    </div>
                                    <div className="text-sm opacity-70">Status de Liquidação</div>
                                </div>

                                <div className="p-6 bg-muted/50 border border-muted-foreground/10 rounded-2xl">
                                    <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                                    <div className="text-2xl font-bold">
                                        {lancamento?.dataVencimento ? new Date(lancamento.dataVencimento).toLocaleDateString('pt-BR') : "--"}
                                    </div>
                                    <div className="text-sm opacity-70">Vencimento</div>
                                </div>
                            </div>

                            <div className="p-8 border-2 border-dashed border-muted rounded-3xl flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                                <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                                <p>Módulos de Auditoria e Comprovantes em desenvolvimento</p>
                            </div>
                        </section>

                        {/* Seção: Dados Básicos */}
                        <section id="basicos" className={cn("space-y-6", activeSection !== "basicos" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        Dados do Lançamento
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="descricao">Descrição / Histórico</Label>
                                        <Input id="descricao" {...register("descricao")} />
                                        {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="valor">Valor (R$)</Label>
                                        <Input id="valor" type="number" step="0.01" {...register("valor", { valueAsNumber: true })} />
                                        {errors.valor && <p className="text-xs text-destructive">{errors.valor.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="operacao">Tipo de Operação</Label>
                                        <Select
                                            value={watch("operacao")}
                                            onValueChange={(val) => setValue("operacao", val as "E" | "S")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="E">Entrada (Crédito)</SelectItem>
                                                <SelectItem value="S">Saída (Débito)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nrDocumento">Nº do Documento / Ref</Label>
                                        <Input id="nrDocumento" {...register("nrDocumento")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Classificação */}
                        <section id="classificacao" className={cn("space-y-6", activeSection !== "classificacao" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Tag className="h-5 w-5 text-primary" />
                                        Classificação Financeira
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="idConta">Conta / Caixa (ID)</Label>
                                        <Input id="idConta" type="number" {...register("idConta", { valueAsNumber: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idPlanoConta">Plano de Contas (ID)</Label>
                                        <Input id="idPlanoConta" type="number" {...register("idPlanoConta", { valueAsNumber: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idCentroCusto">Centro de Custo (ID)</Label>
                                        <Input id="idCentroCusto" type="number" {...register("idCentroCusto", { valueAsNumber: true })} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Datas */}
                        <section id="datas" className={cn("space-y-6", activeSection !== "datas" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Datas e Liquidação
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="dataEmissao">Data de Emissão</Label>
                                        <Input id="dataEmissao" type="date" {...register("dataEmissao")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                                        <Input id="dataVencimento" type="date" {...register("dataVencimento")} />
                                    </div>
                                    <div className="space-y-2 pt-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="quitado"
                                                checked={watch("quitado")}
                                                onCheckedChange={(checked) => setValue("quitado", !!checked)}
                                            />
                                            <Label htmlFor="quitado" className="text-sm font-normal cursor-pointer">Lançamento já foi quitado / pago</Label>
                                        </div>
                                    </div>
                                    <div className={cn("space-y-2 transition-all", !watch("quitado") && "opacity-50 pointer-events-none")}>
                                        <Label htmlFor="dataQuitacao">Data da Quitação</Label>
                                        <Input id="dataQuitacao" type="date" {...register("dataQuitacao")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Recorrência */}
                        <section id="recorrencia" className={cn("space-y-6", activeSection !== "recorrencia" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Repeat className="h-5 w-5 text-primary" />
                                        Parcelamento / Recorrência
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="parcelado"
                                            checked={watch("parcelado")}
                                            onCheckedChange={(checked) => setValue("parcelado", !!checked)}
                                        />
                                        <Label htmlFor="parcelado" className="text-sm font-normal cursor-pointer">Lançamento Parcelado</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recorrente"
                                            checked={watch("recorrente")}
                                            onCheckedChange={(checked) => setValue("recorrente", !!checked)}
                                        />
                                        <Label htmlFor="recorrente" className="text-sm font-normal cursor-pointer">Lançamento Recorrente (Mensal/Fixo)</Label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Outros */}
                        <section id="outros" className={cn("space-y-6", activeSection !== "outros" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Observações Adicionais
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="observacao">Observações Internas</Label>
                                        <Textarea
                                            id="observacao"
                                            className="min-h-[150px] resize-none"
                                            {...register("observacao")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
