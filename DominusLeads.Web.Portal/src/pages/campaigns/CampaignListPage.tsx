import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Plus,
    Search,
    MoreVertical,
    Play,
    Pause,
    BarChart2,
    MessageSquare,
    Mail,
    Smartphone,
    TrendingUp,
    Users,
    Zap,
    Clock
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function CampaignListPage() {
    const [, setLocation] = useLocation();

    const stats = [
        { label: "Campanhas Ativas", value: "12", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "Leads Impactados", value: "2.840", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Média de Conversão", value: "8.4%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    const campaigns = [
        {
            id: 1,
            name: "Prospecção - Tecnologia SP",
            channel: "WhatsApp",
            status: "Running",
            sent: 1250,
            responses: 142,
            ctr: "11.3%",
            lastActivity: "Há 5 min"
        },
        {
            id: 2,
            name: "Nurturing - Leads Frios",
            channel: "Email",
            status: "Paused",
            sent: 840,
            responses: 24,
            ctr: "2.8%",
            lastActivity: "Ontem"
        },
        {
            id: 3,
            name: "Follow-up - Clientes Base",
            channel: "SMS",
            status: "Draft",
            sent: 0,
            responses: 0,
            ctr: "0%",
            lastActivity: "Há 2h"
        }
    ];

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'WhatsApp': return <MessageSquare className="size-4" />;
            case 'Email': return <Mail className="size-4" />;
            case 'SMS': return <Smartphone className="size-4" />;
            default: return <Zap className="size-4" />;
        }
    };

    return (
        <AppShell>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Campanhas</h1>
                        <p className="text-muted-foreground font-medium italic">Visualize e controle seus robôs de prospecção e engajamento.</p>
                    </div>
                    <Button
                        onClick={() => setLocation("/campaigns/config")}
                        className="h-12 px-6 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus className="size-4" />
                        Nova Campanha
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid sm:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-muted shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Campaign List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <BarChart2 className="size-5 text-primary" />
                            Minhas Campanhas
                        </h3>
                    </div>

                    <div className="grid gap-4">
                        {campaigns.map((camp) => (
                            <Card key={camp.id} className="border-muted hover:border-primary/20 transition-all rounded-[2rem] overflow-hidden group bg-white shadow-lg shadow-slate-200/40">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-12 items-center divide-x divide-muted">
                                        {/* Status & Name */}
                                        <div className="md:col-span-5 p-6 flex items-center gap-4">
                                            <div className={cn(
                                                "size-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                                                camp.status === 'Running' ? "bg-emerald-500/10 text-emerald-600" :
                                                    camp.status === 'Paused' ? "bg-orange-500/10 text-orange-600" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {camp.status === 'Running' ? <Play className="size-5 fill-current" /> :
                                                    camp.status === 'Paused' ? <Pause className="size-5 fill-current" /> : <Clock className="size-5" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase border-none px-2 py-0",
                                                        camp.channel === 'WhatsApp' ? "bg-emerald-100 text-emerald-700" :
                                                            camp.channel === 'Email' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                                                    )}>
                                                        {getChannelIcon(camp.channel)}
                                                        <span className="ml-1">{camp.channel}</span>
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground font-bold italic">{camp.lastActivity}</span>
                                                </div>
                                                <h4 className="text-md font-black tracking-tight group-hover:text-primary transition-colors">{camp.name}</h4>
                                            </div>
                                        </div>

                                        {/* Metrics */}
                                        <div className="md:col-span-5 p-6 grid grid-cols-3 gap-6 bg-muted/5">
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Enviados</p>
                                                <p className="text-sm font-black">{camp.sent.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Respostas</p>
                                                <p className="text-sm font-black">{camp.responses}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Conv. (CTR)</p>
                                                <p className="text-sm font-black text-primary">{camp.ctr}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-2 p-6 flex items-center justify-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-xl border-muted hover:border-primary hover:text-primary shadow-sm"
                                                onClick={() => setLocation("/campaigns/config")}
                                            >
                                                <Zap className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreVertical className="size-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
