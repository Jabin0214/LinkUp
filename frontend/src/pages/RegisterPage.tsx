import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthResponse } from '../Services/UserService';

interface RegisterPageProps {
    onRegisterSuccess: (auth: AuthResponse) => void;
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <RegisterForm
                onRegisterSuccess={onRegisterSuccess}
                onSwitchToLogin={onSwitchToLogin}
            />
        </div>
    );
};

export default RegisterPage; 