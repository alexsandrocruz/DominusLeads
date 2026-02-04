import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    ShieldAlert,
    ShieldCheck,
    Search,
    Bell,
    MoreHorizontal,
    ArrowUpRight,
    Search as SearchIcon,
    Filter,
    MessageCircle,
    Eye,
    Zap,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityDashboardPage() {
    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-[#0d121b] text-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                            <ShieldAlert className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight uppercase">Security Dashboard</h1>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Superadmin Oversight</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="size-11 rounded-2xl border-muted relative">
                            <Bell className="size-5" />
                            <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white" />
                        </Button>
                        <div className="size-11 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=0d88ff&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-tighter mb-1 leading-none italic">Ação Requerida</p>
                        <h2 className="text-3xl font-black tracking-tighter">Alertas Críticos</h2>
                    </div>
                    <Badge className="bg-rose-500 text-white border-none font-black italic px-3 py-1">3 AGUARDANDO</Badge>
                </div>

                {/* Critical Alerts Cards */}
                <div className="space-y-4">
                    {/* Alert Card 1 - Abuse Detected */}
                    <Card className="border-none bg-[#111827] text-white rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-slate-900/40">
                        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                            <Badge className="bg-rose-500 text-white border-none font-black italic px-4 py-1.5 uppercase tracking-tighter">Abuso Detectado</Badge>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                    <div className="size-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500">
                                        <Zap className="size-5" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">Tech Solutions Ltda</h3>
                                    <p className="text-xs font-bold text-slate-400 italic">Enterprise • ID: 88291</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-1">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 italic">Score de Risco</p>
                                    <div className="flex items-end gap-2 text-rose-500">
                                        <h4 className="text-4xl font-black tracking-tighter">85/100</h4>
                                        <ArrowUpRight className="size-5 mb-1.5" />
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-1">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 italic">Uso de Cota</p>
                                    <div className="flex items-end gap-2">
                                        <h4 className="text-4xl font-black tracking-tighter">94%</h4>
                                        <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase italic">Limiar</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 gap-2">
                                    <Eye className="size-4" />
                                    Investigar
                                </Button>
                                <Button variant="outline" className="flex-1 h-14 border-white/10 hover:bg-white/5 text-white font-black rounded-2xl gap-2">
                                    <MessageCircle className="size-4" />
                                    Contatar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alert Card 2 - Limit Exceeded */}
                    <Card className="border-none bg-[#111827] text-white rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-slate-900/40 opacity-90 hover:opacity-100 transition-all">
                        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                            <Badge className="bg-amber-500 text-slate-900 border-none font-black italic px-4 py-1.5 uppercase tracking-tighter leading-tight text-center">
                                Limite<br />Excedendo
                            </Badge>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                    <div className="size-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center">
                                        <SearchIcon className="size-5" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">Global Sales S.A</h3>
                                    <p className="text-xs font-bold text-slate-400 italic">Enterprise • ID: 99211</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 italic">Créditos: 2.840 / 3.000</p>
                                        <div className="h-2 w-72 bg-white/10 rounded-full overflow-hidden">
                                            <div className="bg-amber-500 h-full" style={{ width: "94.6%" }} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-amber-500 uppercase italic">Quase esgotado</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-2xl shadow-xl shadow-amber-500/20 gap-2">
                                    <ArrowUpRight className="size-4" />
                                    Oferecer Upgrade
                                </Button>
                                <Button variant="outline" size="icon" className="size-14 border-white/10 hover:bg-white/5 text-white rounded-2xl">
                                    <MoreHorizontal className="size-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feed Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Todos os Clientes</h3>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Filter className="size-4" />
                        </Button>
                    </div>

                    <Card className="bg-[#0f172a] border-none rounded-[2rem] p-4 flex items-center justify-between shadow-xl shadow-slate-900/20 group cursor-pointer hover:bg-[#1e293b] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-slate-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="size-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter italic">Último Evento</p>
                                <p className="text-sm font-bold text-slate-200">Tentativa de login atípica de IP C...</p>
                            </div>
                        </div>
                        <Button className="h-10 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest">
                            Ver Feed
                        </Button>
                    </Card>
                </div>

                {/* Floating Action Button */}
                <div className="fixed bottom-32 right-8 z-50">
                    <Button className="size-16 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all">
                        <Users className="size-8" />
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
