import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { ChevronRight, User, Lock, HelpCircle, CreditCard, ChevronLeft, Edit } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Settings = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <header className="p-4 border-b dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><ChevronLeft className="h-6 w-6" /></button>
                <h2 className="text-lg font-bold dark:text-white">Perfil e Ajustes</h2>
            </header>

            <div className="p-6 flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-cover bg-center border-4 border-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMsrhnHKlHBB2FSqv0Vi1DQytsT_j8gGo-7Npua3xzMWZ-kXw0Xdrc0kkeNjgoWeZTpqGdC0g9QHrckCMUkPLBuJbfxChnfosPpHtbEL_oC2fZb5e8KH6iGvrYL5MNCEqub7B-wZBu1ankITspM_84-0yJD19NKpama9lzByfQCB_K8fv6PxrNUKzea9_-j7TUu91EkC-ZCZWggorGxdI6yQvbzkdGJEzQUs6Hp4pclfJpCe7sShy7YW70Og79jC2QA_x4LxUUTKSv")' }}></div>
                    <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 dark:border-background-dark text-white shadow-sm"><Edit className="h-4 w-4" /></div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold leading-none dark:text-white">João Silva</h3>
                    <p className="text-slate-500 mt-1">Gerente Comercial</p>
                    <span className="text-primary text-xs font-bold uppercase tracking-widest mt-2 block">Dominus Leads Pro</span>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2 px-2">Minha Conta</p>
                    <div className="bg-white dark:bg-[#1a2235] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary p-1.5 rounded-lg"><User className="h-5 w-5" /></div>
                                <span className="font-medium dark:text-white">Editar Perfil</span>
                            </div>
                            <ChevronRight className="text-slate-400 h-5 w-5" />
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary p-1.5 rounded-lg"><Lock className="h-5 w-5" /></div>
                                <span className="font-medium dark:text-white">Alterar Senha</span>
                            </div>
                            <ChevronRight className="text-slate-400 h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2 px-2">Suporte e Info</p>
                    <div className="bg-white dark:bg-[#1a2235] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800">
                        <Link to="/help" className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary p-1.5 rounded-lg"><HelpCircle className="h-5 w-5" /></div>
                                <span className="font-medium dark:text-white">Central de Ajuda</span>
                            </div>
                            <ChevronRight className="text-slate-400 h-5 w-5" />
                        </Link>
                        <Link to="/billing" className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary p-1.5 rounded-lg"><CreditCard className="h-5 w-5" /></div>
                                <span className="font-medium dark:text-white">Créditos e Faturamento</span>
                            </div>
                            <ChevronRight className="text-slate-400 h-5 w-5" />
                        </Link>
                    </div>
                </div>

                <Button variant="outline" className="w-full text-red-500 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20">
                    Sair da Conta
                </Button>
            </div>
        </Layout>
    );
};
