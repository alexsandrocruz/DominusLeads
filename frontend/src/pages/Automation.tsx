import { Layout } from '../components/layout/Layout';
import { AutomationCard } from '../components/business/AutomationCard';
import { Button } from '../components/ui/Button';
import { Plus, Search, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Automation = () => {
    const navigate = useNavigate();

    const automations = [
        { title: "Prospecção Advogados SP", count: "45 leads hoje", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3a8d8ytIUO6r5SVnCbk9oRctG1AbIgXwhNWZKMDtk0ZKnghDzMZ9DqC8GgFG__BE5d-NIctABiZLAtl0A3l8S6zjy02pWWw4B7M0FRVOHOFNDhP0z2d7V1CbdJGE702VxkIFhVgfsAuXRnE8_K8nINP4HxwPhUevEwn2fxyscvwAC2_T45gaImJ5K_oUookO7pmsmuB86vXpziszo6-8q5mnhdFNhgPSqZ7PMA_6zkYbcbEO3o_okZTzJZ21a_Iq2VSm2n1Qpd0y5" },
        { title: "Leads Imobiliárias RJ", count: "12 leads hoje", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzuK3qzNT8lB_2niRH4fF6J2JcgDEwIyRGN-NnmyWQWuykmgpNBMi4G1va8rQ-2uCojNeBY4Fx9WGalIhnOWTYYuexxIP9_okAeScOqcoYLLi46Km9xochsB2l-8cxFlbFS3pLVz8OcMIeqmGRTDQGuS-fTpyyyImVh6F2Mi0G0cvvWMnvlEywi4VtMQ8_JilfPIYx-zE-gtLNGFgSddrh2uG2-Gs7eC39QA7oeOig_j_aOPrdkRVuOoqth6an4NAFayq4xswSPlrE" }
    ];

    return (
        <Layout>
            <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b dark:border-slate-800">
                <header className="flex items-center p-4 justify-between">
                    <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><ChevronLeft className="h-6 w-6" /></button>
                    <h2 className="text-lg font-bold dark:text-white">Automações</h2>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><Search className="h-5 w-5" /></button>
                </header>
                <div className="px-4 border-b dark:border-slate-800 flex">
                    <button className="flex-1 pb-3 pt-4 border-b-2 border-primary text-primary font-bold text-sm">Minhas Automações</button>
                    <button className="flex-1 pb-3 pt-4 border-b-2 border-transparent text-slate-500 font-bold text-sm">Logs de Erro</button>
                </div>
            </div>

            <main className="p-4 space-y-6 pb-24">
                <h3 className="font-bold dark:text-white">Automações Ativas</h3>
                {automations.map((aut, i) => (
                    <AutomationCard key={i} {...aut} onClick={() => navigate('/automation/config')} />
                ))}
            </main>

            <Button size="icon" className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl" onClick={() => navigate('/automation/new')}>
                <Plus className="h-6 w-6" />
            </Button>
        </Layout>
    );
};
