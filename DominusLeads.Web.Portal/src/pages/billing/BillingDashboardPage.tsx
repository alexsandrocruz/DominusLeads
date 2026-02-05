import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCredit, type CreditDto, type TransactionDto } from "@/lib/services/CreditService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    History,
    TrendingUp,
    Plus,
    Download,
    Receipt,
    Zap,
    MessageSquare,
    Coins,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingDashboardPage() {
    const [data, setData] = useState<CreditDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getCredit();
            setData(response.data);
        } catch (err) {
            console.error("Erro ao carregar créditos:", err);
            setError("Não foi possível carregar os dados financeiros.");
        } finally {
            setLoading(false);
        }
    };

    const getTransactionIcon = (type: number) => {
        return type === 0 ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />;
    };

    const getTransactionColor = (type: number) => {
        return type === 0 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500";
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return "Pendente";
            case 1: return "Confirmado";
            case 2: return "Cancelado";
            default: return "Concluído";
        }
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Créditos e Faturamento</h1>
                        <p className="text-muted-foreground font-medium italic">Gerencie seu saldo para disparos e extrações inteligentes.</p>
                    </div>
                    <Button className="h-12 px-6 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                        <Plus className="size-4" />
                        Adicionar Créditos
                    </Button>
                </div>

                {/* Balance Cards */}
                <div className="grid sm:grid-cols-3 gap-6">
                    <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 rounded-[2rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Wallet className="size-24" />
                        </div>
                        <CardContent className="p-8 space-y-4">
                            <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Coins className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white/70 uppercase tracking-widest">Saldo Atual</p>
                                <h2 className="text-4xl font-black">
                                    {loading ? (
                                        <Skeleton className="h-10 w-32 bg-white/20" />
                                    ) : (
                                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.saldoAtual || 0)
                                    )}
                                </h2>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-muted shadow-lg shadow-slate-200/50 rounded-[2rem] overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <TrendingUp className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Uso (Mês Atual)</p>
                                <h2 className="text-3xl font-black">
                                    {loading ? (
                                        <Skeleton className="h-8 w-24" />
                                    ) : (
                                        "R$ 0,00"
                                    )}
                                </h2>
                                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                                    <ArrowDownRight className="size-3" />
                                    0% que mês anterior
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-muted shadow-lg shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                        <CardContent className="p-8 space-y-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Zap className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Custo por Lead Captado</p>
                                <h2 className="text-3xl font-black italic">R$ 0,12</h2>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Estimativa baseada no uso da IA</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Usage Detail */}
                <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                Extrato de Uso
                            </h3>
                            <Button variant="ghost" size="sm" className="text-primary font-bold">Ver Tudo</Button>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Card key={i} className="border-muted rounded-2xl overflow-hidden">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="size-10 rounded-xl" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-20" />
                                        </CardContent>
                                    </Card>
                                ))
                            ) : data?.transactions.length === 0 ? (
                                <div className="text-center py-12 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                                    <History className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-muted-foreground font-bold">Nenhuma transação encontrada.</p>
                                </div>
                            ) : (
                                data?.transactions.map((t) => (
                                    <Card key={t.id} className="border-muted hover:border-primary/20 transition-all rounded-2xl overflow-hidden group">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "size-10 rounded-xl flex items-center justify-center",
                                                    getTransactionColor(t.tipo)
                                                )}>
                                                    {getTransactionIcon(t.tipo)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black">{t.descricao}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-medium">
                                                        {format(new Date(t.creationTime), "dd MMM, yyyy", { locale: ptBR })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "text-sm font-black",
                                                    t.tipo === 0 ? "text-emerald-600" : "text-slate-900"
                                                )}>
                                                    {t.tipo === 0 ? "+" : "-"} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                                                </span>
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase p-0 opacity-50 border-none">
                                                    {getStatusLabel(t.status)}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <Receipt className="size-5 text-primary" />
                            Faturas e Recibos
                        </h3>

                        <div className="bg-muted/30 border border-muted rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black">Fatura: JAN_2026</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Disponível em PDF</p>
                                </div>
                                <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-background shadow-sm hover:text-primary">
                                    <Download className="size-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer opacity-80">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black">Fatura: DEZ_2025</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Histórico</p>
                                </div>
                                <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-background shadow-sm hover:text-primary">
                                    <Download className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Zap className="size-5" />
                                    </div>
                                    <h4 className="text-sm font-black">Economia com IA</h4>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                    Ao usar a classificação automática da Dominus IA, você economizou aproximadamente <strong className="text-primary font-black">R$ 1.240,00</strong> este mês em mão de obra de SDR.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
