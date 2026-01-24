import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { CRM } from '../pages/CRM';
import { Automation } from '../pages/Automation';
import { Search } from '../pages/Search';
import { Settings } from '../pages/Settings';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};
