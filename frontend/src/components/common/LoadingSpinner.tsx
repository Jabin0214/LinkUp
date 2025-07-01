import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
    size?: 'small' | 'default' | 'large';
    tip?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    tip = 'Loading...',
    fullScreen = true
}) => {
    const containerStyle = fullScreen ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-active) 100%)',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999
    } : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
    };

    return (
        <div style={containerStyle}>
            <div style={{
                textAlign: 'center',
                background: 'var(--component-background)',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-2)',
                backdropFilter: 'blur(10px)'
            }}>
                <Spin size={size}>
                    <div style={{
                        padding: '24px',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            marginTop: '16px',
                            color: 'var(--text-color-secondary)',
                            fontSize: '16px',
                            fontWeight: 500
                        }}>
                            {tip}
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    );
};

export default LoadingSpinner; 