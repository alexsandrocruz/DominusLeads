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
    Clock,
    FileText,
    Users,
    MapPin,
    AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";
import { useCreateAdvCompromissos } from "@/lib/abp/hooks/useAdvCompromissoses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function CreateAdvCompromissoPage() {
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("basic");
    const createMutation = useCreateAdvCompromissos();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pauta: false,
            ativo: true,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success("Compromisso agendado com sucesso!");
            setLocation("/admin/adv-compromissos");
        } catch (error: any) {
            toast.error(error.message || "Erro ao agendar compromisso");
        }
    };

    const sections = [
        { id: "basic", label: "Dados Básicos", icon: FileText },
        { id: "times", label: "Prazos e Horários", icon: Clock },
        { id: "location", label: "Local e Pauta", icon: MapPin },
        { id: "context", label: "Relacionamentos", icon: Users },
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
                            onClick={() => setLocation("/admin/adv-compromissos")}
                            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Novo Compromisso</h1>
                            <p className="text-muted-foreground text-sm">Agende uma nova audiência ou prazo jurídico</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setLocation("/admin/adv-compromissos")}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2 shadow-lg shadow-primary/20">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Agendar
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
                                        Informações Gerais
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao">Descrição do Compromisso</Label>
                                            <Input
                                                id="descricao"
                                                placeholder="Ex: Audiência de Conciliação"
                                                {...register("descricao")}
                                                className={cn(errors.descricao && "border-destructive")}
                                            />
                                            {errors.descricao && (
                                                <p className="text-xs text-destructive">{errors.descricao.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idTipoCompromisso">Tipo de Compromisso</Label>
                                            <Input
                                                id="idTipoCompromisso"
                                                type="number"
                                                placeholder="Selecione o tipo..."
                                                {...register("idTipoCompromisso", { valueAsNumber: true })}
                                                className={cn(errors.idTipoCompromisso && "border-destructive")}
                                            />
                                            {errors.idTipoCompromisso && (
                                                <p className="text-xs text-destructive">{errors.idTipoCompromisso.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "times" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Prazos e Cronograma
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="dataPrazoInterno">Prazo Interno</Label>
                                            <Input id="dataPrazoInterno" type="date" {...register("dataPrazoInterno")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dataPrazoFatal" className="text-destructive flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" /> Prazo Fatal
                                            </Label>
                                            <Input id="dataPrazoFatal" type="date" {...register("dataPrazoFatal")} className="border-destructive/30 focus-visible:ring-destructive" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="horarioInicial">Início (HHMM)</Label>
                                            <Input id="horarioInicial" type="number" placeholder="0900" {...register("horarioInicial", { valueAsNumber: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="horarioFinal">Fim (HHMM)</Label>
                                            <Input id="horarioFinal" type="number" placeholder="1030" {...register("horarioFinal", { valueAsNumber: true })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "location" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Localização e Organização
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="onde">Onde ocorrerá?</Label>
                                            <Input id="onde" placeholder="Ex: Fórum Central - Sala 202" {...register("onde")} />
                                        </div>
                                        <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-xl border border-primary/10 transition-colors hover:bg-primary/10">
                                            <Checkbox
                                                id="pauta"
                                                checked={watch("pauta")}
                                                onCheckedChange={(checked) => setValue("pauta", !!checked)}
                                            />
                                            <label htmlFor="pauta" className="text-sm font-medium leading-none cursor-pointer">
                                                Incluir na pauta de julgamentos?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "context" && (
                                <div className="space-y-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Contexto Jurídico
                                    </h3>
                                    <div className="space-y-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
                                        <p>Vincule este compromisso a um processo existente para facilitar a gestão.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idProcesso">ID do Processo</Label>
                                        <Input id="idProcesso" type="number" {...register("idProcesso", { valueAsNumber: true })} />
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
