import React from 'react';
import { Card, Avatar, Space, Tag, Button, Tooltip } from 'antd';
import { UserOutlined, BankOutlined, ClockCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DiscoverUser } from '../../Services/UserService';

interface UserCardProps {
    user: DiscoverUser;
    onSendFriendRequest?: (userId: number) => void;
    loading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSendFriendRequest, loading = false }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/dashboard/user/${user.id}`);
    };

    const handleSendRequest = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSendFriendRequest?.(user.id);
    };

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

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
                <Tooltip title="Send Friend Request">
                    <Button
                        type="text"
                        icon={<UserAddOutlined />}
                        onClick={handleSendRequest}
                        loading={loading}
                        style={{ color: 'var(--primary-color)' }}
                    >
                        Add Friend
                    </Button>
                </Tooltip>
            ]}
        >
            <Card.Meta
                avatar={
                    <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white'
                        }}
                    />
                }
                title={
                    <div style={{ color: 'var(--text-color)' }}>
                        <div style={{ fontWeight: 600, fontSize: '16px' }}>
                            {user.firstName} {user.lastName}
                        </div>
                        <div style={{
                            fontWeight: 400,
                            fontSize: '14px',
                            color: 'var(--text-color-secondary)'
                        }}>
                            @{user.username}
                        </div>
                    </div>
                }
                description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        {user.university && (
                            <Space size={4}>
                                <BankOutlined style={{ color: 'var(--text-color-secondary)' }} />
                                <span style={{
                                    color: 'var(--text-color-secondary)',
                                    fontSize: '13px'
                                }}>
                                    {user.university}
                                </span>
                                {user.isSchoolmate && (
                                    <Tag color="blue" style={{ fontSize: '12px' }}>Schoolmate</Tag>
                                )}
                            </Space>
                        )}
                        <Space size={4}>
                            <ClockCircleOutlined style={{ color: 'var(--text-color-secondary)' }} />
                            <span style={{
                                color: 'var(--text-color-secondary)',
                                fontSize: '12px'
                            }}>
                                Joined {formatJoinDate(user.joinedAt)}
                            </span>
                        </Space>
                    </Space>
                }
            />
        </Card>
    );
};

export default UserCard;