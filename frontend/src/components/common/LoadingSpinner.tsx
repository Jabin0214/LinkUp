import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
    size?: 'small' | 'default' | 'large';
    tip?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    tip = 'Loading...'
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <Spin size={size} tip={tip} />
            </div>
        </div>
    );
};

export default LoadingSpinner; 