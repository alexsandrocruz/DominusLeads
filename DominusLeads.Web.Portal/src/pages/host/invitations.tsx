import { useState } from "react";
import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, CheckCircle2, Clock, XCircle, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

// Mock data for invitations
const mockInvitations = [
    { id: "1", email: "pedro@exemplo.com", role: "Usuário", status: "Pendente", sentAt: "2024-03-20T10:00:00Z" },
    { id: "2", email: "ana@design.com", role: "Administrador", status: "Aceito", sentAt: "2024-03-15T14:30:00Z" },
    { id: "3", email: "carlos@tech.com", role: "Usuário", status: "Expirado", sentAt: "2024-02-10T09:15:00Z" },
];

export default function InvitationsPage() {
    const [invites, setInvites] = useState(mockInvitations);
    const [newEmail, setNewEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newInvite = {
                id: Math.random().toString(36).substr(2, 9),
                email: newEmail,
                role: "Usuário",
                status: "Pendente",
                sentAt: new Date().toISOString()
            };
            setInvites([newInvite, ...invites]);
            setNewEmail("");
            setIsLoading(false);
            toast.success(`Convite enviado para ${newEmail}`);
        }, 1000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Aceito":
                return <Badge variant="success" className="gap-1"><CheckCircle2 className="size-3" /> Aceito</Badge>;
            case "Pendente":
                return <Badge variant="warning" className="gap-1"><Clock className="size-3" /> Pendente</Badge>;
            case "Expirado":
                return <Badge variant="destructive" className="gap-1"><XCircle className="size-3" /> Expirado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
                    <p className="text-muted-foreground">
                        Convide novos usuários para seu espaço de trabalho e gerencie solicitações pendentes.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Send Invite Form */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Send className="size-4 text-primary" />
                                Enviar Novo Convite
                            </CardTitle>
                            <CardDescription>
                                Usuários convidados receberão um e-mail para ingressar neste espaço de trabalho.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSendInvite}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Endereço de E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="colega@empresa.com"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Função</Label>
                                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                        <option>Usuário</option>
                                        <option>Gerente</option>
                                        <option>Administrador</option>
                                    </select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                                    {isLoading ? "Enviando..." : "Enviar Convite"}
                                    {!isLoading && <Send className="size-4" />}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Invitation List */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Convites Recentes</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input placeholder="Buscar convites..." className="pl-9 h-9" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Enviado em</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites.map((invite) => (
                                        <TableRow key={invite.id}>
                                            <TableCell className="font-medium">{invite.email}</TableCell>
                                            <TableCell>{invite.role}</TableCell>
                                            <TableCell>{getStatusBadge(invite.status)}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {new Date(invite.sentAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Approvals Section (Placeholder) */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="size-4 text-primary" />
                            Aprovações de Usuários Pendentes
                        </CardTitle>
                        <CardDescription>
                            Usuários que se registraram via seu subdomínio e estão aguardando sua permissão.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground italic">
                                Nenhum usuário aguardando aprovação no momento.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
