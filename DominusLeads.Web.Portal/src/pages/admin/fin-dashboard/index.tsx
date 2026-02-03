import { Shell } from "@/components/layout/shell";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Percent,
    AlertTriangle,
    Calendar,
    Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CashFlowChart,
    ExpenseDistribution,
    LegalAnalytics,
    CostByCourt,
    ProfessionalCostRevenueChart
} from "@/components/fin-dashboard/FinCharts";
import { cn } from "@/lib/utils";
import { useFinDashboardData } from "@/lib/abp/hooks/use-fin-dashboard-data";

export default function FinDashboardPage() {
    const { cashFlow, expensesByCategory, professionalPerformance, kpi, isLoading } = useFinDashboardData();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const KPI_CARDS = [
        {
            label: "Saldo em Caixa",
            value: formatCurrency(kpi.balance),
            change: "+12.5%", // Placeholder for now, would need comparing with previous month
            trend: "up",
            icon: DollarSign,
            color: "primary"
        },
        {
            label: "Faturamento (Mês)",
            value: formatCurrency(kpi.monthlyIncome),
            change: "+8.2%",
            trend: "up",
            icon: TrendingUp,
            color: "green"
        },
        {
            label: "Despesas (Mês)",
            value: formatCurrency(kpi.monthlyExpense),
            change: "-4.1%",
            trend: "down",
            icon: TrendingDown,
            color: "red"
        },
        {
            label: "Inadimplência",
            value: `${kpi.inadimplencia}%`,
            change: "+2.3%",
            trend: "up",
            icon: AlertTriangle,
            color: "orange"
        },
    ];

    if (isLoading) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Gerencial</h1>
                        <p className="text-muted-foreground">Visão holística da saúde financeira do escritório</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 bg-card/50">
                            <Calendar className="h-4 w-4" />
                            Últimos 6 Meses
                        </Button>
                        <Button variant="outline" className="gap-2 bg-card/50">
                            <Filter className="h-4 w-4" />
                            Filtros Avançados
                        </Button>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            Gerar Relatório PDF
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {KPI_CARDS.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        return (
                            <Card key={idx} className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.label}</p>
                                            <h3 className="text-2xl font-bold">{kpi.value}</h3>
                                        </div>
                                        <div className={cn(
                                            "p-2 rounded-xl group-hover:scale-110 transition-transform",
                                            kpi.color === "primary" && "bg-primary/10 text-primary",
                                            kpi.color === "green" && "bg-green-500/10 text-green-600",
                                            kpi.color === "red" && "bg-red-500/10 text-red-600",
                                            kpi.color === "orange" && "bg-orange-500/10 text-orange-600",
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={cn(
                                            "text-xs font-bold px-1.5 py-0.5 rounded-md",
                                            kpi.trend === "up" && kpi.color === "green" ? "bg-green-500/10 text-green-600" :
                                                kpi.trend === "up" && kpi.color === "red" ? "bg-red-500/10 text-red-600" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {kpi.change}
                                        </span>
                                        <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CashFlowChart data={cashFlow} />
                    </div>
                    <div className="lg:col-span-1">
                        <ExpenseDistribution data={expensesByCategory} />
                    </div>
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProfessionalCostRevenueChart data={professionalPerformance} />
                    <CostByCourt />
                </div>

                {/* Footer/Warnings */}
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Percent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-primary">Dica Gerencial: Redução de Custos Operativos</p>
                        <p className="text-sm text-primary/70">As custas no TRF3 aumentaram 15% este mês. Considere revisar a política de antecipação de taxas para processos em fase inicial.</p>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 md:ml-auto">
                        Ver análise detalhada
                    </Button>
                </div>
            </div>
        </Shell>
    );
}
