import React from 'react';
import type { MarketVerticalDto } from '../../lib/api';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import * as LucideIcons from 'lucide-react';

interface VerticalSelectorProps {
    verticals: MarketVerticalDto[];
    selectedId?: string;
    onSelect: (id: string | undefined) => void;
}

export const VerticalSelector: React.FC<VerticalSelectorProps> = ({ verticals, selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {verticals.map((vertical) => {
                // Dynamic icon resolution
                const IconComponent = (LucideIcons as any)[vertical.icone || 'Building2'] || LucideIcons.Building2;

                return (
                    <Card
                        key={vertical.id}
                        className={cn(
                            "p-4 cursor-pointer transition-all border-2",
                            selectedId === vertical.id
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                        )}
                        onClick={() => onSelect(selectedId === vertical.id ? undefined : vertical.id)}
                    >
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                selectedId === vertical.id ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                                <IconComponent className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm dark:text-white line-clamp-1">{vertical.nome}</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{vertical.descricao}</p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
