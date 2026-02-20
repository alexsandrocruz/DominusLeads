import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/abp/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2, Crown, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();
    const [, setLocation] = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            setLocation("/dashboard");
        } catch {
            // Error is handled in the store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <Card className="w-full max-w-md border-none shadow-2xl bg-card/50 backdrop-blur-xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
                            <Crown className="size-7" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-display font-bold">
                        Dominus Leads
                    </CardTitle>
                    <CardDescription>
                        Entre na sua conta para continuar
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error === "Login failed"
                                    ? "Credenciais inválidas. Verifique seu usuário e senha."
                                    : error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuário ou E-mail</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                                autoFocus
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Senha</Label>
                                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-background/50 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Não tem uma conta?{" "}
                            <Link href="/auth/register" className="text-primary font-medium hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
