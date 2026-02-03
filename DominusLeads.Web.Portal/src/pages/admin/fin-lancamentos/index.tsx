import { Shell } from "@/components/layout/shell";
import { FinLancamentosList } from "@/components/fin-lancamentos/FinLancamentosList";
import { FinLancamentosDashboard } from "@/components/fin-lancamentos/FinLancamentosDashboard";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

export default function FinLancamentosesPage() {
  const [, setLocation] = useLocation();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Lançamentos Financeiros</h1>
              <p className="text-muted-foreground">Controle de entradas, saídas e fluxo de caixa</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setLocation("/admin/fin-lancamentos/create")}>
            <Plus className="size-4" />
            Novo Lançamento
          </Button>
        </div>

        <FinLancamentosDashboard />

        <FinLancamentosList onEdit={(item) => setLocation(`/admin/fin-lancamentos/${item.id}/edit`)} />
      </div>
    </Shell>
  );
}
