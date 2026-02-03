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
    Loader2,
    ChevronLeft,
    Save,
    User,
    MapPin,
    Phone,
    FileText,
    Briefcase,
    AlertCircle,
    LayoutDashboard,
    Calendar,
    DollarSign
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useAdvClientes, useUpdateAdvClientes } from "@/lib/abp/hooks/useAdvClienteses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    apelido: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    rg: z.string().optional(),
    telCelular: z.string().optional(),
    telFixo: z.string().optional(),
    dataNascimento: z.string().optional(),
    endereco: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cep: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    observacoes: z.string().optional(),
    ativo: z.boolean(),
    idGrupo: z.any().optional(),
    idSituacao: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SECTIONS = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "basicos", label: "Dados Pessoais", icon: User },
    { id: "contato", label: "Contatos", icon: Phone },
    { id: "endereco", label: "Endereço", icon: MapPin },
    { id: "documentos", label: "Documentação", icon: FileText },
    { id: "outros", label: "Outras Informações", icon: Briefcase },
];

export default function EditClientePage() {
    const { id } = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("dashboard");

    const { data: cliente, isLoading: loadingCliente } = useAdvClientes(id!);
    const updateMutation = useUpdateAdvClientes();

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
        if (cliente) {
            reset(cliente);
        }
    }, [cliente, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await updateMutation.mutateAsync({ id: id!, data });
            toast.success("Cliente atualizado com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar cliente");
        }
    };

    if (loadingCliente) {
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
                            onClick={() => setLocation("/admin/adv-clientes")}
                            className="rounded-full"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{cliente?.nome}</h1>
                            <p className="text-muted-foreground">ID: #{cliente?.idCliente} • {cliente?.email || "Sem e-mail"}</p>
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
                        {/* Seção: Dashboard (Mini) */}
                        <section id="dashboard" className={cn("space-y-6", activeSection !== "dashboard" && "hidden")}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                                    <LayoutDashboard className="h-8 w-8 text-blue-500 mb-2" />
                                    <div className="text-2xl font-bold text-blue-600">--</div>
                                    <div className="text-sm text-blue-600/80">Processos Ativos</div>
                                </div>
                                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                    <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                                    <div className="text-2xl font-bold text-green-600">R$ 0,00</div>
                                    <div className="text-sm text-green-600/80">Saldo Financeiro</div>
                                </div>
                                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                    <Calendar className="h-8 w-8 text-orange-500 mb-2" />
                                    <div className="text-2xl font-bold text-orange-600">--</div>
                                    <div className="text-sm text-orange-600/80">Próximo Compromisso</div>
                                </div>
                            </div>

                            <div className="p-8 border-2 border-dashed border-muted rounded-3xl flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                                <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                                <p>Módulos de Dashboard em desenvolvimento para Clientes</p>
                            </div>
                        </section>

                        {/* Seção: Dados Básicos */}
                        <section id="basicos" className={cn("space-y-6", activeSection !== "basicos" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Dados Pessoais
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="nome">Nome Completo</Label>
                                        <Input id="nome" {...register("nome")} />
                                        {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apelido">Apelido / Nome Fantasia</Label>
                                        <Input id="apelido" {...register("apelido")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                                        <Input id="dataNascimento" type="date" {...register("dataNascimento")} />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Checkbox
                                            id="ativo"
                                            checked={watch("ativo")}
                                            onCheckedChange={(checked) => setValue("ativo", !!checked)}
                                        />
                                        <Label htmlFor="ativo" className="text-sm font-normal cursor-pointer">Cliente Ativo</Label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Contatos */}
                        <section id="contato" className={cn("space-y-6", activeSection !== "contato" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-primary" />
                                        Contatos
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email">E-mail Principal</Label>
                                        <Input id="email" type="email" {...register("email")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telCelular">Celular / WhatsApp</Label>
                                        <Input id="telCelular" {...register("telCelular")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telFixo">Telefone Fixo</Label>
                                        <Input id="telFixo" {...register("telFixo")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Endereço */}
                        <section id="endereco" className={cn("space-y-6", activeSection !== "endereco" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Localização
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cep">CEP</Label>
                                        <Input id="cep" {...register("cep")} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="endereco">Logradouro</Label>
                                        <Input id="endereco" {...register("endereco")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="numero">Número</Label>
                                        <Input id="numero" {...register("numero")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="complemento">Complemento</Label>
                                        <Input id="complemento" {...register("complemento")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bairro">Bairro</Label>
                                        <Input id="bairro" {...register("bairro")} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="cidade">Cidade</Label>
                                        <Input id="cidade" {...register("cidade")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="estado">Estado (UF)</Label>
                                        <Input id="estado" maxLength={2} {...register("estado")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Documentação */}
                        <section id="documentos" className={cn("space-y-6", activeSection !== "documentos" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Documentação
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input id="cpf" {...register("cpf")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rg">RG</Label>
                                        <Input id="rg" {...register("rg")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cnpj">CNPJ</Label>
                                        <Input id="cnpj" {...register("cnpj")} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção: Outros */}
                        <section id="outros" className={cn("space-y-6", activeSection !== "outros" && "hidden")}>
                            <div className="bg-card border-none shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                                <div className="p-6 border-b bg-muted/30">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Informações Adicionais
                                    </h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="observacoes">Observações Internas</Label>
                                        <Textarea
                                            id="observacoes"
                                            className="min-h-[150px] resize-none"
                                            {...register("observacoes")}
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
