import { useState } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search as SearchIcon, Filter, MapPin, Building, Calendar, Database, CheckCircle2, Loader2 } from "lucide-react";
import { searchExternalLeads, extractLeads, type MarketLeadDto } from "@/lib/services/MarketService";
import { toast } from "sonner";

export default function SearchLeadsPage() {
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState<string | null>(null);
    const [results, setResults] = useState<MarketLeadDto[]>([]);
    const [filters, setFilters] = useState({
        municipio: "",
        cnae: "",
        bairro: ""
    });

    const handleSearch = async () => {
        if (!filters.cnae || !filters.cnae.trim()) {
            toast.error("O campo CNAE (Setor) é obrigatório para realizar a busca.");
            return;
        }

        if (!filters.municipio && !filters.bairro) {
            toast.error("Por favor, preencha ao menos um filtro de localização (Cidade ou Bairro).");
            return;
        }

        setLoading(true);
        try {
            const response = await searchExternalLeads(filters);
            const data = response.data;
            setResults(data);
            if (data.length === 0) {
                toast.info("Nenhum lead encontrado com estes critérios.");
            }
        } catch (error) {
            console.error("Erro na busca:", error);
            toast.error("Erro ao consultar base de dados externa.");
        } finally {
            setLoading(false);
        }
    };

    const handleExtract = async (cnpj: string) => {
        setExtracting(cnpj);
        try {
            await extractLeads({ cnpjs: [cnpj] });
            toast.success("Lead extraído e adicionado ao CRM!");
            // Atualiza o estado local para marcar como extraído
            setResults(prev => prev.map(l => l.cnpj === cnpj ? { ...l, isExtracted: true } : l));
        } catch (error) {
            console.error("Erro na extração:", error);
            toast.error("Erro ao extrair lead. Verifique seu saldo.");
        } finally {
            setExtracting(null);
        }
    };
    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Inteligência de Mercado</h1>
                    <p className="text-muted-foreground font-medium italic">Filtre e encontre os melhores leads para seu negócio.</p>
                </div>

                <Card className="p-6 border-primary/20 shadow-lg shadow-primary/5">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">BUSCA GERAL</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Nome da empresa, CNPJ ou palavras-chave..."
                                    className="pl-10 h-11 border-primary/20 focus-visible:ring-primary"
                                    value={filters.bairro} // Using bairro for general search for now or adding a new field
                                    onChange={(e) => setFilters({ ...filters, bairro: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">LOCALIZAÇÃO</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Cidade ou Estado..."
                                    className="pl-10 h-11 border-primary/20"
                                    value={filters.municipio}
                                    onChange={(e) => setFilters({ ...filters, municipio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">SETOR (CNAE)</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Ex: 6201-5..."
                                    className="pl-10 h-11 border-primary/20"
                                    value={filters.cnae}
                                    onChange={(e) => setFilters({ ...filters, cnae: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-primary/10">
                        <Button
                            className="h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                            Pesquisar Leads
                        </Button>
                        <Button variant="outline" className="h-11 gap-2 font-bold">
                            <Filter className="h-4 w-4" />
                            Mais Filtros
                        </Button>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-48 bg-muted rounded animate-pulse mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-20 bg-muted/50 rounded animate-pulse" />
                                </CardContent>
                            </Card>
                        ))
                    ) : results.length > 0 ? (
                        results.map((lead) => (
                            <Card key={lead.cnpj} className="hover:shadow-lg transition-all border-primary/10 hover:border-primary/30">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-primary leading-tight">
                                                {lead.nomeFantasia || lead.razaoSocial}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">{lead.cnpj}</p>
                                        </div>
                                        {lead.isExtracted && (
                                            <div className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border border-green-500/20">
                                                <CheckCircle2 className="h-3 w-3" />
                                                NO CRM
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building className="h-3.5 w-3.5 text-primary/60" />
                                            <span className="truncate">{lead.cnaePrincipal || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                            <span className="truncate">{lead.cidade}, {lead.uf}</span>
                                        </div>
                                    </div>

                                    {!lead.isExtracted ? (
                                        <Button
                                            className="w-full gap-2 font-bold"
                                            size="sm"
                                            onClick={() => handleExtract(lead.cnpj)}
                                            disabled={extracting === lead.cnpj}
                                        >
                                            {extracting === lead.cnpj ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Database className="h-4 w-4" />
                                            )}
                                            Extrair Lead
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 font-bold border-green-500/30 text-green-600 hover:bg-green-50"
                                            size="sm"
                                            disabled
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Já Extraído
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        !loading && filters.municipio && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed border-primary/10 rounded-xl">
                                <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-muted-foreground">Nenhum resultado para exibir</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Tente ajustar seus filtros para encontrar novos leads.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </AppShell>
    );
}
