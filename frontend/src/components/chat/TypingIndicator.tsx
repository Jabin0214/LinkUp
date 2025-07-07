import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface TypingIndicatorProps {
    isTyping: boolean;
    userName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping, userName }) => {
    if (!isTyping) return null;

    return (
        <div className="typing-indicator">
            <Text type="secondary" style={{ fontSize: '12px' }}>
                {userName || 'Someone'} is typing
            </Text>
            <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
            </div>
        </div>
    );
};

export default TypingIndicator; 