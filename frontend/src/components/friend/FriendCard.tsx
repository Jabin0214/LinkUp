import React from 'react';
import { Card, Avatar, Space, Button, Tooltip, Badge, Dropdown } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    UserDeleteOutlined
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

    const formatFriendSince = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

    const moreMenuItems = [
        {
            key: 'profile',
            label: 'View Profile',
            icon: <UserOutlined />,
            onClick: handleViewProfile
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
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '120px'
            }}
            className="friend-card"
            actions={[
                <Tooltip title="View Profile" key="profile">
                    <Button
                        type="text"
                        icon={<UserOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile();
                        }}
                        style={{
                            color: 'var(--text-color)',
                            fontSize: '12px'
                        }}
                    >
                        <span className="hidden-xs">Profile</span>
                    </Button>
                </Tooltip>,
                <Dropdown
                    menu={{ items: moreMenuItems }}
                    trigger={['click']}
                    key="more"
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            color: 'var(--text-color-secondary)',
                            fontSize: '12px'
                        }}
                    />
                </Dropdown>
            ]}
        >
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                flex: 1
            }}>
                <Badge dot={friend.isOnline} color="green" offset={[-2, 2]}>
                    <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            flexShrink: 0
                        }}
                        className="friend-avatar"
                    />
                </Badge>

                <div style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    {/* Name and Username */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                    }}>
                        <div
                            className="friend-name"
                            style={{
                                fontWeight: 600,
                                fontSize: '16px',
                                color: 'var(--text-color)',
                                lineHeight: '1.2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {friend.firstName} {friend.lastName}
                        </div>
                        <div style={{
                            fontWeight: 400,
                            fontSize: '13px',
                            color: 'var(--text-color-secondary)',
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            @{friend.username}
                        </div>
                    </div>

                    {/* University */}
                    {friend.university && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px'
                        }}>
                            <BankOutlined style={{
                                color: 'var(--text-color-secondary)',
                                fontSize: '12px'
                            }} />
                            <span style={{
                                color: 'var(--text-color-secondary)',
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {friend.university}
                            </span>
                        </div>
                    )}

                    {/* Friend Since */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                    }}>
                        <ClockCircleOutlined style={{
                            color: 'var(--text-color-secondary)',
                            fontSize: '12px'
                        }} />
                        <span style={{
                            color: 'var(--text-color-secondary)',
                            fontSize: '12px'
                        }}>
                            Friends since {formatFriendSince(friend.friendSince)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FriendCard; 