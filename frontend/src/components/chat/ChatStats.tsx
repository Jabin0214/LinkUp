import React from 'react';
import { Card, Typography, Space, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface ChatStatsProps {
    userName: string;
    isOnline: boolean;
    lastSeen?: string;
    messageCount?: number;
    avatar?: string;
}

const ChatStats: React.FC<ChatStatsProps> = ({
    userName,
    isOnline,
    lastSeen,
    messageCount = 0,
    avatar
}) => {
    const formatLastSeen = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card className="chat-stats-card" size="small">
            <div className="chat-stats-header">
                <Avatar
                    size={48}
                    src={avatar}
                    icon={<UserOutlined />}
                    className="chat-stats-avatar"
                />
                <div className="chat-stats-info">
                    <Title level={5} className="chat-stats-name">
                        {userName}
                    </Title>
                    <Space size="small">
                        <Tag
                            color={isOnline ? 'green' : 'default'}
                            icon={isOnline ? null : <ClockCircleOutlined />}
                        >
                            {isOnline ? 'Online' : 'Offline'}
                        </Tag>
                        {!isOnline && lastSeen && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Last seen {formatLastSeen(lastSeen)}
                            </Text>
                        )}
                    </Space>
                </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className="chat-stats-details">
                <div className="chat-stats-item">
                    <MessageOutlined />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {messageCount} messages
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default ChatStats; 