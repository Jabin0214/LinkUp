import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { AuthResponse } from '../Services/UserService';

interface LoginPageProps {
    onLoginSuccess: (auth: AuthResponse) => void;
    onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <LoginForm
                onLoginSuccess={onLoginSuccess}
                onSwitchToRegister={onSwitchToRegister}
            />
        </div>
    );
};

export default LoginPage; 