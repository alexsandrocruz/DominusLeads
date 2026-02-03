import { Shell } from "@/components/layout/shell";
import { AdvProcessosList } from "@/components/adv-processos/AdvProcessosList";
import { Button } from "@/components/ui/button";
import { Plus, Scale } from "lucide-react";
import { useLocation } from "wouter";

export default function AdvProcessosesPage() {
  const [, setLocation] = useLocation();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Processos Jurídicos</h1>
              <p className="text-muted-foreground">Gerencie todos os processos do escritório</p>
            </div>
          </div>
          <Button
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => setLocation("/admin/adv-processos/create")}
          >
            <Plus className="size-4" />
            Novo Processo
          </Button>
        </div>

        <AdvProcessosList onEdit={(item) => setLocation(`/admin/adv-processos/${item.id}/edit`)} />
      </div>
    </Shell>
  );
}
