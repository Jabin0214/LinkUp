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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                            color: '#666',
                            fontSize: '16px',
                            fontWeight: 500
                        }}>
                            {tip}
                        </div>
                    </div>
                </Spin>
            </div>

            {/* 移动端优化样式 */}
            <style>
                {`
                @media (max-width: 768px) {
                    .ant-spin-container {
                        padding: 20px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .ant-spin-container {
                        padding: 16px !important;
                        min-height: 60px !important;
                    }
                }
            `}
            </style>
        </div>
    );
};

export default LoadingSpinner; 