import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
    Plus,
    Play,
    Pause,
    BarChart2,
    MessageSquare,
    Mail,
    Smartphone,
    TrendingUp,
    Users,
    Zap,
    Clock,
    X,
    Check
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getCampaigns, createCampaign, type CampaignDto } from "@/lib/services/CampaignService";
import { getSequences } from "@/lib/services/SequenceService";
import { toast } from "sonner";

export default function CampaignListPage() {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Campaign Form
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [selectedSequenceId, setSelectedSequenceId] = useState("");
    const [sequences, setSequences] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        console.log("[CampaignListPage] Fetching data...");
        try {
            const [campResp, seqResp] = await Promise.all([
                getCampaigns(),
                getSequences()
            ]);
            console.log("[CampaignListPage] Campaigns:", campResp.data);
            console.log("[CampaignListPage] Sequences:", seqResp.data);
            setCampaigns(campResp.data.items || []);
            setSequences(seqResp.data || []);
        } catch (err) {
            console.error("[CampaignListPage] Fetch error:", err);
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!newName || !selectedSequenceId) {
            toast.error("Preencha o nome e selecione uma sequência");
            return;
        }
        setIsSubmitting(true);
        try {
            await createCampaign({
                name: newName,
                description: newDescription,
                sequenceId: selectedSequenceId
            });
            toast.success("Campanha criada com sucesso");
            setIsCreateModalOpen(false);
            setNewName("");
            setNewDescription("");
            setSelectedSequenceId("");
            fetchData();
        } catch (err) {
            toast.error("Erro ao criar campanha");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = [
        { label: "Campanhas Ativas", value: campaigns.filter(c => c.status === 2).length.toString(), icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "Leads em Automação", value: campaigns.reduce((acc, c) => acc + c.leadCount, 0).toString(), icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Sequências Prontas", value: sequences.length.toString(), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    return (
        <AppShell>
            <div className="max-w-6xl mx-auto space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Gerenciamento de Campanhas</h1>
                        <p className="text-muted-foreground font-medium italic">Visualize e controle seus robôs de prospecção e engajamento.</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-12 px-6 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus className="size-4" />
                        Nova Campanha
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <BarChart2 className="size-5 text-primary" />
                        Atividade Recente
                    </h3>

                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
                    ) : campaigns.length > 0 ? (
                        <div className="grid gap-4">
                            {campaigns.map((camp) => (
                                <Card key={camp.id} className="border-muted hover:border-primary/20 transition-all rounded-[2rem] overflow-hidden group bg-white shadow-lg shadow-slate-200/40">
                                    <CardContent className="p-0">
                                        <div className="grid md:grid-cols-12 items-center divide-x divide-muted">
                                            <div className="md:col-span-6 p-6 flex items-center gap-4">
                                                <div className={cn(
                                                    "size-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                                                    camp.status === 2 ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    {camp.status === 2 ? <Play className="size-5 fill-current" /> : <Clock className="size-5" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] font-black uppercase text-primary border-primary/20">
                                                            {camp.sequenceName || 'Sem Sequência'}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground font-bold italic">Criada em {new Date(camp.creationTime).toLocaleDateString()}</span>
                                                    </div>
                                                    <h4 className="text-md font-black tracking-tight group-hover:text-primary transition-colors">{camp.name}</h4>
                                                </div>
                                            </div>
                                            <div className="md:col-span-4 p-6 grid grid-cols-2 gap-6 bg-muted/5">
                                                <div>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Leads</p>
                                                    <p className="text-sm font-black">{camp.leadCount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                                    <div className="flex items-center gap-1">
                                                        <div className={cn("size-2 rounded-full", camp.status === 2 ? "bg-emerald-500" : "bg-slate-300")} />
                                                        <p className="text-[10px] font-black uppercase">{camp.status === 2 ? "Ativa" : "Rascunho"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 p-6 flex items-center justify-center gap-3">
                                                <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => setLocation("/automation/sequences")}>
                                                    Ver Fluxo
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-muted rounded-[2rem] bg-muted/5">
                            <Zap className="size-10 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-sm font-bold text-muted-foreground">Nenhuma campanha criada ainda.</p>
                            <Button variant="link" onClick={() => setIsCreateModalOpen(true)} className="text-primary font-black">Começar agora</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-none">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter">Nova Campanha</h2>
                                    <p className="text-muted-foreground font-medium italic text-xs">Configure o nome e a estratégia de automação.</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)} className="rounded-full">
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome da Campanha</label>
                                    <Input
                                        placeholder="Ex: Prospecção Odontos Aracaju"
                                        className="h-12 rounded-xl focus-visible:ring-primary/20"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sequência de Automação</label>
                                    <select
                                        className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                        value={selectedSequenceId}
                                        onChange={(e) => setSelectedSequenceId(e.target.value)}
                                    >
                                        <option value="">Selecione uma sequência...</option>
                                        {sequences.map(s => (
                                            <option key={s.id} value={s.id}>{s.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Descrição (Opcional)</label>
                                    <textarea
                                        className="w-full min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        placeholder="Descreva o objetivo desta campanha..."
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-12 rounded-xl font-black">Cancelar</Button>
                                <Button
                                    onClick={handleCreateCampaign}
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 rounded-xl font-black shadow-lg shadow-primary/20"
                                >
                                    {isSubmitting ? "Criando..." : "Criar Campanha"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </AppShell>
    );
}
