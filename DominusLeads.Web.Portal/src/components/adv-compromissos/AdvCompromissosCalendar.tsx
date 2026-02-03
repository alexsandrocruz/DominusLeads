import { useState, useMemo } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    startOfYear,
    endOfYear,
    eachMonthOfInterval
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    AlertTriangle,
    History,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface AdvCompromissosCalendarProps {
    data: any[];
    view: "day" | "week" | "month" | "year";
    onEdit: (id: string) => void;
}

export function AdvCompromissosCalendar({ data, view, onEdit }: AdvCompromissosCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const navigate = (direction: "prev" | "next") => {
        switch (view) {
            case "day":
                setCurrentDate(direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1));
                break;
            case "week":
                setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
                break;
            case "month":
                setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
                break;
            case "year":
                setCurrentDate(direction === "prev" ? currentDate : currentDate); // Simplified
                break;
        }
    };

    const monthDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate);
        const end = endOfWeek(currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const renderMonthView = () => (
        <div className="grid grid-cols-7 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden animate-in fade-in duration-500">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="bg-muted/50 p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {day}
                </div>
            ))}
            {monthDays.map((day, idx) => {
                const dayEvents = data.filter(e => {
                    // Try to use internal deadline first, fallback to fatal deadline
                    const eventDate = e.dataPrazoInterno || e.dataPrazoFatal;
                    return eventDate && isSameDay(new Date(eventDate), day);
                });
                const hasFatal = dayEvents.some(e => e.dataPrazoFatal);
                const isToday = isSameDay(day, new Date());

                return (
                    <div
                        key={idx}
                        className={cn(
                            "bg-card min-h-[120px] p-2 transition-colors hover:bg-primary/[0.02] relative group",
                            !isSameMonth(day, currentDate) && "bg-muted/20 opacity-40",
                            isToday && "bg-primary/[0.03]"
                        )}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={cn(
                                "text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                                isToday ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-foreground"
                            )}>
                                {format(day, "d")}
                            </span>
                            {hasFatal && (
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                            )}
                        </div>

                        <div className="space-y-1 max-h-[80px] overflow-y-auto scrollbar-none">
                            {dayEvents.map((event) => (
                                <button
                                    key={event.id}
                                    onClick={() => onEdit(event.id)}
                                    className={cn(
                                        "w-full text-left p-1.5 rounded-lg text-[10px] font-medium truncate transition-all active:scale-[0.98]",
                                        event.dataPrazoFatal
                                            ? "bg-red-500/10 text-red-700 border border-red-500/20"
                                            : "bg-primary/10 text-primary border border-primary/20"
                                    )}
                                >
                                    <span className="flex items-center gap-1">
                                        {event.horarioInicial && <Clock className="h-2 w-2 shrink-0" />}
                                        {event.descricao}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {dayEvents.length > 3 && (
                            <p className="text-[9px] text-muted-foreground mt-1 font-bold">
                                + {dayEvents.length - 3} outros
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderWeekView = () => (
        <div className="flex gap-4 h-[600px] animate-in slide-in-from-right-4 duration-500">
            {weekDays.map((day, idx) => {
                const dayEvents = data.filter(e => {
                    const eventDate = e.dataPrazoInterno || e.dataPrazoFatal;
                    return eventDate && isSameDay(new Date(eventDate), day);
                });
                const isToday = isSameDay(day, new Date());

                return (
                    <div key={idx} className={cn(
                        "flex-1 flex flex-col bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 overflow-hidden",
                        isToday && "ring-2 ring-primary/30 ring-inset bg-primary/[0.02]"
                    )}>
                        <div className="p-4 border-b border-border/40 bg-muted/30 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                {format(day, "EEEE", { locale: ptBR })}
                            </p>
                            <h3 className={cn(
                                "text-2xl font-black rounded-xl inline-block px-3 py-1",
                                isToday && "text-primary"
                            )}>
                                {format(day, "d")}
                            </h3>
                        </div>
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-none">
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => onEdit(event.id)}
                                    className={cn(
                                        "p-3 rounded-2xl border cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden",
                                        event.dataPrazoFatal
                                            ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                                            : "bg-primary/5 border-primary/20 hover:border-primary/40"
                                    )}
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-2.5 w-2.5" /> {event.horarioInicial || "Horário indefinido"}
                                            </p>
                                            {event.dataPrazoFatal && <AlertTriangle className="h-3 w-3 text-red-500 animate-bounce" />}
                                        </div>
                                        <h4 className="text-xs font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                                            {event.descricao}
                                        </h4>
                                        {event.onde && (
                                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                                                <MapPin className="h-2.5 w-2.5" /> {event.onde}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </div>
                            ))}
                            {dayEvents.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                                    <CalendarIcon className="h-8 w-8 mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Sem compromissos</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Calendar Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-md p-4 rounded-3xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold tracking-tight capitalize min-w-[180px]">
                        {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                    </h2>
                    <div className="flex items-center bg-muted/50 rounded-xl p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => navigate("prev")}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-8 text-xs font-bold px-3 rounded-lg hover:bg-background"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Hoje
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => navigate("next")}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] py-0 bg-red-500/5 text-red-600 border-red-500/20 font-bold uppercase tracking-widest">
                        Radar de Conflitos Ativo
                    </Badge>
                </div>
            </div>

            {/* Main View Area */}
            <div className="relative min-h-[500px]">
                {view === "month" && renderMonthView()}
                {view === "week" && renderWeekView()}
                {view === "day" && (
                    <div className="p-12 text-center bg-card/50 rounded-3xl border border-dashed border-border/60">
                        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">Visão Diária em construção. Use a visão Semanal ou Mensal.</p>
                    </div>
                )}
                {view === "year" && (
                    <div className="p-12 text-center bg-card/50 rounded-3xl border border-dashed border-border/60">
                        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">Visão Anual em construção. Use a visão Mensal.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
