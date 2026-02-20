import { Redirect } from "wouter";
import { useAuth } from "@/lib/abp/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect to="/auth/login" />;
    }

    return <>{children}</>;
}
