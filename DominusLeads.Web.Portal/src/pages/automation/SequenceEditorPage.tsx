import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
    Zap,
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    Send,
    MessageCircle,
    Clock,
    Brain,
    GitBranch,
    FileText,
    Split,
    ChevronDown,
    ChevronUp,
    Play,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import {
    getSequence,
    createSequence,
    updateSequence,
    StepType,
    StepTypeLabels,
    type CreateUpdateSequenceDto,
    type CreateUpdateSequenceStepDto,
} from "@/lib/services/SequenceService";

interface StepConfig {
    content?: string;
    mediaUrl?: string;
    provider?: string;
    channel?: string;
    timeoutHours?: number;
    onTimeout?: string;
    hours?: number;
    status?: number;
    noteContent?: string;
    field?: string;
    branches?: { value: string; label: string; goToStep: number }[];
}

const stepTypeIcons: Record<number, typeof Send> = {
    1: Send,
    2: MessageCircle,
    3: Clock,
    4: Brain,
    5: GitBranch,
    6: FileText,
    7: Split,
};

const stepTypeColors: Record<number, { bg: string; border: string; icon: string }> = {
    1: { bg: "bg-emerald-500/5", border: "border-emerald-500/30", icon: "text-emerald-500" },
    2: { bg: "bg-blue-500/5", border: "border-blue-500/30", icon: "text-blue-500" },
    3: { bg: "bg-amber-500/5", border: "border-amber-500/30", icon: "text-amber-500" },
    4: { bg: "bg-purple-500/5", border: "border-purple-500/30", icon: "text-purple-500" },
    5: { bg: "bg-sky-500/5", border: "border-sky-500/30", icon: "text-sky-500" },
    6: { bg: "bg-orange-500/5", border: "border-orange-500/30", icon: "text-orange-500" },
    7: { bg: "bg-pink-500/5", border: "border-pink-500/30", icon: "text-pink-500" },
};

const statusLabels: Record<number, string> = {
    1: "Novo",
    2: "Contatado",
    3: "Qualificado",
    4: "Proposta",
    5: "Fechado",
    6: "Descartado",
};

const availableStepTypes = [
    { type: StepType.SendMessage, description: "Envia mensagem de texto ou mídia via WhatsApp" },
    { type: StepType.WaitForReply, description: "Aguarda resposta do lead com timeout" },
    { type: StepType.Wait, description: "Espera um tempo antes do próximo passo" },
    { type: StepType.ClassifyResponse, description: "Classifica a última resposta com IA" },
    { type: StepType.UpdateStatus, description: "Move o lead no pipeline" },
    { type: StepType.AddNote, description: "Registra uma nota no lead" },
    { type: StepType.Condition, description: "Direciona o fluxo baseado na classificação" },
];

