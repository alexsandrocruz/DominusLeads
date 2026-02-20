import React, { useMemo, useRef } from "react";
import type {
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building, MapPin, Star, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadDto } from "@/lib/services/LeadService";

export const LeadStatus = {
    Novo: 1,
    Contatado: 2,
    Qualificado: 3,
    Proposta: 4,
    Fechado: 5,
    Descartado: 6,
} as const;

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];

const COLUMNS = [
    { id: LeadStatus.Novo, title: "Novo", color: "bg-slate-500" },
    { id: LeadStatus.Contatado, title: "Contatado", color: "bg-blue-500" },
    { id: LeadStatus.Qualificado, title: "Qualificado", color: "bg-purple-500" },
    { id: LeadStatus.Proposta, title: "Proposta", color: "bg-amber-500" },
    { id: LeadStatus.Fechado, title: "Fechado", color: "bg-emerald-500" },
];

// Column IDs are prefixed to distinguish from lead IDs
function colId(statusId: number) {
    return `column-${statusId}`;
}

function statusFromColId(id: string): number | null {
    if (id.startsWith("column-")) {
        return parseInt(id.replace("column-", ""), 10);
    }
    return null;
}

interface KanbanBoardProps {
    leads: LeadDto[];
    onStatusChange: (leadId: string, newStatus: number) => void;
    onLeadClick: (lead: LeadDto) => void;
}

export function KanbanBoard({ leads, onStatusChange, onLeadClick }: KanbanBoardProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columnsData = useMemo(() => {
        const data: Record<number, LeadDto[]> = {};
        COLUMNS.forEach((col) => {
            data[col.id] = leads.filter((l) => l.status === col.id);
        });
        return data;
    }, [leads]);

    const activeLead = useMemo(
        () => leads.find((l) => l.id === activeId),
        [activeId, leads]
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const leadId = active.id as string;
        const overId = over.id as string;

        let newStatus: number | null = null;

        // Dropped on a column droppable?
        const colStatus = statusFromColId(overId);
        if (colStatus !== null) {
            newStatus = colStatus;
        } else {
            // Dropped on another lead — use that lead's status
            const overLead = leads.find((l) => l.id === overId);
            if (overLead) {
                newStatus = overLead.status;
            }
        }

        const lead = leads.find((l) => l.id === leadId);
        if (lead && newStatus !== null && lead.status !== newStatus) {
            onStatusChange(leadId, newStatus);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 h-[calc(100vh-12rem)] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                {COLUMNS.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        color={column.color}
                        leads={columnsData[column.id] || []}
                        onLeadClick={onLeadClick}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
                {activeLead ? (
                    <div className="w-72 rotate-3 cursor-grabbing">
                        <LeadCard lead={activeLead} isDragging onLeadClick={() => { }} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

interface KanbanColumnProps {
    id: number;
    title: string;
    color: string;
    leads: LeadDto[];
    onLeadClick: (lead: LeadDto) => void;
}

function KanbanColumn({ id, title, color, leads, onLeadClick }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: colId(id),
    });

    return (
        <div className={cn(
            "flex flex-col w-72 shrink-0 bg-muted/30 rounded-xl border border-muted/50 transition-colors",
            isOver && "border-primary/50 bg-primary/5"
        )}>
            <div className="p-3 flex items-center justify-between sticky top-0 bg-muted/30 backdrop-blur-sm z-10 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <div className={cn("size-2 rounded-full", color)} />
                    <h3 className="font-black text-sm uppercase tracking-wider">{title}</h3>
                    <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-[10px] font-bold">
                        {leads.length}
                    </Badge>
                </div>
                <MoreVertical className="size-4 text-muted-foreground cursor-pointer" />
            </div>

            <div ref={setNodeRef} className="flex-1 p-2 overflow-y-auto">
                <SortableContext
                    id={id.toString()}
                    items={leads.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3 min-h-[100px]">
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
                        ))}
                        {leads.length === 0 && (
                            <div className={cn(
                                "h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors",
                                isOver ? "border-primary/40 bg-primary/5" : "border-muted-foreground/10"
                            )}>
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                    {isOver ? "Soltar aqui" : "Vazio"}
                                </span>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

interface LeadCardProps {
    lead: LeadDto;
    isDragging?: boolean;
    onLeadClick: (lead: LeadDto) => void;
}

function LeadCard({ lead, isDragging, onLeadClick }: LeadCardProps) {
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    // Only fire click if the pointer didn't move (i.e., not a drag)
    const handlePointerDown = (e: React.PointerEvent) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: React.MouseEvent) => {
        if (pointerDownPos.current) {
            const dx = Math.abs(e.clientX - pointerDownPos.current.x);
            const dy = Math.abs(e.clientY - pointerDownPos.current.y);
            // If pointer moved more than 5px, it was a drag — don't navigate
            if (dx > 5 || dy > 5) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        onLeadClick(lead);
    };

    if (isSortableDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-24 bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl opacity-50"
            />
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all border-none shadow-md shadow-slate-200/50 group bg-white",
                isDragging && "shadow-2xl ring-2 ring-primary/20 border-primary"
            )}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
        >
            <CardContent className="p-3" {...attributes} {...listeners}>
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black line-clamp-1 group-hover:text-primary transition-colors">
                            {lead.nomeFantasia || lead.razaoSocial}
                        </h4>
                        <div className="flex items-center gap-0.5 text-primary shrink-0">
                            <Star className="size-3 fill-current" />
                            <span className="text-[10px] font-black">{lead.score}%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                            <Building className="size-3" />
                            <span className="truncate">{lead.cnaePrincipal}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                            <MapPin className="size-3" />
                            <span>{lead.cidade}, {lead.uf}</span>
                        </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                        <Badge variant="outline" className="text-[8px] h-4 font-bold uppercase tracking-tighter text-muted-foreground border-muted-foreground/20">
                            #{lead.cnpj.slice(-4)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
