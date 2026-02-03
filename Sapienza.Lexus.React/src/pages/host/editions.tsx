import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Crown, Plus, Settings, MoreHorizontal, Check, X } from "lucide-react";

// Mock data for editions
const mockEditions = [
    {
        id: "1",
        name: "Inicial",
        displayName: "Edição Inicial",
        price: 2500,
        isFree: false,
        features: {
            "Máximo de Usuários": "10",
            "Armazenamento": "10GB",
            "Suporte": "Email",
        },
    },
    {
        id: "2",
        name: "Profissional",
        displayName: "Edição Profissional",
        price: 5000,
        isFree: false,
        features: {
            "Máximo de Usuários": "50",
            "Armazenamento": "50GB",
            "Suporte": "Prioritário 24/7",
        },
    },
    {
        id: "3",
        name: "Empresarial",
        displayName: "Edição Empresarial",
        price: 10000,
        isFree: false,
        features: {
            "Máximo de Usuários": "Ilimitado",
            "Armazenamento": "200GB",
            "Suporte": "Gerente de Conta Dedicado",
        },
    },
];

export default function HostEditionsPage() {
    return (
        <AppShell>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edições</h1>
                        <p className="text-muted-foreground">
                            Gerencie planos de assinatura e recursos
                        </p>
                    </div>
                </div>

                {/* Editions Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Edições ({mockEditions.length})</CardTitle>
                            <Button className="gap-2 shadow-lg shadow-primary/20">
                                <Plus className="size-4" />
                                Nova Edição
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Edição</TableHead>
                                    <TableHead>Preço</TableHead>
                                    <TableHead>Recursos Principais</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockEditions.map((edition) => (
                                    <TableRow key={edition.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{edition.displayName}</p>
                                                <p className="text-xs text-muted-foreground">{edition.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {edition.isFree ? (
                                                <Badge variant="secondary">Grátis</Badge>
                                            ) : (
                                                <span className="font-semibold">R$ {edition.price.toLocaleString('pt-BR')}/mês</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {Object.entries(edition.features).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-2 text-xs">
                                                        <Check className="h-3 w-3 text-emerald-500" />
                                                        <span className="text-muted-foreground">{key}:</span>
                                                        <span className="font-medium">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Features Comparison Preview */}
                <div className="grid gap-6 md:grid-cols-3">
                    {mockEditions.map((edition) => (
                        <Card key={edition.id} className={edition.name === "Professional" ? "border-primary shadow-md" : ""}>
                            <CardHeader>
                                <CardTitle>{edition.displayName}</CardTitle>
                                <CardDescription>
                                    {edition.isFree ? "Perfeito para começar" : `A partir de R$ ${edition.price.toLocaleString('pt-BR')}/mês`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-3xl font-bold">
                                    {edition.isFree ? "Grátis" : `R$ ${edition.price.toLocaleString('pt-BR')}`}
                                    {!edition.isFree && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                                </div>
                                <Separator />
                                <ul className="space-y-2">
                                    {Object.entries(edition.features).map(([key, value]) => (
                                        <li key={key} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-emerald-500" />
                                            <span>{key}: {value}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span>Análises Básicas</span>
                                    </li>
                                    {edition.name === "Inicial" && (
                                        <li className="flex items-center gap-2 text-sm text-muted-foreground opacity-50">
                                            <X className="h-4 w-4 text-destructive" />
                                            <span>Domínio Personalizado</span>
                                        </li>
                                    )}
                                </ul>
                                <Button className="w-full" variant={edition.name === "Profissional" ? "default" : "outline"}>
                                    {edition.isFree ? "Selecionar Plano" : "Fazer Upgrade"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
