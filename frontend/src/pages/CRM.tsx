import { Layout } from '../components/layout/Layout';
import { LeadCard } from '../components/business/LeadCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Filter, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CRM = () => {
    const navigate = useNavigate();
    const filters = ['Todos', 'Quente', 'Respondeu', 'Validado'];

    const leads = [
        { name: "TechFlow Solutions", sub: "6201-5: Dev de Software • 24 Out", status: "Lead Quente • Validado", color: "bg-accent-green", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8FLBaS4O0eWiPqKmzjuXo1iMYvcb0n5cMXAv3xr79PSbceifNSgniBEgqKtge2AltboMQaGa7-rPLALkIbzNlf05_u_Tg1uCIykV31JxHhjyogJkZnWI_kCC1-PdQEvz4cPBD4BZguHOiQqOyWSmsnzNX6DOaBJkCaFRpVbYOjYK99hgCAKNMuqeWiNTX41x12PeuZpwVXkIIlRWlgPEFTJmZdmYdoB630Hjhdv1qgwpCQEji1WKOhUgicMCQuUa-_V5OaGrfhUY" },
        { name: "Green Horizon Ltda", sub: "4611-7: Atacado • 22 Out", status: "Respondeu", color: "bg-blue-400", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWmCCDqKe_TTKC1JcOvf_IGlbP589b_4ZQE6PQkLBJafaT5kkP1vhso2aOUEzo9008GEmvSN5J9kpWmFSNEntwBBBySALiq8kibWVCI-vvhfyj3H0nq9LDrJdNA176CUlgM5UUe1mzAHhrusKkOyhOPY3JcwHPwtbvFw15hFdpxqOAzHEqKx9LsABX7BON2QKPyQVtxt4IwxlzIYJ5cLPi2wWBN2ZqDGsIMyFVORuyZ1VgI9DHL_KgdNmeVauzyglRBxLcj54hGPjS" },
        { name: "Nexus Analytics", sub: "7020-2: Consultoria • 20 Out", status: "Validado", color: "bg-accent-green", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4hd7tpBxTtcqwhPQ5REt4lX0n99D-KxofW0WxSfEJPlWs-M6IW6tRgbmZt-PBAhd3YbrW9RagjRe35SREfFZEqzbLHmPfB-etOM7CFvmmRTuLDM-wzC0barXLGt654lywL3iFE6Phn0cMDokAOMQkwmRc96lQuybkiorEsOkylvtOWbQlGBIVIrXgGgiO_W4F9wd_7N1lF1iT4toYcmPa_J25KO8aMZdpxBzNFfvb5W6tDI_aCjPk4RCfbey3CY14KsZMjkymyY3O" }
    ];

    return (
        <Layout>
            <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md pb-2 border-b dark:border-slate-800">
                <header className="flex items-center p-4 justify-between">
                    <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><ChevronLeft className="h-6 w-6" /></button>
                    <h2 className="text-lg font-bold dark:text-white">Leads Qualificados</h2>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary"><Filter className="h-5 w-5" /></button>
                </header>
                <div className="px-4">
                    <Input icon={<Search className="h-4 w-4" />} placeholder="Buscar por empresa ou CNAE..." containerClassName="mb-3" />
                </div>
                <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2">
                    {filters.map((f, i) => (
                        <button key={i} className={`h-8 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-card-dark text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>{f}</button>
                    ))}
                </div>
            </div>

            <main className="px-4 space-y-4 pt-4 pb-20">
                {leads.map((lead, i) => (
                    <LeadCard key={i} {...lead} onClick={() => navigate('/lead-detail')} />
                ))}
            </main>

            <Button size="icon" className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl" onClick={() => navigate('/crm/new')}>
                <Plus className="h-6 w-6" />
            </Button>
        </Layout>
    );
};
