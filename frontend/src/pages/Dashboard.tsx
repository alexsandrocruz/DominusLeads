import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bell, Rocket, Search, Database, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Dashboard = () => {
    const navigate = useNavigate();

    const recentActivity = [
        { name: "Tech Solutions Ltda", cnae: "6201-5/00", status: "Validado", date: "há 2h", color: "green" },
        { name: "Green Energy Corp", cnae: "3511-5/01", status: "Novo Lead", date: "há 5h", color: "primary" },
        { name: "Logistics Pro", cnae: "4930-2/02", status: "Validado", date: "há 8h", color: "green" }
    ];

    return (
        <Layout>
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-lg h-10 w-10 flex items-center justify-center text-white">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-none dark:text-white">Dominus Leads</h2>
                        <p className="text-xs text-slate-500">Olá, Especialista</p>
                    </div>
                </div>
                <button className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-white"><Bell className="h-5 w-5" /></button>
            </header>
            <div className="p-4 space-y-4">
                <Card className="flex justify-between relative overflow-hidden">
                    <div className="flex flex-col justify-between z-10 relative">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Créditos Ativos</p>
                            <p className="text-3xl font-extrabold mt-1 dark:text-white">1.250</p>
                        </div>
                        <Button onClick={() => navigate('/billing')} size="sm" className="mt-4 shadow-lg shadow-primary/20 w-fit">
                            Comprar Mais
                        </Button>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-6 flex items-center justify-center">
                        <Database className="text-primary h-12 w-12" />
                    </div>
                </Card>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold dark:text-white">Busca Rápida</h3>
                    <Input
                        icon={<Search className="h-5 w-5" />}
                        placeholder="Buscar por Empresa ou CNPJ..."
                        containerClassName="shadow-sm"
                    />
                    <Button
                        variant="secondary"
                        className="w-full justify-center"
                        onClick={() => navigate('/search')}
                    >
                        Filtrar por CNAE / Localização
                    </Button>
                </div>

                <div className="space-y-3 pt-2">
                    <h3 className="text-lg font-bold dark:text-white">Atividade Recente</h3>
                    <div className="space-y-3">
                        {recentActivity.map((lead, i) => (
                            <Card key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm dark:text-white">{lead.name}</h4>
                                        <p className="text-xs text-slate-500">CNAE: {lead.cnae}</p>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                                        lead.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-primary/10 text-primary'
                                    )}>
                                        {lead.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {lead.color === 'green' ?
                                        <CheckCircle className="h-4 w-4 text-green-500" /> :
                                        <Clock className="h-4 w-4 text-primary" />
                                    }
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">{lead.status} há {lead.date}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
