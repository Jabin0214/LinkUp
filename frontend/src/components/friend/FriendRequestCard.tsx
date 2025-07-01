import React from 'react';
import { Card, Avatar, Space, Button, message } from 'antd';
import { UserOutlined, BankOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FriendRequestInfo } from '../../Services/FriendService';

interface FriendRequestCardProps {
    request: FriendRequestInfo;
    onAccept?: (requestId: number) => void;
    onReject?: (requestId: number) => void;
    loading?: boolean;
    type?: 'received' | 'sent';
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
    request,
    onAccept,
    onReject,
    loading = false,
    type = 'received'
}) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/dashboard/user/${request.senderId}`);
    };

    const handleAccept = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAccept?.(request.id);
    };

    const handleReject = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReject?.(request.id);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted': return 'var(--success-color)';
            case 'rejected': return 'var(--error-color)';
            default: return 'var(--warning-color)';
        }
    };

    return (
        <Card
            size="small"
            hoverable
            onClick={handleViewProfile}
            style={{
                background: 'var(--card-background)',
                borderColor: 'var(--border-color)',
                cursor: 'pointer',
                borderLeft: `4px solid ${getStatusColor(request.status)}`
            }}
            actions={type === 'received' && request.status === 'Pending' ? [
                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleAccept}
                    loading={loading}
                    size="small"
                    style={{
                        backgroundColor: 'var(--success-color)',
                        borderColor: 'var(--success-color)'
                    }}
                >
                    Accept
                </Button>,
                <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={handleReject}
                    loading={loading}
                    size="small"
                >
                    Reject
                </Button>
            ] : [
                <Button
                    type="text"
                    icon={<UserOutlined />}
                    onClick={handleViewProfile}
                    style={{ color: 'var(--text-color)' }}
                    size="small"
                >
                    View Profile
                </Button>
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
                            {request.senderFirstName} {request.senderLastName}
                        </div>
                        <div style={{
                            fontWeight: 400,
                            fontSize: '14px',
                            color: 'var(--text-color-secondary)'
                        }}>
                            @{request.senderUsername}
                        </div>
                    </div>
                }
                description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        {request.senderUniversity && (
                            <Space size={4}>
                                <BankOutlined style={{ color: 'var(--text-color-secondary)' }} />
                                <span style={{
                                    color: 'var(--text-color-secondary)',
                                    fontSize: '13px'
                                }}>
                                    {request.senderUniversity}
                                </span>
                            </Space>
                        )}
                        <Space size={4}>
                            <ClockCircleOutlined style={{ color: 'var(--text-color-secondary)' }} />
                            <span style={{
                                color: 'var(--text-color-secondary)',
                                fontSize: '12px'
                            }}>
                                {formatDate(request.createdAt)}
                            </span>
                        </Space>
                        {request.message && (
                            <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                backgroundColor: 'var(--hover-background)',
                                borderRadius: '4px',
                                fontSize: '13px',
                                color: 'var(--text-color)',
                                fontStyle: 'italic',
                                borderLeft: '3px solid var(--primary-color)'
                            }}>
                                "{request.message}"
                            </div>
                        )}
                        {type === 'sent' && (
                            <div style={{
                                marginTop: '4px',
                                fontSize: '12px',
                                color: getStatusColor(request.status),
                                fontWeight: 500
                            }}>
                                Status: {request.status}
                            </div>
                        )}
                    </Space>
                }
            />
        </Card>
    );
};

export default FriendRequestCard; 