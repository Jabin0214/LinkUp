import React, { useEffect, useState } from 'react';
import { notification, Avatar, Typography, Space } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ChatNotificationProps {
    message: string;
    senderName: string;
    senderAvatar?: string;
    onNotificationClick?: () => void;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({
    message,
    senderName,
    senderAvatar,
    onNotificationClick
}) => {
    const [notificationKey, setNotificationKey] = useState<string>('');

    useEffect(() => {
        const key = `chat-${Date.now()}`;
        setNotificationKey(key);

        notification.info({
            key,
            message: (
                <div className="chat-notification-content">
                    <Space>
                        <Avatar
                            size={32}
                            src={senderAvatar}
                            icon={<UserOutlined />}
                        />
                        <div className="chat-notification-info">
                            <Text strong style={{ fontSize: '14px' }}>
                                {senderName}
                            </Text>
                            <div className="chat-notification-message">
                                <MessageOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {message.length > 50 ? message.substring(0, 50) + '...' : message}
                                </Text>
                            </div>
                        </div>
                    </Space>
                </div>
            ),
            description: null,
            duration: 5,
            placement: 'topRight',
            onClick: onNotificationClick,
            className: 'chat-notification'
        });

        return () => {
            notification.destroy(key);
        };
    }, [message, senderName, senderAvatar, onNotificationClick]);

    return null;
};

export default ChatNotification; 