export default function SequenceEditorPage() {
    const params = useParams<{ id: string }>();
    const isNew = params.id === "new";
    const [, navigate] = useLocation();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [steps, setSteps] = useState<(CreateUpdateSequenceStepDto & { _key: string })[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [expandedStep, setExpandedStep] = useState<string | null>(null);
    const [showStepPicker, setShowStepPicker] = useState(false);

    useEffect(() => {
        if (!isNew && params.id) {
            loadSequence(params.id);
        }
    }, [params.id]);

    const loadSequence = async (id: string) => {
        try {
            setLoading(true);
            const res = await getSequence(id);
            setNome(res.data.nome);
            setDescricao(res.data.descricao || "");
            setIsActive(res.data.isActive);
            setSteps(
                res.data.steps
                    .sort((a, b) => a.order - b.order)
                    .map((s) => ({
                        order: s.order,
                        type: s.type,
                        config: s.config,
                        _key: crypto.randomUUID(),
                    }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar sequência.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!nome.trim()) {
            toast.error("Nome é obrigatório.");
            return;
        }
        if (steps.length === 0) {
            toast.error("Adicione pelo menos um step.");
            return;
        }

        setSaving(true);
        try {
            const input: CreateUpdateSequenceDto = {
                nome: nome.trim(),
                descricao: descricao.trim() || undefined,
                isActive,
                steps: steps.map((s, i) => ({
                    order: i + 1,
                    type: s.type,
                    config: s.config,
                })),
            };

            if (isNew) {
                await createSequence(input);
                toast.success("Sequência criada com sucesso!");
            } else {
                await updateSequence(params.id!, input);
                toast.success("Sequência atualizada com sucesso!");
            }
            navigate("/automation/sequences");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar sequência.");
        } finally {
            setSaving(false);
        }
    };

    const addStep = (type: number) => {
        const defaultConfigs: Record<number, string> = {
            [StepType.SendMessage]: JSON.stringify({ content: "Olá {{nomeFantasia}}! Sou da equipe Dominus. Podemos conversar?" }),
            [StepType.WaitForReply]: JSON.stringify({ timeoutHours: 24, onTimeout: "next" }),
            [StepType.Wait]: JSON.stringify({ hours: 24 }),
            [StepType.ClassifyResponse]: JSON.stringify({}),
            [StepType.UpdateStatus]: JSON.stringify({ status: 2 }),
            [StepType.AddNote]: JSON.stringify({ noteContent: "Contato automático realizado." }),
            [StepType.Condition]: JSON.stringify({
                field: "classification",
                branches: [
                    { value: "interesse", label: "Interesse", goToStep: 0 },
                    { value: "duvida", label: "Dúvida", goToStep: 0 },
                    { value: "sem_interesse", label: "Sem Interesse", goToStep: 0 },
                ],
            }),
        };

        const newStep = {
            order: steps.length + 1,
            type,
            config: defaultConfigs[type] || undefined,
            _key: crypto.randomUUID(),
        };
        setSteps([...steps, newStep]);
        setExpandedStep(newStep._key);
        setShowStepPicker(false);
    };

    const removeStep = (key: string) => {
        setSteps(steps.filter((s) => s._key !== key));
        if (expandedStep === key) setExpandedStep(null);
    };

    const moveStep = (key: string, direction: "up" | "down") => {
        const idx = steps.findIndex((s) => s._key === key);
        if (direction === "up" && idx > 0) {
            const newSteps = [...steps];
            [newSteps[idx - 1], newSteps[idx]] = [newSteps[idx], newSteps[idx - 1]];
            setSteps(newSteps);
        } else if (direction === "down" && idx < steps.length - 1) {
            const newSteps = [...steps];
            [newSteps[idx], newSteps[idx + 1]] = [newSteps[idx + 1], newSteps[idx]];
            setSteps(newSteps);
        }
    };

    const updateStepConfig = (key: string, config: string) => {
        setSteps(steps.map((s) => (s._key === key ? { ...s, config } : s)));
    };

    const getStepConfig = (step: typeof steps[0]): StepConfig => {
        try {
            return step.config ? JSON.parse(step.config) : {};
        } catch {
            return {};
        }
    };

    const updateConfigField = (key: string, field: string, value: unknown) => {
        const step = steps.find((s) => s._key === key);
        if (!step) return;
        const config = getStepConfig(step);
        (config as Record<string, unknown>)[field] = value;
        updateStepConfig(key, JSON.stringify(config));
    };

    if (loading) {
        return (
            <AppShell>
                <div className="p-6 text-center text-muted-foreground">Carregando...</div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/automation/sequences")}>
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="size-5 text-primary" />
                                {isNew ? "Nova Sequência" : "Editar Sequência"}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className="flex items-center gap-2 text-sm"
                            title={isActive ? "Desativar" : "Ativar"}
                        >
                            {isActive ? (
                                <>
                                    <ToggleRight className="size-6 text-emerald-500" />
                                    <span className="text-emerald-500 font-medium">Ativa</span>
                                </>
                            ) : (
                                <>
                                    <ToggleLeft className="size-6 text-muted-foreground" />
                                    <span className="text-muted-foreground">Inativa</span>
                                </>
                            )}
                        </button>
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            <Save className="size-4" />
                            {saving ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </div>

                {/* Sequence info */}
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nome da Sequência</label>
                            <Input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Qualificação Clínicas Médicas"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Descrição (opcional)</label>
                            <Textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva o objetivo desta sequência..."
                                className="resize-none"
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Steps Timeline */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        Steps
                        <Badge variant="secondary">{steps.length}</Badge>
                    </h2>

                    <div className="space-y-0">
                        {steps.map((step, index) => {
                            const Icon = stepTypeIcons[step.type] || FileText;
                            const colors = stepTypeColors[step.type] || stepTypeColors[1];
                            const config = getStepConfig(step);
                            const isExpanded = expandedStep === step._key;

                            return (
                                <div key={step._key} className="relative">
                                    {/* Timeline connector */}
                                    {index > 0 && (
                                        <div className="absolute left-7 -top-3 w-0.5 h-3 bg-border" />
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-7 -bottom-3 w-0.5 h-3 bg-border" />
                                    )}

                                    <Card className={cn("border", colors.border, colors.bg, "mb-3")}>
                                        {/* Step header */}
                                        <div
                                            className="flex items-center gap-3 p-3 cursor-pointer"
                                            onClick={() => setExpandedStep(isExpanded ? null : step._key)}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-5"
                                                    disabled={index === 0}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(step._key, "up"); }}
                                                >
                                                    <ChevronUp className="size-3" />
                                                </Button>
                                                <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-5"
                                                    disabled={index === steps.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(step._key, "down"); }}
                                                >
                                                    <ChevronDown className="size-3" />
                                                </Button>
                                            </div>

                                            <div className={cn("p-2 rounded-lg", colors.bg)}>
                                                <Icon className={cn("size-5", colors.icon)} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">{StepTypeLabels[step.type]}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {step.type === StepType.SendMessage && (config.content ? `"${config.content.substring(0, 60)}..."` : "Mensagem não configurada")}
                                                    {step.type === StepType.WaitForReply && `Timeout: ${config.timeoutHours || 24}h`}
                                                    {step.type === StepType.Wait && `Aguardar ${config.hours || 24}h`}
                                                    {step.type === StepType.ClassifyResponse && "Classifica com IA"}
                                                    {step.type === StepType.UpdateStatus && `Mover para: ${statusLabels[config.status || 1]}`}
                                                    {step.type === StepType.AddNote && (config.noteContent || "Nota automática")}
                                                    {step.type === StepType.Condition && `${(config.branches || []).length} branches`}
                                                </p>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 text-destructive shrink-0"
                                                onClick={(e) => { e.stopPropagation(); removeStep(step._key); }}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>

                                        {/* Expanded config panel */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-0">
                                                <Separator className="mb-3" />
                                                {renderConfigPanel(step, config, updateConfigField)}
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add step button */}
                    <div className="relative mt-4">
                        {steps.length > 0 && (
                            <div className="absolute left-7 -top-4 w-0.5 h-4 bg-border" />
                        )}
                        {showStepPicker ? (
                            <Card className="border-dashed border-2 border-primary/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center justify-between">
                                        Escolha o tipo de step
                                        <Button variant="ghost" size="sm" onClick={() => setShowStepPicker(false)}>✕</Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                                    {availableStepTypes.map(({ type, description }) => {
                                        const Icon = stepTypeIcons[type];
                                        const colors = stepTypeColors[type];
                                        return (
                                            <button
                                                key={type}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                                                    "hover:bg-accent/50",
                                                    colors.border
                                                )}
                                                onClick={() => addStep(type)}
                                            >
                                                <div className={cn("p-1.5 rounded", colors.bg)}>
                                                    <Icon className={cn("size-4", colors.icon)} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{StepTypeLabels[type]}</p>
                                                    <p className="text-xs text-muted-foreground">{description}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full border-dashed gap-2"
                                onClick={() => setShowStepPicker(true)}
                            >
                                <Plus className="size-4" />
                                Adicionar Step
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

// --- Config Panels per step type ---
function renderConfigPanel(
    step: { _key: string; type: number },
    config: StepConfig,
    updateField: (key: string, field: string, value: unknown) => void
) {
    switch (step.type) {
        case StepType.SendMessage:
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium mb-1 block">Provedor</label>
                            <select
                                value={config.provider || "evolution"}
                                onChange={(e) => updateField(step._key, "provider", e.target.value)}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                <option value="evolution">Evolution API</option>
                                <option value="twilio">Twilio</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1 block">Canal</label>
                            <select
                                value={config.channel || "whatsapp"}
                                onChange={(e) => updateField(step._key, "channel", e.target.value)}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                <option value="whatsapp">WhatsApp</option>
                                {config.provider === "twilio" && <option value="sms">SMS</option>}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium mb-1 block">Conteúdo da mensagem</label>
                        <Textarea
                            value={config.content || ""}
                            onChange={(e) => updateField(step._key, "content", e.target.value)}
                            placeholder="Digite a mensagem... Use {{nomeFantasia}}, {{cidade}}, {{razaoSocial}}"
                            rows={3}
                            className="resize-none text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Variáveis: {"{{nomeFantasia}}"} {"{{razaoSocial}}"} {"{{cidade}}"} {"{{uf}}"}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-medium mb-1 block">URL da mídia (opcional)</label>
                        <Input
                            value={config.mediaUrl || ""}
                            onChange={(e) => updateField(step._key, "mediaUrl", e.target.value)}
                            placeholder="https://exemplo.com/apresentacao.pdf"
                            className="text-sm"
                        />
                    </div>
                </div>
            );

        case StepType.WaitForReply:
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium mb-1 block">Timeout (horas)</label>
                        <Input
                            type="number"
                            value={config.timeoutHours || 24}
                            onChange={(e) => updateField(step._key, "timeoutHours", parseInt(e.target.value))}
                            min={1}
                            max={720}
                            className="text-sm w-32"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium mb-1 block">Ação no timeout</label>
                        <select
                            value={config.onTimeout || "next"}
                            onChange={(e) => updateField(step._key, "onTimeout", e.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        >
                            <option value="next">Avançar para próximo step</option>
                            <option value="stop">Encerrar sequência</option>
                        </select>
                    </div>
                </div>
            );

        case StepType.Wait:
            return (
                <div>
                    <label className="text-xs font-medium mb-1 block">Tempo de espera (horas)</label>
                    <Input
                        type="number"
                        value={config.hours || 24}
                        onChange={(e) => updateField(step._key, "hours", parseInt(e.target.value))}
                        min={1}
                        max={720}
                        className="text-sm w-32"
                    />
                </div>
            );

        case StepType.ClassifyResponse:
            return (
                <div className="text-sm text-muted-foreground">
                    <p>A IA classificará automaticamente a última resposta do lead em:</p>
                    <div className="flex gap-2 mt-2">
                        <Badge className="bg-emerald-500/10 text-emerald-500">Interesse</Badge>
                        <Badge className="bg-amber-500/10 text-amber-500">Dúvida</Badge>
                        <Badge className="bg-red-500/10 text-red-500">Sem Interesse</Badge>
                        <Badge className="bg-slate-500/10 text-slate-500">Spam</Badge>
                    </div>
                </div>
            );

        case StepType.UpdateStatus:
            return (
                <div>
                    <label className="text-xs font-medium mb-1 block">Novo status do lead</label>
                    <select
                        value={config.status || 1}
                        onChange={(e) => updateField(step._key, "status", parseInt(e.target.value))}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            );

        case StepType.AddNote:
            return (
                <div>
                    <label className="text-xs font-medium mb-1 block">Conteúdo da nota</label>
                    <Textarea
                        value={config.noteContent || ""}
                        onChange={(e) => updateField(step._key, "noteContent", e.target.value)}
                        placeholder="Nota a ser registrada no lead..."
                        rows={2}
                        className="resize-none text-sm"
                    />
                </div>
            );

        case StepType.Condition:
            return (
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                        Direciona o fluxo baseado na classificação da última resposta.
                    </p>
                    <div className="space-y-2">
                        {(config.branches || []).map((branch, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="shrink-0">{branch.label || branch.value}</Badge>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-muted-foreground">Step definido no motor de execução</span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        default:
            return <p className="text-sm text-muted-foreground">Configuração não disponível.</p>;
    }
}
