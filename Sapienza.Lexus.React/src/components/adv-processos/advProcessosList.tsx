import { useMemo, useState } from "react";
import { useAdvProcessoses, useDeleteAdvProcessos } from "@/lib/abp/hooks/useAdvProcessoses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Filter,
  X,
  Scale,
  FileText,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  TrendingUp
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface AdvProcessosListProps {
  onEdit: (item: any) => void;
}

export function AdvProcessosList({ onEdit }: AdvProcessosListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    // Filtros básicos
    status: "all",
    tipo: "all",
    fase: "all",
    natureza: "all",

    // Filtros de responsabilidade
    escritorio: "",
    responsavel: "",

    // Filtros de localização
    estado: "all",
    cidade: "",
    orgao: "",
    instancia: "all",
    vara: "",

    // Filtros de datas
    dataDistribuicaoInicio: "",
    dataDistribuicaoFim: "",
    dataSentencaInicio: "",
    dataSentencaFim: "",
    dataEncerramentoInicio: "",
    dataEncerramentoFim: "",

    // Filtros de valores
    valorCausaMin: "",
    valorCausaMax: "",
    valorHonorariosMin: "",
    valorHonorariosMax: "",
    valorDeferidoMin: "",
    valorDeferidoMax: "",

    // Filtros de características
    ativo: "true",
    recurso: "all",
    alvara: "all",
    alvaraPendente: "all",
    acaoColetiva: "all",

    // Filtros de recebimento
    recebeRPV: "all",
    recebePrecatorio: "all",
    recebeAcordo: "all",
    recebeAlvara: "all",

    // Filtros de probabilidade e relevância
    probabilidade: "all",
    relevancia: "all",
  });

  const { data, isLoading, isError } = useAdvProcessoses({
    filter: searchTerm,
  });
  const deleteMutation = useDeleteAdvProcessos();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Processo excluído com sucesso");
      } catch (error: any) {
        toast.error(error.message || "Falha ao excluir processo");
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      tipo: "all",
      fase: "all",
      natureza: "all",
      escritorio: "",
      responsavel: "",
      estado: "all",
      cidade: "",
      orgao: "",
      instancia: "all",
      vara: "",
      dataDistribuicaoInicio: "",
      dataDistribuicaoFim: "",
      dataSentencaInicio: "",
      dataSentencaFim: "",
      dataEncerramentoInicio: "",
      dataEncerramentoFim: "",
      valorCausaMin: "",
      valorCausaMax: "",
      valorHonorariosMin: "",
      valorHonorariosMax: "",
      valorDeferidoMin: "",
      valorDeferidoMax: "",
      ativo: "true",
      recurso: "all",
      alvara: "all",
      alvaraPendente: "all",
      acaoColetiva: "all",
      recebeRPV: "all",
      recebePrecatorio: "all",
      recebeAcordo: "all",
      recebeAlvara: "all",
      probabilidade: "all",
      relevancia: "all",
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      "1": { variant: "default", label: "Em Andamento" },
      "2": { variant: "success", label: "Concluído" },
      "3": { variant: "warning", label: "Suspenso" },
      "4": { variant: "destructive", label: "Arquivado" },
    };

    const statusInfo = statusMap[status] || { variant: "secondary", label: "Indefinido" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Filtros de Busca
              </CardTitle>
              <CardDescription>
                Use os filtros avançados para refinar sua busca
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros Avançados
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca Rápida */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número do processo, cliente, réu..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <>
              <Separator />
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="location">Localização</TabsTrigger>
                  <TabsTrigger value="dates">Datas</TabsTrigger>
                  <TabsTrigger value="values">Valores</TabsTrigger>
                  <TabsTrigger value="characteristics">Características</TabsTrigger>
                </TabsList>

                {/* Filtros Básicos */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Status do Processo</Label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Em Andamento</SelectItem>
                          <SelectItem value="2">Concluído</SelectItem>
                          <SelectItem value="3">Suspenso</SelectItem>
                          <SelectItem value="4">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Processo</Label>
                      <Select
                        value={filters.tipo}
                        onValueChange={(value) => setFilters({ ...filters, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Trabalhista</SelectItem>
                          <SelectItem value="2">Previdenciário</SelectItem>
                          <SelectItem value="3">Cível</SelectItem>
                          <SelectItem value="4">Criminal</SelectItem>
                          <SelectItem value="5">Tributário</SelectItem>
                          <SelectItem value="6">Família</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fase Processual</Label>
                      <Select
                        value={filters.fase}
                        onValueChange={(value) => setFilters({ ...filters, fase: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as fases" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="1">Inicial</SelectItem>
                          <SelectItem value="2">Instrução</SelectItem>
                          <SelectItem value="3">Sentença</SelectItem>
                          <SelectItem value="4">Recurso</SelectItem>
                          <SelectItem value="5">Execução</SelectItem>
                          <SelectItem value="6">Trânsito em Julgado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Natureza</Label>
                      <Select
                        value={filters.natureza}
                        onValueChange={(value) => setFilters({ ...filters, natureza: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as naturezas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="1">Ativa</SelectItem>
                          <SelectItem value="2">Passiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Escritório Responsável</Label>
                      <Input
                        placeholder="Nome do escritório"
                        value={filters.escritorio}
                        onChange={(e) => setFilters({ ...filters, escritorio: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Advogado Responsável</Label>
                      <Input
                        placeholder="Nome do advogado"
                        value={filters.responsavel}
                        onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Situação</Label>
                      <Select
                        value={filters.ativo}
                        onValueChange={(value) => setFilters({ ...filters, ativo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Situação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Ativos</SelectItem>
                          <SelectItem value="false">Inativos</SelectItem>
                          <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Filtros de Localização */}
                <TabsContent value="location" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Estado
                      </Label>
                      <Select
                        value={filters.estado}
                        onValueChange={(value) => setFilters({ ...filters, estado: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os estados" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input
                        placeholder="Nome da cidade"
                        value={filters.cidade}
                        onChange={(e) => setFilters({ ...filters, cidade: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Órgão Julgador</Label>
                      <Input
                        placeholder="Nome do órgão"
                        value={filters.orgao}
                        onChange={(e) => setFilters({ ...filters, orgao: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Instância</Label>
                      <Select
                        value={filters.instancia}
                        onValueChange={(value) => setFilters({ ...filters, instancia: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as instâncias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="1">1ª Instância</SelectItem>
                          <SelectItem value="2">2ª Instância</SelectItem>
                          <SelectItem value="3">Tribunais Superiores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Vara</Label>
                      <Input
                        placeholder="Número ou nome da vara"
                        value={filters.vara}
                        onChange={(e) => setFilters({ ...filters, vara: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Filtros de Datas */}
                <TabsContent value="dates" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data de Distribuição
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>De</Label>
                          <Input
                            type="date"
                            value={filters.dataDistribuicaoInicio}
                            onChange={(e) => setFilters({ ...filters, dataDistribuicaoInicio: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Até</Label>
                          <Input
                            type="date"
                            value={filters.dataDistribuicaoFim}
                            onChange={(e) => setFilters({ ...filters, dataDistribuicaoFim: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Data da Sentença</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>De</Label>
                          <Input
                            type="date"
                            value={filters.dataSentencaInicio}
                            onChange={(e) => setFilters({ ...filters, dataSentencaInicio: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Até</Label>
                          <Input
                            type="date"
                            value={filters.dataSentencaFim}
                            onChange={(e) => setFilters({ ...filters, dataSentencaFim: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Data de Encerramento</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>De</Label>
                          <Input
                            type="date"
                            value={filters.dataEncerramentoInicio}
                            onChange={(e) => setFilters({ ...filters, dataEncerramentoInicio: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Até</Label>
                          <Input
                            type="date"
                            value={filters.dataEncerramentoFim}
                            onChange={(e) => setFilters({ ...filters, dataEncerramentoFim: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Filtros de Valores */}
                <TabsContent value="values" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Valor da Causa
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Mínimo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorCausaMin}
                            onChange={(e) => setFilters({ ...filters, valorCausaMin: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Máximo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorCausaMax}
                            onChange={(e) => setFilters({ ...filters, valorCausaMax: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Honorários</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Mínimo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorHonorariosMin}
                            onChange={(e) => setFilters({ ...filters, valorHonorariosMin: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Máximo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorHonorariosMax}
                            onChange={(e) => setFilters({ ...filters, valorHonorariosMax: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Valor Deferido</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Mínimo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorDeferidoMin}
                            onChange={(e) => setFilters({ ...filters, valorDeferidoMin: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Máximo (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={filters.valorDeferidoMax}
                            onChange={(e) => setFilters({ ...filters, valorDeferidoMax: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Filtros de Características */}
                <TabsContent value="characteristics" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Possui Recurso
                      </Label>
                      <Select
                        value={filters.recurso}
                        onValueChange={(value) => setFilters({ ...filters, recurso: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Alvará Expedido</Label>
                      <Select
                        value={filters.alvara}
                        onValueChange={(value) => setFilters({ ...filters, alvara: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Alvará Pendente</Label>
                      <Select
                        value={filters.alvaraPendente}
                        onValueChange={(value) => setFilters({ ...filters, alvaraPendente: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ação Coletiva</Label>
                      <Select
                        value={filters.acaoColetiva}
                        onValueChange={(value) => setFilters({ ...filters, acaoColetiva: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Recebe RPV</Label>
                      <Select
                        value={filters.recebeRPV}
                        onValueChange={(value) => setFilters({ ...filters, recebeRPV: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Recebe Precatório</Label>
                      <Select
                        value={filters.recebePrecatorio}
                        onValueChange={(value) => setFilters({ ...filters, recebePrecatorio: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Recebe Acordo</Label>
                      <Select
                        value={filters.recebeAcordo}
                        onValueChange={(value) => setFilters({ ...filters, recebeAcordo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Recebe Alvará</Label>
                      <Select
                        value={filters.recebeAlvara}
                        onValueChange={(value) => setFilters({ ...filters, recebeAlvara: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Probabilidade de Êxito
                      </Label>
                      <Select
                        value={filters.probabilidade}
                        onValueChange={(value) => setFilters({ ...filters, probabilidade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="1">Alta</SelectItem>
                          <SelectItem value="2">Média</SelectItem>
                          <SelectItem value="3">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Relevância</Label>
                      <Select
                        value={filters.relevancia}
                        onValueChange={(value) => setFilters({ ...filters, relevancia: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="1">Alta</SelectItem>
                          <SelectItem value="2">Média</SelectItem>
                          <SelectItem value="3">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar Todos os Filtros
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Processos */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Réu/Reclamado</TableHead>
                  <TableHead>Escritório Responsável</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead className="text-right">Valor da Causa</TableHead>
                  <TableHead className="text-right">Honorários</TableHead>
                  <TableHead>Data Distribuição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum processo encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {item.numero || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.clienteNome || `Cliente #${item.idCliente}`}
                          </span>
                          {item.sintese && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {item.sintese}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.nomeReu || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {item.escritorioResponsavelNome || `Escritório #${item.idEscritorioResponsavel}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.tipoNome || `Tipo #${item.idTipo}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.idStatus)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.faseNome || `Fase #${item.idFase}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.valorCausa)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {formatCurrency(item.valorHonorarios)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(item.dataDistribuicao)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      {data?.items?.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <div>
            Exibindo <strong>{data.items.length}</strong> processo(s)
          </div>
          <div>
            Total: <strong>{data.totalCount || data.items.length}</strong> registro(s)
          </div>
        </div>
      )}
    </div>
  );
}
