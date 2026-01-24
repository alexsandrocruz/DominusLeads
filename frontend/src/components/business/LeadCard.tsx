import { cn } from '../../lib/utils';
import { Card } from '../ui/Card';
import { ArrowRight } from 'lucide-react';

interface LeadProps {
    name: string;
    sub: string;
    status: string;
    color: 'green' | 'blue' | 'primary' | string;
    img: string;
    onClick?: () => void;
}

export const LeadCard = ({ name, sub, status, color, img, onClick }: LeadProps) => {
    const isGreen = color === 'green' || color === 'bg-accent-green' || color.includes('green');
    const statusColor = isGreen ? 'text-accent-green' : 'text-primary';
    const dotColor = isGreen ? 'bg-accent-green' : 'bg-primary';

    return (
        <Card className="flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", dotColor)}></span>
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider", statusColor)}>{status}</p>
                    </div>
                    <h3 className="font-bold dark:text-white text-slate-900">{name}</h3>
                    <p className="text-slate-500 text-xs">{sub}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-center bg-cover border dark:border-slate-700 shrink-0" style={{ backgroundImage: `url(${img})` }}></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 dark:border-card-dark bg-slate-300 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="w-6 h-6 rounded-full border-2 dark:border-card-dark bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">AS</div>
                </div>
                <div className="flex items-center gap-1 rounded-lg h-8 px-3 bg-slate-100 dark:bg-slate-800 text-xs font-semibold dark:text-white">
                    <span>Detalhes</span>
                    <ArrowRight className="h-3 w-3" />
                </div>
            </div>
        </Card>
    );
};
