import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Home, User as UserIcon, Settings, Briefcase, Loader2, Save, X } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useCreateAdvProfissionais } from "@/lib/abp/hooks/useAdvProfissionaises";
import { useUsuUsuarioses } from "@/lib/abp/hooks/useusuUsuarioses";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    idUsuario: z.string().optional(),
    ativo: z.boolean().default(true),
    idProfissional: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SECTIONS = [
    { id: "basicos", label: "Dados Básicos", icon: UserIcon },
    { id: "configuracoes", label: "Configurações", icon: Settings },
];

export default function CreateProfissionalPage() {
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("basicos");

    const { data: usersData, isLoading: isLoadingUsers } = useUsuUsuarioses({ maxResultCount: 1000 });
    const createMutation = useCreateAdvProfissionais();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ativo: true,
            nome: "",
            email: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await createMutation.mutateAsync({
                ...data,
                idUsuario: data.idUsuario ? parseInt(data.idUsuario) : null,
                idProfissional: data.idProfissional ? parseInt(data.idProfissional) : null,
            });
            toast.success("Profissional criado com sucesso");
            setLocation("/admin/adv-profissionais");
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar profissional");
        }
    };

    const handleBack = () => setLocation("/admin/adv-profissionais");

    return (
        <Shell>
            <div className="space-y-6 max-w-[1200px] mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                    <button onClick={() => setLocation("/dashboard")} className="hover:text-foreground transition-colors">
                        Dashboard
                    </button>
                    <ChevronRight className="h-4 w-4" />
                    <button onClick={handleBack} className="hover:text-foreground transition-colors">
                        Profissionais
                    </button>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium">Novo Profissional</span>
                </nav>

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Novo Profissional</h1>
                            <p className="text-muted-foreground">Cadastre um novo advogado ou colaborador no sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleBack} className="gap-2">
                            <X className="h-4 w-4" /> Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2 px-6">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Profissional
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
                    {/* Sidebar Navigation */}
                    <aside className="sticky top-6 space-y-2">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeSection === section.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <section.icon className={cn("h-4 w-4", activeSection === section.id ? "text-white" : "text-muted-foreground")} />
                                {section.label}
                            </button>
                        ))}
                    </aside>

                    {/* Main Form Content */}
                    <div className="space-y-8 pb-20">
                        {/* Seção: Dados Básicos */}
                        <section id="basicos" className={cn("space-y-6 scroll-mt-6", activeSection !== "basicos" && "hidden")}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-1 bg-primary rounded-full" />
                                <h2 className="text-xl font-semibold">Dados Básicos</h2>
                            </div>

                            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome" className="text-sm font-medium">Nome Completo *</Label>
                                            <Input
                                                id="nome"
                                                placeholder="Ex: João Silva"
                                                {...register("nome")}
                                                className={cn("bg-background/50", errors.nome && "border-destructive")}
                                            />
                                            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Ex: joao@escritorio.com"
                                                {...register("email")}
                                                className="bg-background/50"
                                            />
                                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="idProfissional" className="text-sm font-medium">ID Profissional (Opcional)</Label>
                                            <Input
                                                id="idProfissional"
                                                type="number"
                                                placeholder="Identificador interno"
                                                {...register("idProfissional")}
                                                className="bg-background/50"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Seção: Configurações */}
                        <section id="configuracoes" className={cn("space-y-6 scroll-mt-6", activeSection !== "configuracoes" && "hidden")}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-1 bg-primary rounded-full" />
                                <h2 className="text-xl font-semibold">Configurações</h2>
                            </div>

                            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-sm font-medium">Vincular Usuário do Sistema</Label>
                                            <Select
                                                value={watch("idUsuario") || "none"}
                                                onValueChange={(val) => setValue("idUsuario", val === "none" ? "" : val)}
                                            >
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Selecione um usuário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Nenhum vínculo</SelectItem>
                                                    {usersData?.items?.map((user: any) => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            {user.userName} ({user.email})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">
                                                Permite que este profissional acesse o sistema com suas próprias credenciais.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="ativo" className="text-base font-semibold">Status Ativo</Label>
                                                <p className="text-sm text-muted-foreground">O profissional poderá ser selecionado em processos.</p>
                                            </div>
                                            <Switch
                                                id="ativo"
                                                checked={watch("ativo")}
                                                onCheckedChange={(checked) => setValue("ativo", checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
