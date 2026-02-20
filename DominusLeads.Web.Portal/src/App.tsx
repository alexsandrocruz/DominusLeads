import { Route, Switch, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AbpProvider } from "@/providers/AbpProvider";
import { Toaster } from "@/components/ui/Toaster";
import { routes } from "@/config/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Routes that don't require authentication
const publicPaths = new Set(["/auth/login", "/auth/register", "/auth/forgot-password", "/onboarding"]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dominus-leads-theme">
      <QueryClientProvider client={queryClient}>
        <AbpProvider>
          <Switch>
            {/* Public auth routes */}
            <Route path="/auth/login" component={LoginPage} />
            <Route path="/auth/register" component={RegisterPage} />
            <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
            <Route path="/onboarding" component={OnboardingPage} />

            {/* Protected routes from config */}
            {routes
              .filter((route) => !publicPaths.has(route.path))
              .map((route) => (
                <Route key={route.path} path={route.path}>
                  {(params) => (
                    <ProtectedRoute>
                      <route.component {...params} />
                    </ProtectedRoute>
                  )}
                </Route>
              ))}

            {/* Default redirect */}
            <Route path="/">
              <Redirect to="/dashboard" />
            </Route>

            {/* 404 */}
            <Route>
              <div className="flex items-center justify-center min-h-screen text-center">
                <div>
                  <h1 className="text-4xl font-bold">404</h1>
                  <p className="text-muted-foreground">Página não encontrada</p>
                </div>
              </div>
            </Route>
          </Switch>
          <Toaster />
        </AbpProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
