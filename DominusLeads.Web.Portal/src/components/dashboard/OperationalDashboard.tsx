import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { type DashboardOperationalData, getOperationalDashboard } from '../../lib/services/DashboardService';

const OperationalDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardOperationalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOperationalDashboard()
            .then((response) => {
                setData(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-muted-foreground">Carregando indicadores...</div>;
    if (!data) return <div className="p-4 text-destructive">Não foi possível carregar os dados.</div>;

    // Prepare data for charts
    const tasksData = data.tasksByEmployee.map(t => ({
        name: t.usuarioNome,
        'Em Aberto': t.openTasks,
        'Atrasadas': t.delayedTasks
    }));

    const followUpData = data.recentFollowUps.slice(0, 10).map(f => ({
        name: f.usuarioNome,
        'Interacoes': f.count
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Tarefas Atrasadas</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">{data.delayedTasksCount}</p>
                    <span className="text-xs text-muted-foreground">Total acumulado</span>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Tarefas em Aberto</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{data.openTasksCount}</p>
                    <span className="text-xs text-muted-foreground">Carga de trabalho atual</span>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-muted-foreground text-sm font-medium">Pré-Processos Pendentes</h3>
                    <p className="text-3xl font-bold text-amber-500 mt-2">{data.preProcessesPendingCount}</p>
                    <span className="text-xs text-muted-foreground">Aguardando conversão</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                    <h3 className="text-lg font-medium text-card-foreground mb-4 pl-4">Tarefas por Colaborador</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={tasksData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }} />
                                <Legend />
                                <Bar dataKey="Em Aberto" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Atrasadas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                    <h3 className="text-lg font-medium text-card-foreground mb-4 pl-4">Top 10 Interações (Follow-ups)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={followUpData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                                <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }} />
                                <Legend />
                                <Bar dataKey="Interacoes" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-4">Eficiência e Conversão</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Colaborador</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Oportunidades</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Convertidos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Taxa %</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {data.conversionRates.map((rate) => (
                                <tr key={rate.usuarioId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{rate.usuarioNome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rate.opportunitiesCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rate.convertedCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rate.rate > 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {rate.rate.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OperationalDashboard;
