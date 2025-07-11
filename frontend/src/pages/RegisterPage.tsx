import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import '../App.css';

interface RegisterPageProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    return (
        <div className="page-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-active) 100%)',
            padding: '20px 0'
        }}>
            <div className="card-container">
                <RegisterForm
                    onRegisterSuccess={onRegisterSuccess}
                    onSwitchToLogin={onSwitchToLogin}
                />
            </div>

            {/* 背景装饰元素 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
                zIndex: 0,
                opacity: 0.3
            }} />
        </div>
    );
};

export default RegisterPage; 