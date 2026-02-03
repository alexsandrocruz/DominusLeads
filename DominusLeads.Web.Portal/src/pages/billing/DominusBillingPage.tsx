import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    CreditCard,
    Database,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    TrendingUp,
    Download,
    Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DominusBillingPage() {
    const transactions = [
        { id: 1, type: 'credit', amount: 500, label: "Recarga de Créditos", date: "02 Fev 2024", icon: ArrowUpRight, color: "text-emerald-500" },
        { id: 2, type: 'debit', amount: 45, label: "Extração: Leads Advogados SP", date: "02 Fev 2024", icon: ArrowDownRight, color: "text-red-500" },
        { id: 3, type: 'debit', amount: 12, label: "Extração: Leads Imobiliárias", date: "01 Fev 2024", icon: ArrowDownRight, color: "text-red-500" },
    ];

    const plans = [
        { name: "Starter", credits: "500", price: "R$ 99", feature: "Ideal para início", current: false },
        { name: "Pro", credits: "2.500", price: "R$ 399", feature: "O mais popular", current: true },
        { name: "Enterprise", credits: "10.000", price: "R$ 1.299", feature: "Para grandes escalas", current: false },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Carteira e Faturamento</h1>
                    <p className="text-muted-foreground font-medium italic">Gerencie seu saldo de créditos e acompanhe seu histórico de consumo.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">Saldo Disponível</CardTitle>
                            <Database className="h-4 w-4 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">1.250</div>
                            <p className="text-xs mt-2 opacity-80">Equivale a aprox. 1.250 novas extrações</p>
                            <Button variant="secondary" className="w-full mt-6 font-bold shadow-md">
                                Recarregar Agora
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                            <CardTitle className="text-lg">Atividade da Carteira</CardTitle>
                            <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold text-primary">
                                <Download className="h-3 w-3" />
                                Exportar EXCEL
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {transactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("h-10 w-10 rounded-full bg-muted flex items-center justify-center", t.color)}>
                                                <t.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-none">{t.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{t.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("font-black", t.type === 'credit' ? 'text-emerald-500' : 'text-foreground')}>
                                                {t.type === 'credit' ? '+' : '-'}{t.amount}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">créditos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Upgrade de Plano
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Card key={plan.name} className={cn(
                                "relative transition-all hover:-translate-y-1 hover:shadow-xl",
                                plan.current ? "border-primary shadow-lg shadow-primary/5 bg-primary/5" : "hover:border-primary/50"
                            )}>
                                {plan.current && (
                                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 shadow-md">
                                        PLANO ATUAL
                                    </Badge>
                                )}
                                <CardHeader className="text-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{plan.name}</p>
                                    <div className="mt-2 text-3xl font-black">{plan.price}</div>
                                    <p className="text-xs text-muted-foreground">por mês</p>
                                </CardHeader>
                                <CardContent className="space-y-6 text-center">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-primary">{plan.credits}</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Créditos / Mês</p>
                                    </div>
                                    <p className="text-sm italic text-muted-foreground">{plan.feature}</p>
                                    <Button className="w-full font-bold h-11" variant={plan.current ? "outline" : "default"}>
                                        {plan.current ? "Gerenciar Plano" : "Selecionar Plano"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
