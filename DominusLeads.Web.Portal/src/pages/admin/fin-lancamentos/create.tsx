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
    AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { useCreateFinLancamentos } from "@/lib/abp/hooks/useFinLancamentoses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    { id: "basicos", label: "Dados do Lançamento", icon: DollarSign },
    { id: "classificacao", label: "Classificação", icon: Tag },
    { id: "datas", label: "Datas e Liquidação", icon: Calendar },
    { id: "recorrencia", label: "Parcelamento / Recorrência", icon: Repeat },
    { id: "outros", label: "Observações", icon: FileText },
];

export default function CreateFinLancamentoPage() {
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("basicos");
    const createMutation = useCreateFinLancamentos();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            operacao: "S",
            quitado: false,
            ativo: true,
            valor: 0,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success("Lançamento criado com sucesso!");
            setLocation("/admin/fin-lancamentos");
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar lançamento");
        }
    };

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
                            <h1 className="text-3xl font-bold tracking-tight">Novo Lançamento</h1>
                            <p className="text-muted-foreground">Registre uma nova movimentação financeira</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="gap-2 px-6"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Lançamento
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
                                    onClick={() => {
                                        setActiveSection(section.id);
                                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
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

                    {/* Form Content */}
                    <div className="space-y-8 pb-20">
                        {/* Seção: Dados Básicos */}
                        <section id="basicos" className={cn("space-y-6 scroll-mt-6", activeSection !== "basicos" && "hidden")}>
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
                                        <Input id="descricao" placeholder="Ex: Pagamento de Aluguel" {...register("descricao")} />
                                        {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="valor">Valor (R$)</Label>
                                        <Input
                                            id="valor"
                                            type="number"
                                            step="0.01"
                                            placeholder="0,00"
                                            {...register("valor", { valueAsNumber: true })}
                                        />
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
                                        <Input id="nrDocumento" placeholder="NF, Recibo, etc..." {...register("nrDocumento")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Classificação */}
                        <section id="classificacao" className={cn("space-y-6 scroll-mt-6", activeSection !== "classificacao" && "hidden")}>
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
                                        {errors.idConta && <p className="text-xs text-destructive">{errors.idConta.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idPlanoConta">Plano de Contas (ID)</Label>
                                        <Input id="idPlanoConta" type="number" {...register("idPlanoConta", { valueAsNumber: true })} />
                                        {errors.idPlanoConta && <p className="text-xs text-destructive">{errors.idPlanoConta.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idCentroCusto">Centro de Custo (ID)</Label>
                                        <Input id="idCentroCusto" type="number" {...register("idCentroCusto", { valueAsNumber: true })} />
                                        {errors.idCentroCusto && <p className="text-xs text-destructive">{errors.idCentroCusto.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Datas */}
                        <section id="datas" className={cn("space-y-6 scroll-mt-6", activeSection !== "datas" && "hidden")}>
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
                        <section id="recorrencia" className={cn("space-y-6 scroll-mt-6", activeSection !== "recorrencia" && "hidden")}>
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
                        <section id="outros" className={cn("space-y-6 scroll-mt-6", activeSection !== "outros" && "hidden")}>
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
                                            placeholder="Alguma nota importante sobre este lançamento?"
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
