import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
    Building2,
    Users,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Plus,
    MoreVertical,
    Save,
    UserPlus,
    UserCircle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CompanySettingsPage() {
    const [activeTab, setActiveTab] = useState<"company" | "team">("company");

    const team = [
        { name: "Alexsandro Cruz", email: "alex@dominus.com", role: "Admin", status: "Ativo" },
        { name: "Felipe Mendes", email: "felipe@dominus.com", role: "Manager", status: "Ativo" },
        { name: "SDR 01", email: "sdr1@dominus.com", role: "User", status: "Pendente" }
    ];

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações do Tenant</h1>
                    <p className="text-muted-foreground font-medium italic">Gerencie os dados da sua operação e sua equipe de prospecção.</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-6 border-b border-primary/10 pb-px">
                    <button
                        onClick={() => setActiveTab("company")}
                        className={cn(
                            "text-sm font-bold pb-3 px-1 transition-all border-b-2",
                            activeTab === "company" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Building2 className="size-4" />
                            Dados da Empresa
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("team")}
                        className={cn(
                            "text-sm font-bold pb-3 px-1 transition-all border-b-2",
                            activeTab === "team" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            Gerenciamento de Equipe
                            <Badge variant="outline" className="text-[10px] h-4 px-1 ml-1">{team.length}</Badge>
                        </div>
                    </button>
                </div>

                {activeTab === "company" ? (
                    <div className="grid gap-6 animate-in fade-in duration-300">
                        <Card className="border-muted shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-lg font-black flex items-center gap-2">
                                    <ShieldCheck className="size-5 text-primary" />
                                    Informações Jurídicas e Técnicas
                                </CardTitle>
                                <CardDescription className="text-xs font-medium">Estes dados são usados para personalização automática e faturamento.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Nome Fantasia</label>
                                        <Input defaultValue="Dominus Leads Solutions" className="h-12 bg-muted/20 border-muted rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">CNPJ / Identificação</label>
                                        <Input defaultValue="45.123.456/0001-89" className="h-12 bg-muted/20 border-muted rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">E-mail de Contato</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-4 size-4 text-muted-foreground" />
                                            <Input defaultValue="contato@dominus.com" className="h-12 bg-muted/20 border-muted rounded-xl font-bold pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Telefone / WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-4 size-4 text-muted-foreground" />
                                            <Input defaultValue="+55 (11) 98765-4321" className="h-12 bg-muted/20 border-muted rounded-xl font-bold pl-10" />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-muted" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-primary" />
                                        <h4 className="text-sm font-black">Endereço da Operação</h4>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <Input placeholder="Logradouro" defaultValue="Av. Paulista, 1000" className="h-12 bg-muted/20 border-muted rounded-xl font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <Input placeholder="CEP" defaultValue="01310-100" className="h-12 bg-muted/20 border-muted rounded-xl font-medium" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button className="h-12 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                                        <Save className="size-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black tracking-tight">Membros da Equipe</h3>
                            <Button className="h-10 rounded-xl font-bold gap-2 shadow-md">
                                <UserPlus className="size-4" />
                                Convidar Membro
                            </Button>
                        </div>

                        <div className="grid gap-3">
                            {team.map((member, idx) => (
                                <Card key={idx} className="border-muted hover:border-primary/20 transition-all rounded-2xl overflow-hidden group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <UserCircle className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black">{member.name}</h4>
                                                <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Permissão</p>
                                                <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">{member.role}</Badge>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Status</p>
                                                <Badge className={cn(
                                                    "text-[10px] font-bold px-2 py-0 border-none",
                                                    member.status === 'Ativo' ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"
                                                )}>
                                                    {member.status}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreVertical className="size-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
