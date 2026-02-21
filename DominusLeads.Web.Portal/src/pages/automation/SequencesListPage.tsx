import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
    Zap,
    Plus,
    Play,
    Pause,
    Pencil,
    Trash2,
    ListChecks,
    Send,
    Clock,
    Brain,
    GitBranch,
    FileText,
    Split,
    MessageCircle,
    ChevronRight,
    Activity,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
    getSequences,
    deleteSequence,
    toggleSequenceActive,
    type SequenceDto,
    StepTypeLabels
} from "@/lib/services/SequenceService";

const stepTypeIcons: Record<number, typeof Send> = {
    1: Send,
    2: MessageCircle,
    3: Clock,
    4: Brain,
    5: GitBranch,
    6: FileText,
    7: Split,
};

const stepTypeColors: Record<number, string> = {
    1: "bg-emerald-500/10 text-emerald-500",
    2: "bg-blue-500/10 text-blue-500",
    3: "bg-amber-500/10 text-amber-500",
    4: "bg-purple-500/10 text-purple-500",
    5: "bg-sky-500/10 text-sky-500",
    6: "bg-orange-500/10 text-orange-500",
    7: "bg-pink-500/10 text-pink-500",
};

export default function SequencesListPage() {
    const [sequences, setSequences] = useState<SequenceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [, navigate] = useLocation();

    useEffect(() => {
        fetchSequences();
    }, []);

    const fetchSequences = async () => {
        try {
            setLoading(true);
            const res = await getSequences();
            setSequences(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar sequências.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta sequência?")) return;
        try {
            await deleteSequence(id);
            toast.success("Sequência excluída.");
            fetchSequences();
        } catch {
            toast.error("Erro ao excluir sequência.");
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await toggleSequenceActive(id);
            toast.success("Status atualizado.");
            fetchSequences();
        } catch {
            toast.error("Erro ao alterar status.");
        }
    };

    return (
        <AppShell>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="size-6 text-primary" />
                            Sequências de Prospecção
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Crie fluxos automatizados para qualificar leads via WhatsApp
                        </p>
                    </div>
                    <Button onClick={() => navigate("/automation/sequences/new")} className="gap-2">
                        <Plus className="size-4" />
                        Nova Sequência
                    </Button>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ListChecks className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Sequências</p>
                                <p className="text-xl font-bold">{sequences.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Play className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ativas</p>
                                <p className="text-xl font-bold">{sequences.filter(s => s.isActive).length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Activity className="size-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Execuções Ativas</p>
                                <p className="text-xl font-bold">{sequences.reduce((acc, s) => acc + s.executionCount, 0)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sequences grid */}
                {loading ? (
                    <div className="text-center text-muted-foreground py-12">Carregando...</div>
                ) : sequences.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center space-y-4">
                            <Zap className="size-12 text-muted-foreground/30 mx-auto" />
                            <div>
                                <p className="text-lg font-medium">Nenhuma sequência criada</p>
                                <p className="text-sm text-muted-foreground">
                                    Crie sua primeira sequência para começar a automatizar a prospecção
                                </p>
                            </div>
                            <Button onClick={() => navigate("/automation/sequences/new")} className="gap-2">
                                <Plus className="size-4" />
                                Criar Primeira Sequência
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sequences.map((seq) => (
                            <Card key={seq.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0" onClick={() => navigate(`/automation/sequences/${seq.id}`)}>
                                            <CardTitle className="text-base truncate">{seq.nome}</CardTitle>
                                            {seq.descricao && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {seq.descricao}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="ml-2 shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(seq.id);
                                            }}
                                            title={seq.isActive ? "Desativar" : "Ativar"}
                                        >
                                            {seq.isActive ? (
                                                <ToggleRight className="size-6 text-emerald-500" />
                                            ) : (
                                                <ToggleLeft className="size-6 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3" onClick={() => navigate(`/automation/sequences/${seq.id}`)}>
                                    {/* Step pipeline visualization */}
                                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                                        {seq.steps.sort((a, b) => a.order - b.order).map((step, i) => {
                                            const Icon = stepTypeIcons[step.type] || FileText;
                                            return (
                                                <div key={step.id} className="flex items-center gap-1 shrink-0">
                                                    <div
                                                        className={cn(
                                                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                                                            stepTypeColors[step.type] || "bg-slate-500/10 text-slate-500"
                                                        )}
                                                        title={StepTypeLabels[step.type]}
                                                    >
                                                        <Icon className="size-3" />
                                                        <span className="hidden sm:inline">{StepTypeLabels[step.type]}</span>
                                                    </div>
                                                    {i < seq.steps.length - 1 && (
                                                        <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer stats */}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <ListChecks className="size-3" />
                                                {seq.steps.length} steps
                                            </span>
                                            {seq.executionCount > 0 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Activity className="size-3 mr-1" />
                                                    {seq.executionCount} executando
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/automation/sequences/${seq.id}`);
                                                }}
                                            >
                                                <Pencil className="size-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(seq.id);
                                                }}
                                            >
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
