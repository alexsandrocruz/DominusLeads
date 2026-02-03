import React, { useState } from 'react';
import { AppShell } from "@/components/layout/shell";
import OperationalDashboard from '../../../components/dashboard/OperationalDashboard';
import ManagerialDashboard from '../../../components/dashboard/ManagerialDashboard';

const CrmDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'operational' | 'managerial'>('operational');

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard CRM e Financeiro</h1>
                        <p className="text-muted-foreground mt-1">
                            Visão integrada da operação e gestão do escritório.
                        </p>
                    </div>
                    <div className="flex bg-muted/50 rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setActiveTab('operational')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'operational'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Operacional (Atendimento)
                        </button>
                        <button
                            onClick={() => setActiveTab('managerial')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'managerial'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Gerencial (Financeiro/Carteira)
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {activeTab === 'operational' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <OperationalDashboard />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ManagerialDashboard />
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
};

export default CrmDashboardPage;
