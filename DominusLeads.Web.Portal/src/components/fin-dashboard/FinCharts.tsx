import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// Data Interfaces
export interface CashFlowData {
    month: string;
    entradas: number;
    saidas: number;
    [key: string]: any;
}

export interface ExpenseCategoryData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export interface LegalCostData {
    name: string;
    custo: number;
    processos: number; // Optional/Mocked if not available
    [key: string]: any;
}

export interface CourtCostData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export interface ProfessionalCostRevenueData {
    name: string;
    revenue: number;
    cost: number;
    [key: string]: any;
}

// Default/Mock Data (kept for fallback or initial skeletons)
const defaultCashFlowData = [
    { month: 'Ago', entradas: 45000, saidas: 32000 },
    { month: 'Set', entradas: 52000, saidas: 35000 },
    { month: 'Out', entradas: 48000, saidas: 38000 },
    { month: 'Nov', entradas: 61000, saidas: 42000 },
    { month: 'Dez', entradas: 55000, saidas: 40000 },
    { month: 'Jan', entradas: 67000, saidas: 45000 },
];

const defaultExpenseByCategory = [
    { name: 'Pessoal', value: 12500, color: '#3b82f6' },
    { name: 'Outros', value: 5000, color: '#8b5cf6' },
];

export function CashFlowChart({ data = defaultCashFlowData }: { data?: CashFlowData[] }) {
    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Fluxo de Caixa (6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                tickFormatter={(value) => `R$ ${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="entradas"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorEntradas)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                dataKey="saidas"
                                stroke="#ef4444"
                                fillOpacity={1}
                                fill="url(#colorSaidas)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function ExpenseDistribution({ data = defaultExpenseByCategory }: { data?: ExpenseCategoryData[] }) {
    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function LegalAnalytics({ data }: { data?: LegalCostData[] }) {
    // If no data, use some fallback or empty
    const displayData = data || [
        { name: 'Dr. Fabio', custo: 1200, processos: 45 },
        { name: 'Dra. Ana', custo: 2800, processos: 32 }
    ];

    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Custas por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                            <Bar
                                dataKey="custo"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function CostByCourt({ data }: { data?: CourtCostData[] }) {
    const displayData = data || [
        { name: 'TJSP', value: 4500, color: '#3b82f6' },
        { name: 'TRF3', value: 3200, color: '#8b5cf6' }
    ];

    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Custas por Tribunal</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={displayData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                dataKey="value"
                            >
                                {displayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function ProfessionalCostRevenueChart({ data }: { data?: ProfessionalCostRevenueData[] }) {
    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Custas vs Faturamento por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                tickFormatter={(value) => `R$ ${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Bar
                                dataKey="revenue"
                                name="Faturamento"
                                fill="hsl(var(--primary))" // Blue-ish
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                            <Bar
                                dataKey="cost"
                                name="Custas"
                                fill="#ef4444" // Red
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
