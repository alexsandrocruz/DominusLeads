import { useFinLancamentoses } from "@/lib/abp/hooks/useFinLancamentoses";
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    TrendingUp,
    TrendingDown,
    Scale
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function FinLancamentosDashboard() {
    const { data, isLoading } = useFinLancamentoses({
        maxResultCount: 1000, // Get more for summary
    });

    const totals = (data?.items || []).reduce(
        (acc: any, item: any) => {
            const valor = item.valor || 0;
            if (item.operacao === "E") {
                acc.entradas += valor;
            } else {
                acc.saidas += valor;
            }
            return acc;
        },
        { entradas: 0, saidas: 0 }
    );

    const saldo = totals.entradas - totals.saidas;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Entradas */}
            <Card className="border-none shadow-sm bg-green-500/5 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-green-600/80 mb-1">Total Entradas</p>
                            <h3 className="text-2xl font-bold text-green-700">{formatCurrency(totals.entradas)}</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs text-green-600/60">
                        <ArrowUpCircle className="h-3 w-3" />
                        <span>Valores recebidos</span>
                    </div>
                </CardContent>
            </Card>

            {/* Saídas */}
            <Card className="border-none shadow-sm bg-red-500/5 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-red-600/80 mb-1">Total Saídas</p>
                            <h3 className="text-2xl font-bold text-red-700">{formatCurrency(totals.saidas)}</h3>
                        </div>
                        <div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs text-red-600/60">
                        <ArrowDownCircle className="h-3 w-3" />
                        <span>Pagamentos efetuados</span>
                    </div>
                </CardContent>
            </Card>

            {/* Saldo */}
            <Card className={cn(
                "border-none shadow-sm backdrop-blur-sm overflow-hidden group",
                saldo >= 0 ? "bg-primary/5" : "bg-orange-500/5"
            )}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={cn(
                                "text-sm font-medium mb-1",
                                saldo >= 0 ? "text-primary/80" : "text-orange-600/80"
                            )}>Saldo Acumulado</p>
                            <h3 className={cn(
                                "text-2xl font-bold",
                                saldo >= 0 ? "text-primary border-primary/20" : "text-orange-700 border-orange-200"
                            )}>{formatCurrency(saldo)}</h3>
                        </div>
                        <div className={cn(
                            "p-2 rounded-xl group-hover:scale-110 transition-transform",
                            saldo >= 0 ? "bg-primary/10" : "bg-orange-500/10"
                        )}>
                            <Scale className={cn(
                                "h-5 w-5",
                                saldo >= 0 ? "text-primary" : "text-orange-600"
                            )} />
                        </div>
                    </div>
                    <div className={cn(
                        "mt-4 flex items-center gap-1 text-xs",
                        saldo >= 0 ? "text-primary/60" : "text-orange-600/60"
                    )}>
                        <Wallet className="h-3 w-3" />
                        <span>Fluxo de caixa líquido</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
