import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/shell";
import { AdvCompromissosCalendar } from "@/components/adv-compromissos/AdvCompromissosCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Filter,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Zap,
  Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { useAdvCompromissoses } from "@/lib/abp/hooks/useAdvCompromissoses";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdvCompromissosPage() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");
  const { data, isLoading } = useAdvCompromissoses();

  const totalEvents = data?.totalCount || 0;
  const fatalDealdines = data?.items?.filter((e: any) => e.dataPrazoFatal).length || 0;
  const todayEvents = data?.items?.filter((e: any) => {
    const eventDate = e.dataPrazoInterno || e.dataPrazoFatal;
    return eventDate && new Date(eventDate).toLocaleDateString() === new Date().toLocaleDateString();
  }).length || 0;

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 shadow-inner">
              <CalendarIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Agenda Jurídica</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Controle estratégico de audiências e prazos
                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="bg-muted/50 p-1 rounded-xl">
              <TabsList className="grid w-[320px] grid-cols-4 h-9 p-0 bg-transparent">
                <TabsTrigger value="day" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-[10px] font-bold uppercase tracking-tight">Dia</TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-[10px] font-bold uppercase tracking-tight">Semana</TabsTrigger>
                <TabsTrigger value="month" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-[10px] font-bold uppercase tracking-tight">Mês</TabsTrigger>
                <TabsTrigger value="year" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-[10px] font-bold uppercase tracking-tight">Ano</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20 h-11 px-6" onClick={() => setLocation("/admin/adv-compromissos/create")}>
              <Plus className="size-4" />
              Agendar
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar no calendário..." className="pl-10 h-10 bg-background/50 border-none rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium px-4 border-r border-border/50">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span>Prazo Fatal ({fatalDealdines})</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium px-4 border-r border-border/50">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Compromissos ({totalEvents})</span>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl hover:bg-primary/5">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-24 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
              <p className="text-muted-foreground animate-pulse font-medium">Sincronizando agenda...</p>
            </div>
          ) : (
            <AdvCompromissosCalendar
              data={data?.items || []}
              view={view}
              onEdit={(id) => setLocation(`/admin/adv-compromissos/${id}/edit`)}
            />
          )}
        </div>

        {/* Quick Access Grid (Optional Insights) */}
        {!isLoading && todayEvents > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Card className="md:col-span-2 border-none bg-gradient-to-br from-primary/10 via-background to-background shadow-sm rounded-3xl overflow-hidden relative border border-primary/10">
              <CardContent className="p-8">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
                    <Zap className="h-10 w-10 text-primary fill-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight line-clamp-1">
                      {todayEvents === 1 ? "Você tem 1 compromisso para hoje" : `Você tem ${todayEvents} compromissos para hoje`}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Mantenha o foco nos prazos fatais e prepare-se para as audiências programadas. Verifique o radar de conflitos.
                    </p>
                  </div>
                  <Button className="rounded-xl px-8 ml-auto" size="lg">Ver Agenda do Dia</Button>
                </div>
              </CardContent>
              <div className="absolute -right-12 -top-12 h-48 w-48 bg-primary/5 rounded-full blur-3xl" />
            </Card>

            <Card className="border-none bg-red-500/5 shadow-sm rounded-3xl border border-red-500/10 group">
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-red-500/10 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-4xl font-black text-red-700 leading-none mb-1">{fatalDealdines}</h3>
                  <p className="text-red-600/70 font-bold text-xs uppercase tracking-widest">Prazos Fatais</p>
                </div>
                <Button variant="link" className="text-red-600 px-0 h-auto font-bold justify-start group-hover:translate-x-1 transition-transform">Priorizar Agora →</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Shell>
  );
}
