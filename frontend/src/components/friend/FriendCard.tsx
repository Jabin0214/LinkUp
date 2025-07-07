import React from 'react';
import { Card, Avatar, Space, Button, Tooltip, Badge, Dropdown } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    UserDeleteOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FriendInfo } from '../../Services/FriendService';

interface FriendCardProps {
    friend: FriendInfo;
    onRemoveFriend?: (friendId: number) => void;
    loading?: boolean;
}

const FriendCard: React.FC<FriendCardProps> = ({
    friend,
    onRemoveFriend,
    loading = false
}) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/dashboard/user/${friend.id}`);
    };



    const handleRemoveFriend = () => {
        onRemoveFriend?.(friend.id);
    };

        const handleStartChat = () => {
        navigate(`/dashboard/chat?userId=${friend.id}&userName=${encodeURIComponent(`${friend.firstName} ${friend.lastName}`)}`);
    };

    const formatFriendSince = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

    const moreMenuItems = [
        {
            key: 'chat',
            label: 'Start Chat',
            icon: <MessageOutlined />,
            onClick: handleStartChat
        },
        {
            key: 'remove',
            label: 'Remove Friend',
            icon: <UserDeleteOutlined />,
            danger: true,
            onClick: handleRemoveFriend
        }
    ];

    return (
        <Card
            size="small"
            hoverable
            onClick={handleViewProfile}
            style={{
                background: 'var(--card-background)',
                borderColor: 'var(--border-color)',
                cursor: 'pointer'
            }}
            actions={[
                <Tooltip title="View Profile">
                    <Button
                        type="text"
                        icon={<UserOutlined />}
                        onClick={handleViewProfile}
                        style={{ color: 'var(--text-color)' }}
                    >
                        Profile
                    </Button>
                </Tooltip>,
                <Tooltip title="Start Chat">
                    <Button
                        type="text"
                        icon={<MessageOutlined />}
                        onClick={handleStartChat}
                        style={{ color: 'var(--primary-color)' }}
                    >
                        Chat
                    </Button>
                </Tooltip>,
                <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: 'var(--text-color-secondary)' }}
                    />
                </Dropdown>
            ]}
        >
            <Card.Meta
                avatar={
                    <Badge dot={friend.isOnline} color="green">
                        <Avatar
                            size={48}
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white'
                            }}
                        />
                    </Badge>
                }
                title={
                    <div style={{ color: 'var(--text-color)' }}>
                        <div style={{ fontWeight: 600, fontSize: '16px' }}>
                            {friend.firstName} {friend.lastName}
                        </div>
                        <div style={{
                            fontWeight: 400,
                            fontSize: '14px',
                            color: 'var(--text-color-secondary)'
                        }}>
                            @{friend.username}
                        </div>
                    </div>
                }
                description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        {friend.university && (
                            <Space size={4}>
                                <BankOutlined style={{ color: 'var(--text-color-secondary)' }} />
                                <span style={{
                                    color: 'var(--text-color-secondary)',
                                    fontSize: '13px'
                                }}>
                                    {friend.university}
                                </span>
                            </Space>
                        )}
                        <Space size={4}>
                            <ClockCircleOutlined style={{ color: 'var(--text-color-secondary)' }} />
                            <span style={{
                                color: 'var(--text-color-secondary)',
                                fontSize: '12px'
                            }}>
                                Friends since {formatFriendSince(friend.friendSince)}
                            </span>
                        </Space>
                    </Space>
                }
            />
        </Card>
    );
};

export default FriendCard; 