import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChevronLeft, HelpCircle, Search as SearchIcon, Building, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Search = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b dark:border-slate-800 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><ChevronLeft className="h-6 w-6" /></button>
                <h2 className="text-lg font-bold dark:text-white">Encontrar Novos Leads</h2>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><HelpCircle className="h-5 w-5" /></button>
            </div>

            <main className="p-4 space-y-6 pb-32">
                <Input icon={<SearchIcon className="h-5 w-5" />} placeholder="Buscar por nome da empresa" />

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Critérios de Filtro</h3>
                    <span className="text-primary text-sm font-semibold cursor-pointer">Limpar tudo</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium pb-2 dark:text-white">Atividade Econômica (CNAE)</p>
                        <select className="w-full h-14 bg-white dark:bg-[#192233] dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 outline-none">
                            <option>Tecnologia da Informação</option>
                            <option>Varejo</option>
                            <option>Serviços</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-24">
                            <p className="text-sm font-medium pb-2 dark:text-white">Estado</p>
                            <Input placeholder="UF" className="text-center" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium pb-2 dark:text-white">Cidade</p>
                            <Input placeholder="Ex: São Paulo" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-4">
                            <p className="text-sm font-medium dark:text-white">Quantidade de Leads</p>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">5.000</span>
                        </div>
                        <input type="range" className="w-full accent-primary" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#192233]/50 p-4 rounded-2xl border dark:border-slate-800 space-y-3">
                    <p className="text-xs uppercase font-bold text-slate-500">Prévia dos Resultados</p>
                    <p className="text-2xl font-bold dark:text-white">4.230 <span className="text-sm text-slate-400 font-normal">empresas</span></p>
                    {[1, 2].map(i => (
                        <div key={i} className="bg-slate-50 dark:bg-[#111722] p-3 rounded-xl border-slate-100 dark:border-slate-800 border flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Building className="h-5 w-5" /></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold dark:text-white">TechFlow Solutions Ltda</p>
                                <p className="text-xs text-slate-500">São Paulo, SP</p>
                            </div>
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded">Software</span>
                        </div>
                    ))}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t dark:from-background-dark from-background-light pt-8 z-40 pb-24 md:pb-4">
                <Button className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={() => navigate('/automation/new')}>
                    <Rocket className="h-5 w-5 mr-2" /> Iniciar Campanha
                </Button>
            </div>
        </Layout>
    );
};
