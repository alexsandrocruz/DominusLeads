import { useMemo, useState } from "react";
import { useAdvClienteses, useDeleteAdvClientes } from "@/lib/abp/hooks/useAdvClienteses";
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
import { Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdvClientesListProps {
  onEdit: (item: any) => void;
}

export function AdvClientesList({ onEdit }: AdvClientesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useAdvClienteses({
    filter: searchTerm,
  });
  const deleteMutation = useDeleteAdvClientes();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Cliente excluído com sucesso");
      } catch (error: any) {
        toast.error(error.message || "Falha ao excluir cliente");
      }
    }
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
              placeholder="Buscar clientes por nome, CPF ou e-mail..."
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
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item: any) => (
                <TableRow key={item.id} className="group transition-colors">
                  <TableCell className="font-medium text-muted-foreground">
                    #{item.idCliente}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.nome}</span>
                      <span className="text-xs text-muted-foreground">{item.apelido}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.cpf || item.cnpj || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {item.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {item.telCelular || item.telFixo || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.ativo ? "default" : "secondary"} className={item.ativo ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none" : ""}>
                      {item.ativo ? "Ativo" : "Inativo"}
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
                          Editar Cliente
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
                    Nenhum cliente encontrado.
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
