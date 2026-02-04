import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, MoreVertical, ExternalLink, Mail, Phone, MapPin, Building, Loader2, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { getLeads, type LeadDto } from "@/lib/services/LeadService";

const getStatusLabel = (status: number) => {
    switch (status) {
        case 0: return "Novo";
        case 1: return "Qualificado";
        case 2: return "Em Negociação";
        case 3: return "Validado";
        case 4: return "Perdido";
        default: return "Novo";
    }
};

export default function LeadsListPage() {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<LeadDto[]>([]);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await getLeads();
            setLeads(response.data.items || []);
        } catch (err) {
            console.error("Erro ao buscar leads:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Minha Base de Leads</h1>
                        <p className="text-muted-foreground font-medium italic">Gerencie e acompanhe o progresso de suas prospecções.</p>
                    </div>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Users className="h-4 w-4" />
                        Exportar Base
                    </Button>
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-12 bg-muted rounded w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : leads.length > 0 ? (
                        leads.map((lead) => (
                            <Card key={lead.id} className="hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Building className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg leading-none">{lead.nomeFantasia || lead.razaoSocial}</h3>
                                                    <Badge variant={lead.status === 3 ? 'secondary' : 'outline'} className={cn(
                                                        lead.status === 3 ? 'bg-emerald-100 text-emerald-700' : ''
                                                    )}>
                                                        {getStatusLabel(lead.status)}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1"><Building className="h-3 w-3" /> {lead.cnaePrincipal}</div>
                                                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.cidade}, {lead.uf}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Score</p>
                                                <p className="text-2xl font-black text-primary">{lead.score}%</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {lead.telefone && <Button variant="outline" size="icon" className="h-10 w-10"><Phone className="h-4 w-4" /></Button>}
                                                {lead.email && <Button variant="outline" size="icon" className="h-10 w-10"><Mail className="h-4 w-4" /></Button>}
                                                <Button
                                                    className="font-bold gap-2"
                                                    onClick={() => setLocation(`/leads/${lead.id}`)}
                                                >
                                                    Detalhes
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-xl">
                            <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-muted-foreground">Sua base está vazia</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">Comece extraindo leads na ferramenta de Inteligência de Mercado.</p>
                            <Button onClick={() => setLocation("/search")}>Ir para Busca</Button>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}

