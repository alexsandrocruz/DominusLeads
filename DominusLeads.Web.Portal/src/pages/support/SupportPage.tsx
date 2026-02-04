import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
    Search,
    MessageCircle,
    BookOpen,
    Youtube,
    FileText,
    ChevronRight,
    LifeBuoy,
    Star,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportPage() {
    const categories = [
        { title: "Primeiros Passos", icon: BookOpen, count: 12, color: "bg-blue-50 text-blue-500" },
        { title: "Configurações de IA", icon: LifeBuoy, count: 8, color: "bg-purple-50 text-purple-500" },
        { title: "Financeiro & Faturas", icon: Star, count: 5, color: "bg-orange-50 text-orange-500" },
    ];

    const popularArticles = [
        "Como configurar meu primeiro robô n8n?",
        "Entendendo o custo por lead qualificado",
        "Como treinar a IA para falar igual a mim",
        "Configurando janelas de envio estratégicas"
    ];

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-8">
                {/* Search Hero */}
                <div className="text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight italic">Como podemos <span className="text-primary italic underline decoration-4 underline-offset-4">ajudar?</span></h1>
                        <p className="text-muted-foreground font-medium italic text-lg">Tutoriais, dicas estratégicas e suporte especializado DominusLeads.</p>
                    </div>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            className="h-16 pl-14 pr-6 rounded-[2rem] border-muted shadow-2xl shadow-slate-200/50 bg-white font-bold text-base focus:ring-primary focus:border-primary transition-all"
                            placeholder="Pesquisar por n8n, CRM, Créditos..."
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Card key={cat.title} className="border-muted hover:border-primary/20 transition-all cursor-pointer rounded-[2rem] overflow-hidden group bg-white shadow-sm hover:shadow-md">
                            <CardContent className="p-8 space-y-4 text-center">
                                <div className={cn("size-16 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110", cat.color)}>
                                    <cat.icon className="size-8" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-lg tracking-tight">{cat.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{cat.count} Artigos</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid md:grid-cols-5 gap-12">
                    {/* Articles List */}
                    <div className="md:col-span-3 space-y-6">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
                            <FileText className="size-5 text-primary" />
                            Mais Acessados
                        </h3>
                        <div className="divide-y divide-muted border-t border-muted">
                            {popularArticles.map((article) => (
                                <div key={article} className="group flex items-center justify-between py-5 cursor-pointer hover:bg-muted/5 transition-all">
                                    <span className="font-bold text-sm tracking-tight group-hover:text-primary group-hover:translate-x-1 transition-all">
                                        {article}
                                    </span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Channels */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
                            <MessageCircle className="size-5 text-primary" />
                            Contato Direto
                        </h3>
                        <div className="space-y-4">
                            <Card className="border-muted rounded-[2rem] overflow-hidden bg-primary text-white shadow-xl shadow-primary/20 p-8 space-y-4 group cursor-pointer hover:brightness-110 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <MessageCircle className="size-6" />
                                    </div>
                                    <ArrowUpRight className="size-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xl italic tracking-tight">WhatsApp VIP</h4>
                                    <p className="text-xs font-bold opacity-80 leading-relaxed italic">Atendimento especializado de Segunda a Sexta das 9h às 18h.</p>
                                </div>
                            </Card>

                            <Card className="border-muted rounded-[2rem] overflow-hidden bg-white shadow-lg shadow-slate-200/40 p-8 space-y-4 group cursor-pointer hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                        <Youtube className="size-6" />
                                    </div>
                                    <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary transition-opacity" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xl italic tracking-tight">Canal de Tutoriais</h4>
                                    <p className="text-xs font-bold text-muted-foreground opacity-80 leading-relaxed italic">Vídeos rápidos ensinando a dominar todas as ferramentas.</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
