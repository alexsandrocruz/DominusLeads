import { useState, useMemo } from "react";
import { useAdvTarefases, useDeleteAdvTarefas } from "@/lib/abp/hooks/useAdvTarefases";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdvTarefasListProps {
  onEdit: (item: any) => void;
}

export function AdvTarefasList({ onEdit }: AdvTarefasListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useAdvTarefases({
    filter: searchTerm,
  });
  const deleteMutation = useDeleteAdvTarefas();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Tarefa excluída com sucesso");
      } catch (error: any) {
        toast.error(error.message || "Erro ao excluir tarefa");
      }
    }
  };

  const sortedItems = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items].sort((a, b) => {
      // Sort by finalizado (pendente first) then by date
      if (a.finalizado !== b.finalizado) return a.finalizado ? 1 : -1;
      if (!a.dataParaFinalizacao) return 1;
      if (!b.dataParaFinalizacao) return -1;
      return new Date(a.dataParaFinalizacao).getTime() - new Date(b.dataParaFinalizacao).getTime();
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b bg-card/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar tarefas por descrição..."
              className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Tarefa</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item: any) => {
                const isOverdue = item.dataParaFinalizacao && new Date(item.dataParaFinalizacao) < new Date() && !item.finalizado;
                const isDueToday = item.dataParaFinalizacao && new Date(item.dataParaFinalizacao).toLocaleDateString() === new Date().toLocaleDateString() && !item.finalizado;

                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "group transition-colors border-border/40 hover:bg-primary/[0.02]",
                      item.finalizado && "opacity-60"
                    )}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{item.idTarefa || "---"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={cn(
                          "font-semibold transition-colors group-hover:text-primary",
                          item.finalizado && "line-through"
                        )}>
                          {item.descricao}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          Tipo {item.idTipoTarefa}
                          {item.idProcesso && (
                            <span className="flex items-center gap-1 before:content-['•'] before:mx-1 before:text-muted-foreground/30">
                              Proc: {item.idProcesso}
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-2 text-sm",
                        isOverdue ? "text-red-600 font-bold" : isDueToday ? "text-orange-600 font-bold" : "text-foreground"
                      )}>
                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                        {item.dataParaFinalizacao ? new Date(item.dataParaFinalizacao).toLocaleDateString() : "---"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                          {item.idResponsavel ? `U${item.idResponsavel}` : "?"}
                        </div>
                        <span className="text-sm font-medium">Responsável {item.idResponsavel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.finalizado ? (
                        <Badge variant="default" className="bg-green-500/10 text-green-600 border-none hover:bg-green-500/20 px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Concluído
                        </Badge>
                      ) : isOverdue ? (
                        <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-none hover:bg-red-500/20 px-2 py-0.5 animate-pulse">
                          <AlertCircle className="h-3 w-3 mr-1" /> Atrasado
                        </Badge>
                      ) : isDueToday ? (
                        <Badge className="bg-orange-500/10 text-orange-600 border-none hover:bg-orange-500/20 px-2 py-0.5">
                          <Clock className="h-3 w-3 mr-1" /> Hoje
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-none hover:bg-blue-500/20 px-2 py-0.5">
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-border/50">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest px-2 py-1.5">Gerenciar</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(item)} className="rounded-lg gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
                            <Pencil className="h-4 w-4" /> Editar Atividade
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg gap-2 text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-colors"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Excluir Registro
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!data?.items || data.items.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center bg-muted/5">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
                      <Button variant="link" onClick={() => setSearchTerm("")}>Limpar filtros</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
