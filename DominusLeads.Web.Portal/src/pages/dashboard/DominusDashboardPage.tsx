import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, Search, Database, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function DominusDashboardPage() {
    const recentActivity = [
        { name: "Tech Solutions Ltda", cnae: "6201-5/00", status: "Validado", date: "há 2h", type: "success" },
        { name: "Green Energy Corp", cnae: "3511-5/01", status: "Novo Lead", date: "há 5h", type: "primary" },
        { name: "Logistics Pro", cnae: "4930-2/02", status: "Validado", date: "há 8h", type: "success" }
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
                    <p className="text-muted-foreground italic">
                        Bem-vindo de volta, Especialista em Leads.
                    </p>
                </div>

                {/* Top Grid: Credits & Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative overflow-hidden bg-primary/5 border-primary/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Créditos Ativos
                            </CardTitle>
                            <Database className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">1.250</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Próxima recarga em 15 dias
                            </p>
                            <Button size="sm" className="mt-4 w-full md:w-fit shadow-lg shadow-primary/20">
                                Comprar Créditos
                            </Button>
                        </CardContent>
                        {/* Subtle background decoration */}
                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                            <Database className="h-32 w-32" />
                        </div>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Leads Convertidos
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">84</div>
                            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1 font-bold">
                                <TrendingUp className="h-3 w-3" />
                                +12% este mês
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Tempo Médio Validação
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">4.2h</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Meta: Abaixo de 6h
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6 space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">Busca Rápida</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por Empresa ou CNPJ..."
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Link href="/search" className="flex-1">
                                <Button variant="secondary" className="w-full">
                                    Filtros Avançados
                                </Button>
                            </Link>
                            <Button className="flex-1 gap-2">
                                <Rocket className="h-4 w-4" />
                                Novo Lead
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Atividade Recente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.map((lead, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold leading-none">{lead.name}</p>
                                        <p className="text-xs text-muted-foreground">CNAE: {lead.cnae} • {lead.date}</p>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                                        lead.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'
                                    )}>
                                        {lead.status}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
