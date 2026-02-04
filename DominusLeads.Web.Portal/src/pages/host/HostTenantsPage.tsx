import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
    Search,
    Filter,
    MoreVertical,
    AlertTriangle,
    ShieldCheck,
    Ban,
    History,
    ChevronRight,
    Users,
    Zap,
    Plus,
    Building2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function HostTenantsPage() {
    const [tenants] = useState([
        {
            id: "tenant_88291",
            name: "Tech Solutions Ltda",
            plan: "ENTERPRISE",
            status: "ATIVO",
            credits: { used: 942, total: 1000 },
            abuse: 85,
            lastAccess: "há 2 min",
            color: "bg-amber-500"
        },
        {
            id: "tenant_44120",
            name: "Inova Digital",
            plan: "PREMIUM",
            status: "ATIVO",
            credits: { used: 125, total: 500 },
            abuse: 12,
            lastAccess: "há 5 min",
            color: "bg-primary"
        },
        {
            id: "tenant_11055",
            name: "Alpha Marketing",
            plan: "BASIC",
            status: "SUSPENSO",
            credits: { used: 50, total: 50 },
            abuse: 0,
            lastAccess: "01 Out",
            color: "bg-slate-400"
        }
    ]);

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-8 pb-32">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-black tracking-tight">Gestão de Tenants</h1>
                            <Badge variant="outline" className="text-[10px] font-black italic text-primary border-primary/20">24 ATIVOS</Badge>
                        </div>
                        <p className="text-muted-foreground font-medium italic">Monitoramento em tempo real de uso, faturamento e conformidade.</p>
                    </div>
                    <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                        <Plus className="size-5" />
                        Criar Novo Cliente
                    </Button>
                </div>

                {/* Filters & Search */}
                <Card className="border-muted shadow-lg shadow-slate-200/40 rounded-[2rem] overflow-hidden bg-white">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Buscar por nome da empresa ou ID..."
                                className="h-12 pl-12 rounded-xl bg-muted/20 border-transparent focus:bg-white focus:border-primary transition-all font-bold"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-12 rounded-xl border-muted gap-2 font-bold italic">
                                <Filter className="size-4" />
                                Plano
                            </Button>
                            <Button variant="outline" className="h-12 rounded-xl border-muted gap-2 font-bold italic">
                                <Activity className="size-4" />
                                Status
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tenant List */}
                <div className="space-y-4">
                    {tenants.map((tenant) => (
                        <Card
                            key={tenant.id}
                            className={cn(
                                "border-muted hover:border-primary/20 transition-all rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-xl group",
                                tenant.status === "SUSPENSO" && "opacity-60 bg-slate-50 border-dashed"
                            )}
                        >
                            <CardContent className="p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Tenant Info */}
                                    <div className="flex-1 flex gap-6">
                                        <div className={cn("size-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg group-hover:scale-110 transition-transform", tenant.color)}>
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-xl font-black tracking-tight">{tenant.name}</h4>
                                                <Badge className={cn(
                                                    "text-[9px] font-black tracking-widest px-2 py-0.5 border-none",
                                                    tenant.plan === "ENTERPRISE" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
                                                )}>
                                                    {tenant.plan}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground italic">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="size-3" />
                                                    ID: {tenant.id}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="size-3" />
                                                    Último acesso: {tenant.lastAccess}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage Stats */}
                                    <div className="lg:w-72 space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <span>Créditos de Robô</span>
                                            <span className={cn(tenant.credits.used / tenant.credits.total > 0.9 ? "text-rose-500" : "text-primary")}>
                                                {tenant.credits.used} / {tenant.credits.total}
                                            </span>
                                        </div>
                                        <Progress value={(tenant.credits.used / tenant.credits.total) * 100} className="h-2" />
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    {tenant.abuse > 50 ? (
                                                        <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 uppercase tracking-tighter">
                                                            <AlertTriangle className="size-3" />
                                                            ALERTA ABUSO: {tenant.abuse}/100
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase tracking-tighter">
                                                            <ShieldCheck className="size-3" />
                                                            SEGURO: {tenant.abuse}/100
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className={cn(
                                                "text-[9px] font-black rounded-full h-5",
                                                tenant.status === "ATIVO" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            )}>
                                                {tenant.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Button variant="ghost" className="h-12 rounded-xl italic font-black text-[12px] text-primary gap-2 hover:bg-primary/5">
                                            LOGS TÉCNICOS
                                            <ChevronRight className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-12 rounded-xl border border-muted/50">
                                            <MoreVertical className="size-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Abuse Detection Floating Info */}
                <div className="bg-rose-500 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-rose-200">
                    <div className="size-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <Zap className="size-8" />
                    </div>
                    <div className="space-y-1 flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black tracking-tight italic">Detectamos comportamentos atípicos.</h3>
                        <p className="text-sm font-medium opacity-80 italic leading-relaxed">
                            3 tenants estão com volume de disparos 10x acima da média. Clique para investigar possíveis infrações de spam ou automação excessiva.
                        </p>
                    </div>
                    <Button className="bg-white text-rose-500 h-14 px-8 rounded-2xl font-black gap-2 hover:bg-rose-50 shadow-xl transition-all">
                        Investigar Agora
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
