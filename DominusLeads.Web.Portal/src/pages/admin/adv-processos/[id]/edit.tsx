import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { useAdvProcessoses, useUpdateAdvProcessos } from "@/lib/abp/hooks/useAdvProcessoses";
import {
    Save,
    X,
    FileText,
    MapPin,
    Users,
    DollarSign,
    Calendar,
    Scale,
    CreditCard,
    MessageSquare,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    // Dados Básicos
    numero: z.string().min(1, "Número do processo é obrigatório"),
    idCliente: z.number().optional().nullable(),
    idTipo: z.number().optional().nullable(),
    idStatus: z.number().optional().nullable(),
    idFase: z.number().optional().nullable(),
    idNatureza: z.number().optional().nullable(),
    sintese: z.string().optional().nullable(),

    // Localização
    estado: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    idOrgao: z.number().optional().nullable(),
    idInstancia: z.number().optional().nullable(),
    idVara: z.number().optional().nullable(),

    // Partes
    nomeReu: z.string().optional().nullable(),
    idEscritorioResponsavel: z.number().optional().nullable(),
    idResponsavel: z.number().optional().nullable(),
    idAutorPeticao: z.number().optional().nullable(),
    nomeResponsavel: z.string().optional().nullable(),
    cpfResponsavel: z.string().optional().nullable(),

    // Valores
    valorCausa: z.number().optional().nullable(),
    valorHonorarios: z.number().optional().nullable(),
    valorHonorariosTipo: z.string().optional().nullable(),
    valorDeferido: z.number().optional().nullable(),
    imposto: z.number().optional().nullable(),
    tarifa: z.number().optional().nullable(),
    sucumbencia: z.number().optional().nullable(),

    // Datas
    dataDistribuicao: z.string().optional().nullable(),
    dataSentenca: z.string().optional().nullable(),
    dataEncerramento: z.string().optional().nullable(),

    // Características
    recurso: z.boolean().optional().nullable(),
    alvara: z.boolean().optional().nullable(),
    alvaraPendente: z.boolean().optional().nullable(),
    acaoColetiva: z.boolean().optional().nullable(),
    idSentenca: z.number().optional().nullable(),
    idProbabilidade: z.number().optional().nullable(),
    idRelevancia: z.number().optional().nullable(),

    // Recebimentos
    recebeRPV: z.boolean().optional().nullable(),
    recebePrecatorio: z.boolean().optional().nullable(),
    recebeAcordo: z.boolean().optional().nullable(),
    recebeAlvara: z.boolean().optional().nullable(),
    bancarioBanco: z.string().optional().nullable(),
    bancarioAgencia: z.string().optional().nullable(),
    bancarioConta: z.string().optional().nullable(),
    bancarioFavorecido: z.string().optional().nullable(),
    bancarioCpf: z.string().optional().nullable(),

    // Observações
    observacoes: z.string().optional().nullable(),
    ativo: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const sections = [
    { id: "basico", label: "Dados Básicos", icon: FileText },
    { id: "localizacao", label: "Localização", icon: MapPin },
    { id: "partes", label: "Partes Envolvidas", icon: Users },
    { id: "valores", label: "Valores", icon: DollarSign },
    { id: "datas", label: "Datas", icon: Calendar },
    { id: "caracteristicas", label: "Características", icon: Scale },
    { id: "recebimentos", label: "Recebimentos", icon: CreditCard },
    { id: "observacoes", label: "Observações", icon: MessageSquare },
];

export default function EditProcessPage() {
    const params = useParams();
    const processId = params.id;
    const [, setLocation] = useLocation();
    const [activeSection, setActiveSection] = useState("basico");

    const { data: processesData, isLoading: isLoadingProcess } = useAdvProcessoses({});
    const updateMutation = useUpdateAdvProcessos();

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

    // Load process data
    useEffect(() => {
        if (processesData?.items && processId) {
            const process = processesData.items.find((p: any) => p.id === processId);
            if (process) {
                // Formatting dates for input type="date"
                const formattedProcess = { ...process };
                if (formattedProcess.dataDistribuicao) formattedProcess.dataDistribuicao = formattedProcess.dataDistribuicao.split('T')[0];
                if (formattedProcess.dataSentenca) formattedProcess.dataSentenca = formattedProcess.dataSentenca.split('T')[0];
                if (formattedProcess.dataEncerramento) formattedProcess.dataEncerramento = formattedProcess.dataEncerramento.split('T')[0];

                reset(formattedProcess);
            }
        }
    }, [processesData, processId, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            await updateMutation.mutateAsync({ id: processId, data: data as any });
            toast.success("Processo atualizado com sucesso");
            setLocation("/admin/adv-processos");
        } catch (error: any) {
            console.error("Failed to update process:", error);
            toast.error(error.message || "Falha ao atualizar processo");
        }
    };

    if (isLoadingProcess) {
        return (
            <Shell>
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation("/admin/adv-processos")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Editar Processo</h1>
                            <p className="text-muted-foreground">
                                Atualize os dados do processo jurídico
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setLocation("/admin/adv-processos")}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="gap-2 shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="col-span-3">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-base">Seções do Formulário</CardTitle>
                                <CardDescription>
                                    Navegue pelas seções do cadastro
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <nav className="space-y-1 p-2">
                                    {sections.map((section) => {
                                        const Icon = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                    activeSection === section.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {section.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Content */}
                    <div className="col-span-9">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Dados Básicos */}
                            {activeSection === "basico" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Dados Básicos
                                        </CardTitle>
                                        <CardDescription>
                                            Informações fundamentais do processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="numero">
                                                    Número do Processo <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="numero"
                                                    placeholder="0000000-00.0000.0.00.0000"
                                                    {...register("numero")}
                                                />
                                                {errors.numero && (
                                                    <p className="text-sm text-destructive">{errors.numero.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idCliente">Cliente</Label>
                                                <Input
                                                    id="idCliente"
                                                    type="number"
                                                    placeholder="ID do cliente"
                                                    {...register("idCliente", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="idTipo">Tipo de Processo</Label>
                                                <Select
                                                    value={watch("idTipo")?.toString()}
                                                    onValueChange={(value) => setValue("idTipo", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Trabalhista</SelectItem>
                                                        <SelectItem value="2">Previdenciário</SelectItem>
                                                        <SelectItem value="3">Cível</SelectItem>
                                                        <SelectItem value="4">Criminal</SelectItem>
                                                        <SelectItem value="5">Tributário</SelectItem>
                                                        <SelectItem value="6">Família</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idStatus">Status</Label>
                                                <Select
                                                    value={watch("idStatus")?.toString()}
                                                    onValueChange={(value) => setValue("idStatus", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Em Andamento</SelectItem>
                                                        <SelectItem value="2">Concluído</SelectItem>
                                                        <SelectItem value="3">Suspenso</SelectItem>
                                                        <SelectItem value="4">Arquivado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idFase">Fase Processual</Label>
                                                <Select
                                                    value={watch("idFase")?.toString()}
                                                    onValueChange={(value) => setValue("idFase", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a fase" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Inicial</SelectItem>
                                                        <SelectItem value="2">Instrução</SelectItem>
                                                        <SelectItem value="3">Sentença</SelectItem>
                                                        <SelectItem value="4">Recurso</SelectItem>
                                                        <SelectItem value="5">Execução</SelectItem>
                                                        <SelectItem value="6">Trânsito em Julgado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="sintese">Síntese do Processo</Label>
                                            <Textarea
                                                id="sintese"
                                                placeholder="Breve descrição do processo..."
                                                rows={3}
                                                {...register("sintese")}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="ativo">Processo Ativo</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Processo está ativo no sistema
                                                </p>
                                            </div>
                                            <Switch
                                                id="ativo"
                                                checked={watch("ativo")}
                                                onCheckedChange={(checked) => setValue("ativo", checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Localização */}
                            {activeSection === "localizacao" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Localização e Jurisdição
                                        </CardTitle>
                                        <CardDescription>
                                            Informações sobre a localização e órgão julgador
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="estado">Estado</Label>
                                                <Select
                                                    value={watch("estado") || undefined}
                                                    onValueChange={(value) => setValue("estado", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SP">São Paulo</SelectItem>
                                                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                                        <SelectItem value="MG">Minas Gerais</SelectItem>
                                                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                                        <SelectItem value="PR">Paraná</SelectItem>
                                                        <SelectItem value="SC">Santa Catarina</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cidade">Cidade</Label>
                                                <Input
                                                    id="cidade"
                                                    placeholder="Nome da cidade"
                                                    {...register("cidade")}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="idOrgao">Órgão Julgador</Label>
                                                <Input
                                                    id="idOrgao"
                                                    type="number"
                                                    placeholder="ID do órgão"
                                                    {...register("idOrgao", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idInstancia">Instância</Label>
                                                <Select
                                                    value={watch("idInstancia")?.toString()}
                                                    onValueChange={(value) => setValue("idInstancia", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1ª Instância</SelectItem>
                                                        <SelectItem value="2">2ª Instância</SelectItem>
                                                        <SelectItem value="3">Tribunais Superiores</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idVara">Vara</Label>
                                                <Input
                                                    id="idVara"
                                                    type="number"
                                                    placeholder="ID da vara"
                                                    {...register("idVara", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Partes Envolvidas */}
                            {activeSection === "partes" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Partes Envolvidas
                                        </CardTitle>
                                        <CardDescription>
                                            Informações sobre as partes do processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nomeReu">Réu/Reclamado</Label>
                                            <Input
                                                id="nomeReu"
                                                placeholder="Nome do réu ou reclamado"
                                                {...register("nomeReu")}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="idEscritorioResponsavel">Escritório Responsável</Label>
                                                <Input
                                                    id="idEscritorioResponsavel"
                                                    type="number"
                                                    placeholder="ID do escritório"
                                                    {...register("idEscritorioResponsavel", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idResponsavel">Advogado Responsável</Label>
                                                <Input
                                                    id="idResponsavel"
                                                    type="number"
                                                    placeholder="ID do advogado"
                                                    {...register("idResponsavel", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="idAutorPeticao">Autor da Petição</Label>
                                            <Input
                                                id="idAutorPeticao"
                                                type="number"
                                                placeholder="ID do autor"
                                                {...register("idAutorPeticao", { valueAsNumber: true })}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
                                                <Input
                                                    id="nomeResponsavel"
                                                    placeholder="Nome completo"
                                                    {...register("nomeResponsavel")}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cpfResponsavel">CPF do Responsável</Label>
                                                <Input
                                                    id="cpfResponsavel"
                                                    placeholder="000.000.000-00"
                                                    {...register("cpfResponsavel")}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Valores */}
                            {activeSection === "valores" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Valores
                                        </CardTitle>
                                        <CardDescription>
                                            Valores financeiros relacionados ao processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="valorCausa">Valor da Causa (R$)</Label>
                                                <Input
                                                    id="valorCausa"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("valorCausa", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="valorDeferido">Valor Deferido (R$)</Label>
                                                <Input
                                                    id="valorDeferido"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("valorDeferido", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="valorHonorarios">Honorários (R$)</Label>
                                                <Input
                                                    id="valorHonorarios"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("valorHonorarios", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="valorHonorariosTipo">Tipo de Honorários</Label>
                                                <Select
                                                    value={watch("valorHonorariosTipo") || undefined}
                                                    onValueChange={(value) => setValue("valorHonorariosTipo", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fixo">Fixo</SelectItem>
                                                        <SelectItem value="percentual">Percentual</SelectItem>
                                                        <SelectItem value="exitoso">Êxito</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="imposto">Imposto (R$)</Label>
                                                <Input
                                                    id="imposto"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("imposto", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="tarifa">Tarifa (R$)</Label>
                                                <Input
                                                    id="tarifa"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("tarifa", { valueAsNumber: true })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="sucumbencia">Sucumbência (R$)</Label>
                                                <Input
                                                    id="sucumbencia"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...register("sucumbencia", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Datas */}
                            {activeSection === "datas" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Datas
                                        </CardTitle>
                                        <CardDescription>
                                            Datas importantes do processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="dataDistribuicao">Data de Distribuição</Label>
                                                <Input
                                                    id="dataDistribuicao"
                                                    type="date"
                                                    {...register("dataDistribuicao")}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dataSentenca">Data da Sentença</Label>
                                                <Input
                                                    id="dataSentenca"
                                                    type="date"
                                                    {...register("dataSentenca")}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dataEncerramento">Data de Encerramento</Label>
                                                <Input
                                                    id="dataEncerramento"
                                                    type="date"
                                                    {...register("dataEncerramento")}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Características */}
                            {activeSection === "caracteristicas" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Scale className="h-5 w-5" />
                                            Características do Processo
                                        </CardTitle>
                                        <CardDescription>
                                            Características e classificações do processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="recurso">Possui Recurso</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Processo possui recurso interposto
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="recurso"
                                                    checked={!!watch("recurso")}
                                                    onCheckedChange={(checked) => setValue("recurso", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="alvara">Alvará Expedido</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Alvará já foi expedido
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="alvara"
                                                    checked={!!watch("alvara")}
                                                    onCheckedChange={(checked) => setValue("alvara", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="alvaraPendente">Alvará Pendente</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Aguardando expedição de alvará
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="alvaraPendente"
                                                    checked={!!watch("alvaraPendente")}
                                                    onCheckedChange={(checked) => setValue("alvaraPendente", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="acaoColetiva">Ação Coletiva</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Processo é uma ação coletiva
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="acaoColetiva"
                                                    checked={!!watch("acaoColetiva")}
                                                    onCheckedChange={(checked) => setValue("acaoColetiva", checked)}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="idProbabilidade">Probabilidade de Êxito</Label>
                                                <Select
                                                    value={watch("idProbabilidade")?.toString()}
                                                    onValueChange={(value) => setValue("idProbabilidade", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Alta</SelectItem>
                                                        <SelectItem value="2">Média</SelectItem>
                                                        <SelectItem value="3">Baixa</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="idRelevancia">Relevância</Label>
                                                <Select
                                                    value={watch("idRelevancia")?.toString()}
                                                    onValueChange={(value) => setValue("idRelevancia", parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Alta</SelectItem>
                                                        <SelectItem value="2">Média</SelectItem>
                                                        <SelectItem value="3">Baixa</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recebimentos */}
                            {activeSection === "recebimentos" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Recebimentos e Dados Bancários
                                        </CardTitle>
                                        <CardDescription>
                                            Informações sobre recebimentos e dados bancários
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="recebeRPV">Recebe RPV</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Requisição de Pequeno Valor
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="recebeRPV"
                                                    checked={!!watch("recebeRPV")}
                                                    onCheckedChange={(checked) => setValue("recebeRPV", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="recebePrecatorio">Recebe Precatório</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Precatório judicial
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="recebePrecatorio"
                                                    checked={!!watch("recebePrecatorio")}
                                                    onCheckedChange={(checked) => setValue("recebePrecatorio", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="recebeAcordo">Recebe Acordo</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Recebimento via acordo
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="recebeAcordo"
                                                    checked={!!watch("recebeAcordo")}
                                                    onCheckedChange={(checked) => setValue("recebeAcordo", checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="recebeAlvara">Recebe Alvará</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Recebimento via alvará
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="recebeAlvara"
                                                    checked={!!watch("recebeAlvara")}
                                                    onCheckedChange={(checked) => setValue("recebeAlvara", checked)}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Dados Bancários</h4>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="bancarioBanco">Banco</Label>
                                                    <Input
                                                        id="bancarioBanco"
                                                        placeholder="Nome do banco"
                                                        {...register("bancarioBanco")}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bancarioAgencia">Agência</Label>
                                                    <Input
                                                        id="bancarioAgencia"
                                                        placeholder="0000"
                                                        {...register("bancarioAgencia")}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="bancarioConta">Conta</Label>
                                                    <Input
                                                        id="bancarioConta"
                                                        placeholder="00000-0"
                                                        {...register("bancarioConta")}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bancarioFavorecido">Favorecido</Label>
                                                    <Input
                                                        id="bancarioFavorecido"
                                                        placeholder="Nome do favorecido"
                                                        {...register("bancarioFavorecido")}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bancarioCpf">CPF do Favorecido</Label>
                                                <Input
                                                    id="bancarioCpf"
                                                    placeholder="000.000.000-00"
                                                    {...register("bancarioCpf")}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Observações */}
                            {activeSection === "observacoes" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5" />
                                            Observações e Informações Adicionais
                                        </CardTitle>
                                        <CardDescription>
                                            Informações complementares sobre o processo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="observacoes">Observações Gerais</Label>
                                            <Textarea
                                                id="observacoes"
                                                placeholder="Adicione observações relevantes sobre o processo..."
                                                rows={6}
                                                {...register("observacoes")}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
