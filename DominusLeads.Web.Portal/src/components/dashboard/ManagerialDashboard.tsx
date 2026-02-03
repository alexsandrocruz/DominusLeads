import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { type DashboardManagerialData, getManagerialDashboard } from '../../lib/services/DashboardService';

const ManagerialDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardManagerialData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getManagerialDashboard()
            .then((response) => {
                setData(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-muted-foreground">Carregando indicadores gerenciais...</div>;
    if (!data) return <div className="p-4 text-destructive">Não foi possível carregar os dados.</div>;

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined) return '';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const financialData = [
        { name: 'Receitas', value: data.financials.inflow },
        { name: 'Despesas', value: data.financials.outflow },
        { name: 'A Receber', value: data.financials.accountsReceivable },
        { name: 'Em Atraso', value: data.financials.overdueReceivable },
    ];

    const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

    return (
        <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Saldo (Mês Atual)</h3>
                    <p className={`text-2xl font-bold mt-2 ${data.financials.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.financials.balance)}
                    </p>
                    <span className="text-xs text-muted-foreground">Receitas - Despesas</span>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Pipeline de Vendas</h3>
                    <p className="text-2xl font-bold text-indigo-600 mt-2">{formatCurrency(data.salesPipelineValue)}</p>
                    <span className="text-xs text-muted-foreground">Oportunidades em aberto</span>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Contas a Receber</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(data.financials.accountsReceivable)}</p>
                    <span className="text-xs text-muted-foreground">Em aberto (Total)</span>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Novos Clientes</h3>
                    <p className="text-2xl font-bold text-card-foreground mt-2">{data.newClientsThisMonth}</p>
                    <span className="text-xs text-muted-foreground">Entrada neste mês</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Distribuição Financeira */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border lg:col-span-1">
                    <h3 className="text-lg font-medium text-card-foreground mb-4">Composição Financeira</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={financialData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="hsl(var(--card))"
                                >
                                    {financialData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | undefined) => [formatCurrency(value), 'Valor']}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detalhes Financeiros */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border lg:col-span-2">
                    <h3 className="text-lg font-medium text-card-foreground mb-4">Resumo da Carteira & Inadimplência</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground uppercase">Total Carteira de Processos</h4>
                            <p className="text-4xl font-light text-card-foreground mt-2">{formatCurrency(data.totalPortfolioValue)}</p>
                            <p className="text-sm text-muted-foreground mt-1">Soma do valor da causa (Ativos)</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground uppercase">Inadimplência (Atrasados)</h4>
                            <p className="text-4xl font-light text-red-600 mt-2">{formatCurrency(data.financials.overdueReceivable)}</p>
                            <p className="text-sm text-muted-foreground mt-1">Valores vencidos não quitados</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-border pt-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Fluxo de Caixa (Realizado)</h4>
                        <div className="flex justify-between items-center bg-muted/50 p-4 rounded-md">
                            <div>
                                <span className="block text-xs text-muted-foreground">Entradas</span>
                                <span className="text-lg font-semibold text-green-600">{formatCurrency(data.financials.inflow)}</span>
                            </div>
                            <div className="text-border">|</div>
                            <div>
                                <span className="block text-xs text-muted-foreground">Saídas</span>
                                <span className="text-lg font-semibold text-red-600">{formatCurrency(data.financials.outflow)}</span>
                            </div>
                            <div className="text-border">|</div>
                            <div>
                                <span className="block text-xs text-muted-foreground">Resultado</span>
                                <span className={`text-lg font-bold ${data.financials.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatCurrency(data.financials.balance)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerialDashboard;
