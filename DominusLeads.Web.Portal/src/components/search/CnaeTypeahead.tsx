import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Building, X } from "lucide-react";
import cnaesData from "@/data/cnaes.json";

interface CnaeEntry {
    cod: string;
    desc: string;
}

interface CnaeTypeaheadProps {
    value: string;
    onChange: (code: string, description: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function CnaeTypeahead({ value, onChange, onKeyDown }: CnaeTypeaheadProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDesc, setSelectedDesc] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const allCnaes = cnaesData as CnaeEntry[];

    const filtered = useMemo(() => {
        if (!query || query.length < 2) return [];
        const q = query.toUpperCase();
        return allCnaes
            .filter((c) => c.desc.includes(q) || c.cod.includes(q))
            .slice(0, 20);
    }, [query, allCnaes]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
        if (listRef.current && highlightIndex >= 0) {
            const item = listRef.current.children[highlightIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [highlightIndex]);

    const handleSelect = (entry: CnaeEntry) => {
        setQuery("");
        setSelectedDesc(`${entry.cod} — ${entry.desc}`);
        setIsOpen(false);
        onChange(entry.cod, entry.desc);
    };

    const handleClear = () => {
        setQuery("");
        setSelectedDesc("");
        onChange("", "");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setSelectedDesc("");
        setHighlightIndex(0);
        setIsOpen(val.length >= 2);
        // If user types just digits, pass as code directly
        if (/^\d{5,7}$/.test(val.replace(/[^0-9]/g, ""))) {
            onChange(val.replace(/[^0-9]/g, ""), "");
        } else {
            onChange("", "");
        }
    };

    const handleKeyDownInternal = (e: React.KeyboardEvent) => {
        if (isOpen && filtered.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                handleSelect(filtered[highlightIndex]);
                return;
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        }
        onKeyDown?.(e);
    };

    return (
        <div ref={containerRef} className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
            {selectedDesc ? (
                <div className="flex items-center h-11 pl-10 pr-10 border rounded-md border-primary/20 bg-background text-sm">
                    <span className="truncate font-medium">{selectedDesc}</span>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <Input
                    placeholder='Código ou descrição... Ex: "DENTISTA"'
                    className="pl-10 h-11 border-primary/20 focus-visible:ring-primary"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDownInternal}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
            )}

            {isOpen && filtered.length > 0 && (
                <ul
                    ref={listRef}
                    className="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-background border border-border rounded-lg shadow-xl"
                >
                    {filtered.map((entry, idx) => (
                        <li
                            key={entry.cod}
                            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${idx === highlightIndex
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted/50"
                                }`}
                            onMouseEnter={() => setHighlightIndex(idx)}
                            onClick={() => handleSelect(entry)}
                        >
                            <span className="font-mono text-xs text-muted-foreground mr-2">
                                {entry.cod}
                            </span>
                            <span className="capitalize">
                                {entry.desc.toLowerCase()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.length >= 2 && filtered.length === 0 && (
                <div className="absolute z-50 w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg shadow-xl text-sm text-muted-foreground">
                    Nenhum CNAE encontrado para "{query}"
                </div>
            )}
        </div>
    );
}
