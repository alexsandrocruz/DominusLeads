import React, { useState, useEffect } from 'react';
import { getCnaes, type CnaeDto } from '@/lib/services/MarketService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, Search, Check, Folder, FileText, Loader2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface CnaeSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (cnaes: CnaeDto[]) => void;
    selectedCnaes: CnaeDto[];
}

export const CnaeSelectorModal: React.FC<CnaeSelectorModalProps> = ({ isOpen, onClose, onSelect, selectedCnaes }) => {
    const [path, setPath] = useState<{ id: string, name: string }[]>([]);
    const [items, setItems] = useState<CnaeDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSelected, setTempSelected] = useState<CnaeDto[]>(selectedCnaes);

    useEffect(() => {
        if (isOpen) {
            setTempSelected(selectedCnaes);
            loadCnaes(path.length > 0 ? path[path.length - 1].id : undefined);
        }
    }, [isOpen, path, selectedCnaes]);

    const loadCnaes = async (parentId?: string) => {
        setIsLoading(true);
        try {
            const response = await getCnaes(parentId);
            setItems(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemClick = (item: CnaeDto) => {
        if (item.codigo.length < 7) {
            setPath([...path, { id: item.codigo, name: item.descricao }]);
        } else {
            toggleSelect(item);
        }
    };

    const toggleSelect = (item: CnaeDto) => {
        if (tempSelected.find(x => x.codigo === item.codigo)) {
            setTempSelected(tempSelected.filter(x => x.codigo !== item.codigo));
        } else {
            setTempSelected([...tempSelected, item]);
        }
    };

    const handleConfirm = () => {
        onSelect(tempSelected);
        onClose();
    };

    const filteredItems = items.filter(item =>
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.includes(searchTerm)
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Selecionar CNAEs</DialogTitle>
                </DialogHeader>

                <div className="px-6 space-y-4 flex-1 flex flex-col min-h-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder="Filtrar CNAEs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-bold text-muted-foreground whitespace-nowrap scrollbar-hide border-b italic">
                        <button
                            onClick={() => setPath([])}
                            className={cn("flex items-center gap-1 hover:text-primary transition-colors uppercase", path.length === 0 && "text-primary")}
                        >
                            <Home className="h-3 w-3" /> Raiz
                        </button>
                        {path.map((p, i) => (
                            <React.Fragment key={p.id}>
                                <ChevronRight className="h-3 w-3 shrink-0" />
                                <button
                                    onClick={() => setPath(path.slice(0, i + 1))}
                                    className={cn("hover:text-primary transition-colors max-w-[150px] truncate uppercase", i === path.length - 1 && "text-primary")}
                                >
                                    {p.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    <ScrollArea className="flex-1 border rounded-md">
                        {isLoading ? (
                            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm font-medium">Carregando catálogo...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p className="text-sm">Nenhum item encontrado.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredItems.map(item => {
                                    const isSelected = tempSelected.some(x => x.codigo === item.codigo);
                                    const isLeaf = item.codigo.length === 7;

                                    return (
                                        <div
                                            key={item.codigo}
                                            className={cn(
                                                "p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors group",
                                                isSelected && "bg-primary/5"
                                            )}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className={cn(
                                                "h-8 w-8 rounded flex items-center justify-center shrink-0 transition-colors",
                                                isLeaf ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            )}>
                                                {isLeaf ? <FileText className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-muted-foreground/60">{item.codigo}</p>
                                                <p className="text-xs font-semibold leading-tight line-clamp-2">{item.descricao}</p>
                                            </div>
                                            <div
                                                className={cn(
                                                    "h-5 w-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ml-2",
                                                    isSelected ? "bg-primary border-primary text-white scale-110" : "border-muted group-hover:border-primary/50"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelect(item);
                                                }}
                                            >
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-6 bg-muted/30 border-t">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs font-bold text-primary">{tempSelected.length} selecionados</p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                            <Button size="sm" onClick={handleConfirm} className="font-bold">Aplicar Seleção</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
