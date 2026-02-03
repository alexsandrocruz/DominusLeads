import { Shell } from "@/components/layout/shell";
import { AdvProfissionaisList } from "@/components/adv-profissionais/AdvProfissionaisList";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { useLocation } from "wouter";
import { AdvProfissionalKPIs } from "@/components/adv-profissionais/AdvProfissionalKPIs";

export default function AdvProfissionaisesPage() {
  const [, setLocation] = useLocation();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profissionais</h1>
              <p className="text-muted-foreground">Gerencie os advogados e profissionais do sistema</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setLocation("/admin/adv-profissionais/create")}>
            <Plus className="size-4" />
            Novo Profissional
          </Button>
        </div>

        <AdvProfissionalKPIs />

        <AdvProfissionaisList onEdit={(item) => setLocation(`/admin/adv-profissionais/${item.id}/edit`)} />
      </div>
    </Shell>
  );
}

