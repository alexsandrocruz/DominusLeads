import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, Users, Search, Zap, Settings } from 'lucide-react';

export const BottomNav = () => {
    const navItems = [
        { to: '/dashboard', label: 'Início', icon: Home },
        { to: '/crm', label: 'CRM', icon: Users },
        { to: '/search', label: 'Buscar', icon: Search },
        { to: '/automation', label: 'Automação', icon: Zap },
        { to: '/settings', label: 'Ajustes', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-3 pb-8 md:pb-3 flex justify-between items-center safe-area-bottom max-w-md mx-auto">
            {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    )}
                >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                    <span className="text-[10px] font-medium">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};
