import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface DashboardPageProps {
    onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
    return <DashboardLayout onLogout={onLogout} />;
};

export default DashboardPage; 