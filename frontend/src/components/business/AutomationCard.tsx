import { Card } from '../ui/Card';
import { MessageSquare, ToggleLeft } from 'lucide-react';

interface AutomationProps {
    title: string;
    count: string;
    img: string;
    onClick?: () => void;
}

export const AutomationCard = ({ title, count, img, onClick }: AutomationProps) => {
    return (
        <Card onClick={onClick} className="flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-primary text-xs font-bold uppercase">{count}</p>
                    <p className="font-bold dark:text-white text-slate-900">{title}</p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <MessageSquare className="h-3 w-3 text-green-500" />
                        <span>Canal: WhatsApp</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full w-fit">
                    <ToggleLeft className="h-3 w-3 text-primary" />
                    <span className="text-xs font-bold text-primary">Ativado</span>
                </div>
            </div>
            <div className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${img})` }}></div>
        </Card>
    );
};
