import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter, MapPin, Building, Calendar } from "lucide-react";

export default function SearchLeadsPage() {
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
                                <Input placeholder="Nome da empresa, CNPJ ou palavras-chave..." className="pl-10 h-11 border-primary/20 focus-visible:ring-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">LOCALIZAÇÃO</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input placeholder="Cidade ou Estado..." className="pl-10 h-11 border-primary/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground px-1">SETOR (CNAE)</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input placeholder="Ex: 6201-5..." className="pl-10 h-11 border-primary/20" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-primary/10">
                        <Button className="h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20">
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar Leads
                        </Button>
                        <Button variant="outline" className="h-11 gap-2 font-bold">
                            <Filter className="h-4 w-4" />
                            Mais Filtros
                        </Button>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-50 grayscale pointer-events-none select-none">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-48 bg-muted rounded animate-pulse mt-2" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-20 bg-muted/50 rounded animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
