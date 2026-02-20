import React from 'react';
import { type MarketVerticalDto } from '@/lib/services/MarketService';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface VerticalSelectorProps {
    verticals: MarketVerticalDto[];
    selectedId?: string;
    onSelect: (id: string | undefined) => void;
}

export const VerticalSelector: React.FC<VerticalSelectorProps> = ({ verticals, selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {verticals.map((vertical) => {
                const IconComponent = (LucideIcons as any)[vertical.icone || 'Building2'] || LucideIcons.Building2;

                return (
                    <Card
                        key={vertical.id}
                        className={cn(
                            "cursor-pointer transition-all border-2 hover:border-primary/50",
                            selectedId === vertical.id
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                : "border-border"
                        )}
                        onClick={() => onSelect(selectedId === vertical.id ? undefined : vertical.id)}
                    >
                        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                selectedId === vertical.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                                <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs line-clamp-1">{vertical.nome}</h4>
                                <p className="text-[10px] text-muted-foreground line-clamp-1">{vertical.descricao}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
