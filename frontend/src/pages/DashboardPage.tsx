import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { AuthResponse } from '../Services/UserService';

interface DashboardPageProps {
    auth: AuthResponse;
    onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ auth, onLogout }) => {
    return <DashboardLayout auth={auth} onLogout={onLogout} />;
};

export default DashboardPage; 