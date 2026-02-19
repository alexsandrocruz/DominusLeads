import { useState } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    Search as SearchIcon,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Database,
    CheckCircle2,
    Loader2,
    Tag,
    Download,
} from "lucide-react";
import { searchExternalLeads, extractLeads, type MarketLeadDto } from "@/lib/services/MarketService";
import { toast } from "sonner";
import CnaeTypeahead from "@/components/search/CnaeTypeahead";

/** Mapear código situação cadastral p/ label legível */
function situacaoLabel(code?: string): string {
    switch (code) {
        case "01": return "Nula";
        case "02": return "Ativa";
        case "03": return "Suspensa";
        case "04": return "Inapta";
        case "08": return "Baixada";
        default: return code ?? "—";
    }
}

function situacaoColor(code?: string): string {
    switch (code) {
        case "02": return "text-green-600 bg-green-500/10 border-green-500/20";
        case "03": return "text-amber-600 bg-amber-500/10 border-amber-500/20";
        case "04":
        case "08": return "text-red-600 bg-red-500/10 border-red-500/20";
        default: return "text-muted-foreground bg-muted/50 border-border";
    }
}

function matrizFilialLabel(code?: string): string {
    return code === "1" ? "Matriz" : code === "2" ? "Filial" : code ?? "";
}

