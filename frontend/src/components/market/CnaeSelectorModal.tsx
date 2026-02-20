import React, { useState, useEffect } from 'react';
import { marketApi } from '../../lib/api';
import type { CnaeDto } from '../../lib/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChevronRight, Search, Check, Folder, FileText } from 'lucide-react';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

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
            const data = await marketApi.getCnaes(parentId);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemClick = (item: CnaeDto) => {
        // Simple heuristic: if it has 7 digits it's a leaf (Subclasse)
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
        <Modal isOpen={isOpen} onClose={onClose} title="Selecionar CNAEs">
            <div className="space-y-4">
                <Input
                    icon={<Search className="h-5 w-5" />}
                    placeholder="Filtrar nesta lista..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs font-semibold text-slate-500 whitespace-nowrap scrollbar-hide">
                    <button
                        onClick={() => setPath([])}
                        className={cn("hover:text-primary transition-colors", path.length === 0 && "text-primary")}
                    >
                        Raiz
                    </button>
                    {path.map((p, i) => (
                        <React.Fragment key={p.id}>
                            <ChevronRight className="h-3 w-3 shrink-0" />
                            <button
                                onClick={() => setPath(path.slice(0, i + 1))}
                                className={cn("hover:text-primary transition-colors max-w-[120px] truncate", i === path.length - 1 && "text-primary")}
                            >
                                {p.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="border dark:border-slate-800 rounded-2xl divide-y dark:divide-slate-800 h-[350px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400">Carregando...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">Nenhum item encontrado.</div>
                    ) : (
                        filteredItems.map(item => {
                            const isSelected = tempSelected.some(x => x.codigo === item.codigo);
                            const isLeaf = item.codigo.length === 7;

                            return (
                                <div
                                    key={item.codigo}
                                    className={cn(
                                        "p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                        isSelected && "bg-primary/5"
                                    )}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded flex items-center justify-center shrink-0",
                                        isLeaf ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                    )}>
                                        {isLeaf ? <FileText className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400">{item.codigo}</p>
                                        <p className="text-sm font-medium dark:text-white line-clamp-1">{item.descricao}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                            isSelected ? "bg-primary border-primary text-white" : "border-slate-200 dark:border-slate-700"
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
                        })
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
                    <p className="text-sm text-slate-500 font-medium">{tempSelected.length} selecionados</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                        <Button size="sm" onClick={handleConfirm}>Confirmar</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
