import { BottomNav } from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto border-x border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark shadow-2xl">
            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                {children}
            </div>
            {showNav && <BottomNav />}
        </div>
    );
};