export default function SearchLeadsPage() {
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState<string | null>(null);
    const [extractingAll, setExtractingAll] = useState(false);
    const [results, setResults] = useState<MarketLeadDto[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState({
        municipio: "",
        cnae: "",
        cnaeDesc: "",
        bairro: "",
    });

    const handleSearch = async () => {
        if (!filters.cnae || !filters.cnae.trim()) {
            toast.error("Selecione um CNAE para realizar a busca.");
            return;
        }

        if (!filters.municipio || !filters.municipio.trim()) {
            toast.error("O campo Município é obrigatório para realizar a busca.");
            return;
        }

        setLoading(true);
        setHasSearched(true);
        try {
            const response = await searchExternalLeads({
                municipio: filters.municipio.trim().toUpperCase(),
                cnae: filters.cnae.replace(/[^0-9]/g, "").trim(),
                bairro: filters.bairro.trim() || undefined,
            });
            const data = response.data;
            setResults(data);
            if (data.length === 0) {
                toast.info("Nenhum lead encontrado com estes critérios.");
            } else {
                toast.success(`${data.length} lead(s) encontrado(s)!`);
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
            setResults((prev) => prev.map((l) => (l.cnpj === cnpj ? { ...l, isExtracted: true } : l)));
        } catch (error) {
            console.error("Erro na extração:", error);
            toast.error("Erro ao extrair lead. Verifique seu saldo.");
        } finally {
            setExtracting(null);
        }
    };

    const handleExtractAll = async () => {
        const pendingLeads = results.filter((l) => !l.isExtracted && l.cnpj);
        if (pendingLeads.length === 0) {
            toast.info("Todos os leads já foram extraídos.");
            return;
        }

        setExtractingAll(true);
        try {
            const cnpjs = pendingLeads.map((l) => l.cnpj!);
            await extractLeads({ cnpjs });
            toast.success(`${cnpjs.length} lead(s) extraído(s) com sucesso!`);
            setResults((prev) =>
                prev.map((l) => (cnpjs.includes(l.cnpj!) ? { ...l, isExtracted: true } : l))
            );
        } catch (error) {
            console.error("Erro na extração em lote:", error);
            toast.error("Erro ao extrair leads em lote.");
        } finally {
            setExtractingAll(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && filters.cnae) handleSearch();
    };

    const buildEnderecoCompleto = (lead: MarketLeadDto) => {
        const parts: string[] = [];
        if (lead.tipoLogradouro) parts.push(lead.tipoLogradouro);
        if (lead.logradouro) parts.push(lead.logradouro);
        if (lead.numero) parts.push(lead.numero);
        if (lead.complemento) parts.push(`- ${lead.complemento}`);
        return parts.join(" ") || null;
    };

    const pendingCount = results.filter((l) => !l.isExtracted && l.cnpj).length;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Inteligência de Mercado</h1>
                    <p className="text-muted-foreground font-medium italic">
                        Busque estabelecimentos por município e CNAE.
                    </p>
                </div>

                {/* Search Card */}
                <Card className="p-6 border-primary/20 shadow-lg shadow-primary/5">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">MUNICÍPIO</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Ex: ARACAJU, SAO PAULO..."
                                    className="pl-10 h-11 border-primary/20 focus-visible:ring-primary uppercase"
                                    value={filters.municipio}
                                    onChange={(e) => setFilters({ ...filters, municipio: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">SETOR (CNAE)</label>
                            <CnaeTypeahead
                                value={filters.cnae}
                                onChange={(code, desc) =>
                                    setFilters({ ...filters, cnae: code, cnaeDesc: desc })
                                }
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">BAIRRO (Opcional)</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Filtrar por bairro..."
                                    className="pl-10 h-11 border-primary/20 focus-visible:ring-primary"
                                    value={filters.bairro}
                                    onChange={(e) => setFilters({ ...filters, bairro: e.target.value })}
                                    onKeyDown={handleKeyDown}
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

                        {results.length > 0 && pendingCount > 0 && (
                            <Button
                                variant="outline"
                                className="h-11 px-6 gap-2 font-bold border-primary/30 hover:bg-primary/5"
                                onClick={handleExtractAll}
                                disabled={extractingAll}
                            >
                                {extractingAll ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                Extrair Todos ({pendingCount})
                            </Button>
                        )}

                        {results.length > 0 && (
                            <span className="text-sm text-muted-foreground font-medium">
                                {results.length} resultado(s) encontrado(s)
                            </span>
                        )}
                    </div>
                </Card>

                {/* Results */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {loading
                        ? [1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow animate-pulse">
                                <CardHeader className="pb-2">
                                    <div className="h-5 w-40 bg-muted rounded" />
                                    <div className="h-3 w-56 bg-muted rounded mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="h-3 w-full bg-muted/50 rounded" />
                                        <div className="h-3 w-3/4 bg-muted/50 rounded" />
                                        <div className="h-3 w-1/2 bg-muted/50 rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                        : results.map((lead, idx) => {
                            const endereco = buildEnderecoCompleto(lead);
                            const localidade = [lead.bairro, lead.municipio, lead.uf].filter(Boolean).join(", ");

                            return (
                                <Card
                                    key={lead.cnpj || idx}
                                    className="hover:shadow-lg transition-all border-primary/10 hover:border-primary/30 flex flex-col"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-base font-bold text-primary leading-tight truncate">
                                                    {lead.nomeFantasia || lead.razaoSocial || "Sem Nome"}
                                                </CardTitle>
                                                {lead.cnpj && (
                                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                        {lead.cnpj}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {lead.identificadorMatrizFilial && (
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-600 border-blue-500/20">
                                                        {matrizFilialLabel(lead.identificadorMatrizFilial)}
                                                    </span>
                                                )}
                                                {lead.situacaoCadastral && (
                                                    <span
                                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${situacaoColor(lead.situacaoCadastral)}`}
                                                    >
                                                        {situacaoLabel(lead.situacaoCadastral)}
                                                    </span>
                                                )}
                                                {lead.isExtracted && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 bg-green-500/10 text-green-600 border-green-500/20">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        CRM
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3 flex-1 flex flex-col">
                                        {/* Endereço */}
                                        <div className="space-y-1">
                                            {endereco && (
                                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                                                    <span className="break-words">{endereco}</span>
                                                </div>
                                            )}
                                            {localidade && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground pl-[22px]">
                                                    <span>
                                                        {localidade}
                                                        {lead.cep && ` — CEP ${lead.cep}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contato */}
                                        <div className="space-y-1">
                                            {lead.telefoneFormatado && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                                    <span>{lead.telefoneFormatado}</span>
                                                </div>
                                            )}
                                            {lead.correioEletronico && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                                    <a
                                                        href={`mailto:${lead.correioEletronico}`}
                                                        className="hover:text-primary transition-colors truncate lowercase"
                                                    >
                                                        {lead.correioEletronico.toLowerCase()}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* CNAEs */}
                                        {lead.cnaes && lead.cnaes.length > 0 && (
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <Tag className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                                                <div className="flex flex-wrap gap-1">
                                                    {lead.cnaes.slice(0, 5).map((c) => (
                                                        <span
                                                            key={c}
                                                            className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded"
                                                        >
                                                            {c}
                                                        </span>
                                                    ))}
                                                    {lead.cnaes.length > 5 && (
                                                        <span className="text-[11px] text-muted-foreground/60">
                                                            +{lead.cnaes.length - 5}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Data início */}
                                        {lead.dataInicioAtividade && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                                <span>Início: {lead.dataInicioAtividade}</span>
                                            </div>
                                        )}

                                        {/* Ação */}
                                        <div className="mt-auto pt-3">
                                            {!lead.isExtracted ? (
                                                <Button
                                                    className="w-full gap-2 font-bold"
                                                    size="sm"
                                                    onClick={() => lead.cnpj && handleExtract(lead.cnpj)}
                                                    disabled={!lead.cnpj || extracting === lead.cnpj || extractingAll}
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
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>

                {/* Empty state */}
                {!loading && hasSearched && results.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-primary/10 rounded-xl">
                        <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-muted-foreground">Nenhum resultado encontrado</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Tente ajustar o município ou código CNAE.
                        </p>
                    </div>
                )}

                {/* Initial state */}
                {!loading && !hasSearched && (
                    <div className="py-16 text-center">
                        <SearchIcon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-muted-foreground">Pronto para pesquisar</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                            Informe o município e busque um CNAE pela descrição (ex: "dentista") ou código para encontrar estabelecimentos ativos.
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
