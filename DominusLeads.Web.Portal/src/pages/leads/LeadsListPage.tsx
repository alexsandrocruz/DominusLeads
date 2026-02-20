import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
    Users,
    Search,
    Filter,
    LayoutGrid,
    List as ListIcon,
    Building,
    MapPin,
    Database,
    X,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { getLeads, updateLeadStatus, type LeadDto } from "@/lib/services/LeadService";
import { KanbanBoard, LeadStatus } from "./KanbanBoard";
import { toast } from "sonner";
import { Separator } from "@/components/ui/Separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export default function LeadsListPage() {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<LeadDto[]>([]);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCnae, setFilterCnae] = useState("");
    const [filterCidade, setFilterCidade] = useState("");
    const [filterStatus, setFilterStatus] = useState<number | null>(null);

    useEffect(() => {
        fetchLeads();
    }, [filterStatus]); // Re-fetch only on status filter for now, or use local filtering

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            // Note: Filter, Cnae and Cidade will be handled locally for better UX 
            // but the API supports them if needed.
            const response = await getLeads(params);
            setLeads(response.data.items || []);
        } catch (err) {
            console.error("Erro ao buscar leads:", err);
            toast.error("Erro ao carregar leads");
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = !searchTerm ||
                (lead.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.cnpj?.includes(searchTerm));

            const matchesCnae = !filterCnae || lead.cnaePrincipal?.includes(filterCnae);
            const matchesCidade = !filterCidade || lead.cidade?.toLowerCase().includes(filterCidade.toLowerCase());

            return matchesSearch && matchesCnae && matchesCidade;
        });
    }, [leads, searchTerm, filterCnae, filterCidade]);

    const handleStatusChange = async (leadId: string, newStatus: number) => {
        try {
            // Optimistic update
            const oldLeads = [...leads];
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

            await updateLeadStatus(leadId, newStatus);
            toast.success("Status atualizado com sucesso");
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
            toast.error("Erro ao atualizar status do lead");
            fetchLeads(); // Rollback
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterCnae("");
        setFilterCidade("");
        setFilterStatus(null);
    };

    const hasActiveFilters = searchTerm || filterCnae || filterCidade || filterStatus;

    return (
        <AppShell>
            <div className="space-y-6 h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">CRM — Pipeline</h1>
                        <p className="text-muted-foreground font-medium italic text-sm">Gerencie o progresso de suas conversões em tempo real.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-muted/50 p-1 rounded-lg border border-muted flex items-center gap-1">
                            <Button
                                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 gap-2 font-bold px-3"
                                onClick={() => setViewMode('kanban')}
                            >
                                <LayoutGrid className="size-4" />
                                Kanban
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 gap-2 font-bold px-3"
                                onClick={() => setViewMode('list')}
                            >
                                <ListIcon className="size-4" />
                                Lista
                            </Button>
                        </div>
                        <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                            <Users className="h-4 w-4" />
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Buscar por empresa ou CNPJ..."
                            className="pl-10 h-11 bg-white border-muted shadow-sm focus-visible:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto relative">
                        <Button
                            variant="outline"
                            className={cn(
                                "h-11 gap-2 font-bold border-muted bg-white shadow-sm flex-1 md:flex-none",
                                showFilters && "border-primary text-primary bg-primary/5"
                            )}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="size-4" />
                            Filtros Avançados
                            {hasActiveFilters && (
                                <Badge className="ml-1 h-5 px-1 bg-primary text-primary-foreground min-w-[20px] justify-center">
                                    !
                                </Badge>
                            )}
                            <ChevronDown className={cn("size-3 transition-transform", showFilters && "rotate-180")} />
                        </Button>

                        {showFilters && (
                            <div className="absolute top-12 right-0 w-80 p-4 space-y-4 bg-white border border-muted rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="space-y-2">
                                    <h4 className="font-black text-sm uppercase tracking-wider">Filtrar Leads</h4>
                                    <p className="text-xs text-muted-foreground">Refine sua visualização no pipeline.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CNAE</label>
                                        <Input
                                            placeholder="Ex: 47113"
                                            value={filterCnae}
                                            onChange={(e) => setFilterCnae(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cidade</label>
                                        <Input
                                            placeholder="Ex: São Paulo"
                                            value={filterCidade}
                                            onChange={(e) => setFilterCidade(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <Button variant="ghost" size="sm" className="text-xs font-bold gap-2 text-destructive hover:text-destructive hover:bg-destructive/5" onClick={clearFilters}>
                                        <X className="size-3" />
                                        Limpar
                                    </Button>
                                    <Button size="sm" className="font-bold" onClick={() => setShowFilters(false)}>Aplicar</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0">
                    {loading && leads.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-sm font-bold text-muted-foreground">Carregando pipeline...</p>
                            </div>
                        </div>
                    ) : filteredLeads.length > 0 ? (
                        viewMode === 'kanban' ? (
                            <KanbanBoard
                                leads={filteredLeads}
                                onStatusChange={handleStatusChange}
                                onLeadClick={(lead) => setLocation(`/leads/${lead.id}`)}
                            />
                        ) : (
                            <div className="grid gap-4 overflow-y-auto pb-10">
                                {filteredLeads.map((lead) => (
                                    <Card key={lead.id} className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm" onClick={() => setLocation(`/leads/${lead.id}`)}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Building className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-sm">{lead.nomeFantasia || lead.razaoSocial}</h3>
                                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold mt-1">
                                                        <span className="flex items-center gap-1"><Database className="size-3" /> {lead.cnaePrincipal}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="size-3" /> {lead.cidade}, {lead.uf}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Score</p>
                                                    <p className="text-xl font-black text-primary">{lead.score}%</p>
                                                </div>
                                                <Badge variant="outline" className="font-black uppercase tracking-tighter bg-muted/30">
                                                    {Object.keys(LeadStatus).find(k => LeadStatus[k as keyof typeof LeadStatus] === lead.status)}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-2xl bg-muted/5">
                            <Database className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-muted-foreground">Nenhum lead encontrado</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6 font-medium">Tente ajustar seus filtros ou buscar por outro termo.</p>
                            <Button variant="outline" onClick={clearFilters} className="font-bold">Limpar Filtros</Button>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}

