import { useState } from "react";
import { useFinLancamentoses, useDeleteFinLancamentos } from "@/lib/abp/hooks/useFinLancamentoses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { cn } from "@/lib/utils";

interface FinLancamentosListProps {
  onEdit: (item: any) => void;
}

export function FinLancamentosList({ onEdit }: FinLancamentosListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useFinLancamentoses({
    filter: searchTerm,
  });
  const deleteMutation = useDeleteFinLancamentos();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Lançamento excluído com sucesso");
      } catch (error: any) {
        toast.error(error.message || "Erro ao excluir lançamento");
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-6 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição ou número..."
              className="pl-10 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item: any) => (
                <TableRow key={item.id} className="group transition-colors">
                  <TableCell className="font-medium text-muted-foreground">
                    #{item.idLancamento}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.descricao || "Sem descrição"}</span>
                      <span className="text-xs text-muted-foreground">{item.nrDocumento ? `Doc: ${item.nrDocumento}` : "S/ Doc"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.operacao === "E" ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        item.operacao === "E" ? "text-green-500" : "text-red-500"
                      )}>
                        {item.operacao === "E" ? "Entrada" : "Saída"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    <span className={item.operacao === "E" ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(item.valor)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.dataVencimento)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.quitado ? "default" : "secondary"}
                      className={cn(
                        "border-none",
                        item.quitado
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                      )}
                    >
                      {item.quitado ? "Quitado" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar Lançamento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer focus:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhum lançamento encontrado.
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
