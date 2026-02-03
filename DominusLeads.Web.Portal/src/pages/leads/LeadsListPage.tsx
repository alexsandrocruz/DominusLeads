import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, MoreVertical, ExternalLink, Mail, Phone, MapPin, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeadsListPage() {
    const leads = [
        { id: 1, name: "Tech Solutions Ltda", segment: "Tecnologia", location: "São Paulo, SP", status: "Validado", score: 95 },
        { id: 2, name: "Green Energy Corp", segment: "Energia", location: "Curitiba, PR", status: "Novo", score: 82 },
        { id: 3, name: "Logistics Pro", segment: "Logística", location: "Rio de Janeiro, RJ", status: "Validado", score: 88 }
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Minha Base de Leads</h1>
                        <p className="text-muted-foreground font-medium italic">Gerencie e acompanhe o progresso de suas prospecções.</p>
                    </div>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Users className="h-4 w-4" />
                        Exportar Base
                    </Button>
                </div>

                <div className="grid gap-4">
                    {leads.map((lead) => (
                        <Card key={lead.id} className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Building className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg leading-none">{lead.name}</h3>
                                                <Badge variant={lead.status === 'Validado' ? 'secondary' : 'outline'} className={cn(
                                                    lead.status === 'Validado' ? 'bg-emerald-100 text-emerald-700' : ''
                                                )}>
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1"><Building className="h-3 w-3" /> {lead.segment}</div>
                                                <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.location}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Score</p>
                                            <p className="text-2xl font-black text-primary">{lead.score}%</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-10 w-10"><Phone className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" className="h-10 w-10"><Mail className="h-4 w-4" /></Button>
                                            <Button className="font-bold gap-2">
                                                Detalhes
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}

