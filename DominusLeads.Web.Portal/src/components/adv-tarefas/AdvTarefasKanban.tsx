import { useState, useMemo } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    Clock,
    MessageSquare,
    MoreHorizontal,
    Calendar,
    AlertCircle,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useUpdateAdvTarefas } from "@/lib/abp/hooks/useAdvTarefases";
import { toast } from "sonner";

interface TaskCardProps {
    task: any;
    onEdit: (id: string) => void;
}

function TaskCard({ task, onEdit }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isOverdue = task.dataParaFinalizacao && new Date(task.dataParaFinalizacao) < new Date() && !task.finalizado;
    const isDueToday = task.dataParaFinalizacao && new Date(task.dataParaFinalizacao).toLocaleDateString() === new Date().toLocaleDateString() && !task.finalizado;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative"
        >
            <Card
                className={cn(
                    "mb-3 border-none shadow-sm cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/50 transition-all duration-200 bg-card overflow-hidden",
                    isOverdue && "ring-1 ring-red-500/30 bg-red-500/5",
                    isDueToday && "ring-1 ring-orange-500/30 bg-orange-500/5",
                    isDragging && "opacity-50"
                )}
                {...attributes}
                {...listeners}
                onClick={() => {
                    if (!isDragging) {
                        onEdit(task.id);
                    }
                }}
            >
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                            {task.descricao || "Sem descrição"}
                        </h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task.id);
                        }}>
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {task.finalizado ? (
                            <Badge variant="default" className="bg-green-500/10 text-green-600 border-none px-1.5 py-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Concluída
                            </Badge>
                        ) : isOverdue ? (
                            <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-none px-1.5 py-0">
                                <AlertCircle className="h-3 w-3 mr-1" /> Atrasado
                            </Badge>
                        ) : isDueToday ? (
                            <Badge className="bg-orange-500/10 text-orange-600 border-none px-1.5 py-0">
                                <Clock className="h-3 w-3 mr-1" /> Hoje
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-none px-1.5 py-0">
                                Pendente
                            </Badge>
                        )}

                        {task.dataParaFinalizacao && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dataParaFinalizacao).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/40">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {task.idResponsavel ? `U${task.idResponsavel}` : "?"}
                            </div>
                            {task.idProcesso && (
                                <div className="flex items-center gap-1 text-[10px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10">
                                    <ExternalLink className="h-2 w-2" /> PROC {task.idProcesso}
                                </div>
                            )}
                        </div>
                        {task.observacao && (
                            <MessageSquare className="h-3 w-3 text-muted-foreground/50" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface ColumnProps {
    id: string;
    title: string;
    tasks: any[];
    onEdit: (id: string) => void;
}

function KanbanColumn({ id, title, tasks, onEdit }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col h-full bg-muted/30 rounded-2xl p-4 border border-border/40 min-h-[500px]"
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                    {title}
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {tasks.length}
                    </span>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none min-h-[500px]">
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onEdit={onEdit} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

interface AdvTarefasKanbanProps {
    data: any[];
    onEdit: (id: string) => void;
}

export function AdvTarefasKanban({ data, onEdit }: AdvTarefasKanbanProps) {
    const updateTask = useUpdateAdvTarefas();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const isToday = (date: string | null) => {
        if (!date) return false;
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const isOverdue = (date: string | null) => {
        if (!date) return false;
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
    };

    const columns = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return [
            {
                id: "overdue",
                title: "Atrasadas",
                tasks: data.filter(t => !t.finalizado && isOverdue(t.dataParaFinalizacao))
            },
            {
                id: "today",
                title: "Para Hoje",
                tasks: data.filter(t => !t.finalizado && isToday(t.dataParaFinalizacao))
            },
            {
                id: "pending",
                title: "Pendentes",
                tasks: data.filter(t => !t.finalizado && !isOverdue(t.dataParaFinalizacao) && !isToday(t.dataParaFinalizacao))
            },
            {
                id: "done",
                title: "Concluído",
                tasks: data.filter(t => t.finalizado)
            },
        ];
    }, [data]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const taskId = active.id;
        const overId = over.id;

        // Find which column the item was dropped into
        const task = data.find(t => t.id === taskId);
        if (!task) return;

        // The 'overId' could be the column ID or another task ID
        let targetColumnId = overId;
        const columnIds = ["overdue", "today", "pending", "done"];
        if (!columnIds.includes(overId)) {
            const overTask = data.find(t => t.id === overId);
            if (overTask?.finalizado) {
                targetColumnId = "done";
            } else if (isOverdue(overTask?.dataParaFinalizacao)) {
                targetColumnId = "overdue";
            } else if (isToday(overTask?.dataParaFinalizacao)) {
                targetColumnId = "today";
            } else {
                targetColumnId = "pending";
            }
        }

        let currentColumnId = task.finalizado ? "done" :
            isOverdue(task.dataParaFinalizacao) ? "overdue" :
                isToday(task.dataParaFinalizacao) ? "today" : "pending";

        if (targetColumnId !== currentColumnId) {
            const isDone = targetColumnId === "done";
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            let newDataParaFinalizacao = task.dataParaFinalizacao;

            if (targetColumnId === "today") {
                newDataParaFinalizacao = today.toISOString().split('T')[0];
            } else if (targetColumnId === "overdue" && !isOverdue(task.dataParaFinalizacao)) {
                newDataParaFinalizacao = yesterday.toISOString().split('T')[0];
            } else if (targetColumnId === "pending" && (isOverdue(task.dataParaFinalizacao) || isToday(task.dataParaFinalizacao))) {
                newDataParaFinalizacao = tomorrow.toISOString().split('T')[0];
            }

            const updateData = {
                ...task,
                finalizado: isDone,
                tsFinalizacao: isDone ? new Date().toISOString() : null,
                dataParaFinalizacao: newDataParaFinalizacao
            };

            updateTask.mutate({ id: taskId, data: updateData }, {
                onSuccess: () => {
                    toast.success("Tarefa atualizada com sucesso!");
                },
                onError: () => {
                    toast.error("Erro ao atualizar status da tarefa.");
                }
            });
        }
    };

    const activeTask = useMemo(() =>
        activeId ? data.find(t => t.id === activeId) : null
        , [activeId, data]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                {columns.map(column => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        onEdit={onEdit}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="w-[300px] rotate-3 opacity-90 pointer-events-none">
                        <TaskCard task={activeTask} onEdit={() => { }} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
