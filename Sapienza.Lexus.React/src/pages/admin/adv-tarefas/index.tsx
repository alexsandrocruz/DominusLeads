import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { AdvTarefasList } from "@/components/adv-tarefas/AdvTarefasList";
import { AdvTarefasKanban } from "@/components/adv-tarefas/AdvTarefasKanban";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CalendarCheck,
  LayoutGrid,
  List,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { useAdvTarefases } from "@/lib/abp/hooks/useAdvTarefases";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function AdvTarefasesPage() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<"list" | "kanban">("kanban");
  const { data, isLoading } = useAdvTarefases();

  const stats = {
    pending: data?.items?.filter((t: any) => !t.finalizado).length || 0,
    overdue: data?.items?.filter((t: any) => {
      return t.dataParaFinalizacao && new Date(t.dataParaFinalizacao) < new Date() && !t.finalizado;
    }).length || 0,
    today: data?.items?.filter((t: any) => {
      return t.dataParaFinalizacao && new Date(t.dataParaFinalizacao).toLocaleDateString() === new Date().toLocaleDateString() && !t.finalizado;
    }).length || 0,
    completed: data?.items?.filter((t: any) => t.finalizado).length || 0,
  };

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 shadow-inner">
              <CalendarCheck className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Centro de Comando</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Gerenciamento de prazos e tarefas produtivas
                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")} className="bg-muted/50 p-1 rounded-xl">
              <TabsList className="grid w-[160px] grid-cols-2 h-9 p-0 bg-transparent">
                <TabsTrigger value="kanban" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg flex items-center gap-2 text-xs">
                  <LayoutGrid className="h-3.5 w-3.5" /> Quadro
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg flex items-center gap-2 text-xs">
                  <List className="h-3.5 w-3.5" /> Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" className="gap-2 bg-card/50 rounded-xl hidden sm:flex">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={() => setLocation("/admin/adv-tarefas/create")}>
              <Plus className="size-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-red-500/5 backdrop-blur-sm group overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-600/70">Atrasadas</p>
                <h3 className="text-xl font-bold text-red-700">{stats.overdue}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-orange-500/5 backdrop-blur-sm group overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-orange-600/70">Para Hoje</p>
                <h3 className="text-xl font-bold text-orange-700">{stats.today}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-blue-500/5 backdrop-blur-sm group overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600/70">Pendentes</p>
                <h3 className="text-xl font-bold text-blue-700">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-500/5 backdrop-blur-sm group overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600/70">Concluídas</p>
                <h3 className="text-xl font-bold text-green-700">{stats.completed}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Content */}
        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : view === "kanban" ? (
            <AdvTarefasKanban
              data={data?.items || []}
              onEdit={(id) => setLocation(`/admin/adv-tarefas/${id}/edit`)}
            />
          ) : (
            <AdvTarefasList onEdit={(item) => setLocation(`/admin/adv-tarefas/${item.id}/edit`)} />
          )}
        </div>

        {/* Footer Insight */}
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left transition-all hover:bg-primary/[0.07]">
          <div className="h-14 w-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center shrink-0 -rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="h-7 w-7 text-primary-foreground fill-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-primary leading-tight">Dica de Produtividade</p>
            <p className="text-sm text-primary/70">Você tem <strong>{stats.overdue} tarefas atrasadas</strong>. Priorize resolver os impedimentos antes de iniciar novas demandas do dia.</p>
          </div>
          <Button className="rounded-xl group gap-2" variant="outline">
            Ver Metas da Semana
          </Button>
        </div>
      </div>
    </Shell>
  );
}
