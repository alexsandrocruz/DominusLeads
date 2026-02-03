import React from 'react';
import { CheckCircle2, Circle, AlertTriangle, HelpCircle, Target } from 'lucide-react';
import type { ChecklistItem, Document } from '../../mocks/documentMocks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ChecklistSidebarProps {
    items: ChecklistItem[];
    documents: Document[];
}

const ChecklistSidebar: React.FC<ChecklistSidebarProps> = ({ items, documents }) => {
    const getStatus = (itemId: string, docTypeId: string) => {
        const doc = documents.find(d => d.documentTypeId === docTypeId);
        if (!doc) return 'NotFound';
        if (doc.ocrConfidence && doc.ocrConfidence < 90) return 'Uncertain';
        return 'Found';
    };

    const statusIcons = {
        Found: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        NotFound: <Circle className="w-5 h-5 text-muted-foreground/30" />,
        Uncertain: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        Partial: <HelpCircle className="w-5 h-5 text-blue-500" />,
    };

    const stats = items.reduce((acc, item) => {
        const status = getStatus(item.id, item.documentTypeId);
        if (status === 'Found') acc.found++;
        acc.total++;
        return acc;
    }, { found: 0, total: 0 });

    const completion = Math.round((stats.found / stats.total) * 100);

    return (
        <Card className="h-full flex flex-col rounded-3xl border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="p-6 border-b pb-8">
                <div className="flex items-center justify-between mb-6">
                    <CardTitle className="text-xl font-bold">Checklist de Inicial</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Target className="size-5 text-primary" />
                    </div>
                </div>

                {/* Completion Gauge */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
                            Completude do Dossiê
                        </span>
                        <span className="text-2xl font-black text-primary leading-none">
                            {completion}%
                        </span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            style={{ width: `${completion}%` }}
                            className="h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-6 overflow-auto scrollbar-thin scrollbar-thumb-muted">
                <div className="space-y-6">
                    {items.map((item) => {
                        const status = getStatus(item.id, item.documentTypeId);
                        return (
                            <div key={item.id} className="group flex gap-4 transition-all hover:translate-x-1">
                                <div className="mt-0.5 shrink-0">
                                    {statusIcons[status]}
                                </div>
                                <div className="min-w-0">
                                    <h4 className={`text-sm font-bold leading-tight truncate ${status === 'NotFound' ? 'text-muted-foreground/50' : 'text-foreground'
                                        }`}>
                                        {item.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {item.isMandatory && (
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter h-4 px-1.5 border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10">
                                                Obrigatório
                                            </Badge>
                                        )}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'Found' ? 'text-emerald-500' : status === 'Uncertain' ? 'text-amber-500' : 'text-muted-foreground/40'
                                            }`}>
                                            {status === 'Found' ? 'Verificado' : status === 'Uncertain' ? 'Revisar' : 'Aguardando'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            <div className="p-6 border-t bg-muted/5">
                <Button
                    disabled={completion < 100}
                    className="w-full h-14 rounded-2xl font-bold text-base shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                    {completion === 100 ? 'Validar e Iniciar Ação' : 'Concluir Documentação'}
                </Button>
            </div>
        </Card>
    );
};

export default ChecklistSidebar;
