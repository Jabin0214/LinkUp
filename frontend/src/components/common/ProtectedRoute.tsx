import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthResponse } from '../../Services/UserService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    auth: AuthResponse | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, auth }) => {
    if (!auth || !auth.token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 