import { AppShell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import { Settings, Globe, Mail, Shield, Save, Bell } from "lucide-react";

export default function HostSettingsPage() {
    return (
        <AppShell>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                        <p className="text-muted-foreground">
                            Configure as configurações do sistema
                        </p>
                    </div>
                </div>

                {/* Settings Tabs */}
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="general" className="gap-2">
                            <Globe className="h-4 w-4" />
                            Geral
                        </TabsTrigger>
                        <TabsTrigger value="email" className="gap-2">
                            <Mail className="h-4 w-4" />
                            E-mail
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Segurança
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="h-4 w-4" />
                            Notificações
                        </TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações Gerais</CardTitle>
                                <CardDescription>
                                    Configure as configurações gerais da aplicação
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="appName">Nome da Aplicação</Label>
                                    <Input id="appName" defaultValue="Fabio Ribeiro" />
                                    <p className="text-sm text-muted-foreground">
                                        O nome exibido no cabeçalho da aplicação
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="defaultLanguage">Idioma Padrão</Label>
                                    <Input id="defaultLanguage" defaultValue="pt-BR" />
                                    <p className="text-sm text-muted-foreground">
                                        Idioma padrão para novos usuários
                                    </p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Habilitar Multi-tenancy</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Permitir múltiplos espaços de trabalho no sistema
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Habilitar Auto-registro</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Permitir que usuários se registrem
                                        </p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex justify-end">
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <Save className="h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Settings */}
                    <TabsContent value="email">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações de E-mail</CardTitle>
                                <CardDescription>
                                    Configure as configurações de SMTP e notificações por e-mail
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpHost">Servidor SMTP</Label>
                                        <Input id="smtpHost" placeholder="smtp.exemplo.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpPort">Porta SMTP</Label>
                                        <Input id="smtpPort" type="number" defaultValue="587" />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpUser">Usuário</Label>
                                        <Input id="smtpUser" placeholder="usuario@exemplo.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpPassword">Senha</Label>
                                        <Input id="smtpPassword" type="password" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="senderEmail">E-mail do Remetente</Label>
                                    <Input id="senderEmail" placeholder="naoresponder@exemplo.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="senderName">Nome do Remetente</Label>
                                    <Input id="senderName" placeholder="Minha Aplicação" />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Habilitar SSL</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Usar SSL/TLS para conexão SMTP
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline">Testar Conexão</Button>
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <Save className="h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações de Segurança</CardTitle>
                                <CardDescription>
                                    Configure políticas de senha e autenticação
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Política de Senha</h4>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="minLength">Comprimento Mínimo</Label>
                                            <Input id="minLength" type="number" defaultValue="8" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="maxLength">Comprimento Máximo</Label>
                                            <Input id="maxLength" type="number" defaultValue="128" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Exigir Maiúsculas</Label>
                                            <p className="text-sm text-muted-foreground">
                                                A senha deve conter letras maiúsculas
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Exigir Minúsculas</Label>
                                            <p className="text-sm text-muted-foreground">
                                                A senha deve conter letras minúsculas
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Exigir Números</Label>
                                            <p className="text-sm text-muted-foreground">
                                                A senha deve conter números
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Exigir Caracteres Especiais</Label>
                                            <p className="text-sm text-muted-foreground">
                                                A senha deve conter caracteres especiais
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium">Política de Bloqueio</h4>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Habilitar Bloqueio</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Bloquear conta após tentativas falhadas
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="maxAttempts">Máx. Tentativas Falhadas</Label>
                                            <Input id="maxAttempts" type="number" defaultValue="5" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lockoutDuration">Duração do Bloqueio (minutos)</Label>
                                            <Input id="lockoutDuration" type="number" defaultValue="15" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <Save className="h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações de Notificações</CardTitle>
                                <CardDescription>
                                    Configure preferências de notificações do sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por E-mail</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enviar notificações por e-mail para eventos importantes
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Novo Registro de Usuário</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notificar administradores quando novos usuários se registrarem
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Novo Espaço de Trabalho Criado</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notificar administradores quando novos espaços de trabalho forem criados
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Alertas de Segurança</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notificar sobre tentativas de login suspeitas
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex justify-end">
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <Save className="h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppShell>
    );
}
