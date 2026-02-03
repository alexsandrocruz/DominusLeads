import { useMemo } from 'react';
import { useFinLancamentos, type FinLancamentoDto } from './use-fin-lancamentos';
import type { CashFlowData, ExpenseCategoryData, ProfessionalCostRevenueData } from '@/components/fin-dashboard/FinCharts';
import { format, parseISO, subMonths, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardData {
    cashFlow: CashFlowData[];
    expensesByCategory: ExpenseCategoryData[];
    professionalPerformance: ProfessionalCostRevenueData[];
    kpi: {
        balance: number;
        monthlyIncome: number;
        monthlyExpense: number;
        inadimplencia: number;
    };
    isLoading: boolean;
}

const COST_CENTER_MAP: Record<number, string> = {
    1: 'Administrativo',
    2: 'Pessoal',
    3: 'Marketing',
    4: 'Infraestrutura'
};

const PLANO_CONTA_MAP: Record<number, string> = {
    1: 'Honorários',
    2: 'Reembolsos',
    3: 'Custas'
};

export function useFinDashboardData(): DashboardData {
    const { data, isLoading } = useFinLancamentos(1000);

    const processedData = useMemo(() => {
        if (!data?.items) {
            return {
                cashFlow: [],
                expensesByCategory: [],
                professionalPerformance: [],
                kpi: { balance: 0, monthlyIncome: 0, monthlyExpense: 0, inadimplencia: 0 }
            };
        }

        const now = new Date();
        const startOfSixMonthsAgo = startOfMonth(subMonths(now, 2)); // Align with chart filter
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        // 1. Process Cash Flow (Dec + 6 months view, i.e., -2 months to +3 months relative to now)
        // If current month is Feb, we want: Dec, Jan, Feb, Mar, Apr, May
        const monthKeys = Array.from({ length: 6 }, (_, i) => {
            // i=0 -> -2 (Dec)
            // i=1 -> -1 (Jan)
            // i=2 -> 0 (Feb)
            // i=3 -> 1 (Mar)
            // i=4 -> 2 (Apr)
            // i=5 -> 3 (May)
            const d = subMonths(now, 2 - i);
            return format(d, 'yyyy-MM');
        });

        const groupedCashFlow: Record<string, CashFlowData> = {};
        monthKeys.forEach(k => {
            const [y, m] = k.split('-');
            const dateObj = new Date(parseInt(y), parseInt(m) - 1);
            groupedCashFlow[k] = {
                month: format(dateObj, 'MMM', { locale: ptBR }), // Display label
                entradas: 0,
                saidas: 0
            };
        });

        let totalBalance = 0;
        let currentMonthIncome = 0;
        let currentMonthExpense = 0;

        // 3. Process Professional Performance
        const profPerfMap: Record<string, { revenue: number; cost: number }> = {};

        data.items.forEach(item => {
            const date = parseISO(item.dataVencimento);

            // KPI Calculations
            if (item.operacao === 'E') {
                totalBalance += item.valor;
            } else {
                totalBalance -= item.valor;
            }

            if (date >= currentMonthStart && date <= currentMonthEnd) {
                if (item.operacao === 'E') currentMonthIncome += item.valor;
                else currentMonthExpense += item.valor;
            }

            // Cash Flow
            const monthKey = format(date, 'yyyy-MM');
            if (groupedCashFlow[monthKey]) {
                if (item.operacao === 'E') groupedCashFlow[monthKey].entradas += item.valor;
                else groupedCashFlow[monthKey].saidas += item.valor;
            }

            // Professional Performance (All time)
            if (item.profissionalNome) {
                if (!profPerfMap[item.profissionalNome]) {
                    profPerfMap[item.profissionalNome] = { revenue: 0, cost: 0 };
                }
                if (item.operacao === 'E') {
                    profPerfMap[item.profissionalNome].revenue += item.valor;
                } else {
                    profPerfMap[item.profissionalNome].cost += item.valor;
                }
            }
        });

        const cashFlowList = monthKeys.map(k => groupedCashFlow[k]);

        // 2. Expenses by Category (All time or recent? Usually recent month implies 'This Month' or 'Last 30 days')
        // Let's take last 30 days or current month for the pie chart
        const expenseMap = new Map<string, number>();
        data.items.forEach(item => {
            if (item.operacao === 'S' && item.ativo) {
                const date = parseISO(item.dataVencimento);
                if (date >= currentMonthStart) { // Filter for current month
                    const category = COST_CENTER_MAP[item.idCentroCusto] || `Centro ${item.idCentroCusto}`;
                    expenseMap.set(category, (expenseMap.get(category) || 0) + item.valor);
                }
            }
        });

        const expensesList: ExpenseCategoryData[] = Array.from(expenseMap.entries()).map(([name, value], idx) => ({
            name,
            value,
            color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx % 5]
        }));

        const professionalPerformanceList: ProfessionalCostRevenueData[] = Object.entries(profPerfMap).map(([name, values]) => ({
            name,
            revenue: values.revenue,
            cost: values.cost
        }));

        return {
            cashFlow: cashFlowList,
            expensesByCategory: expensesList,
            professionalPerformance: professionalPerformanceList,
            kpi: {
                balance: totalBalance,
                monthlyIncome: currentMonthIncome,
                monthlyExpense: currentMonthExpense,
                inadimplencia: 14.2 // Still hardcoded or calculate based on 'quitado' vs overdue
            }
        };

    }, [data]);

    return { ...processedData, isLoading };
}
