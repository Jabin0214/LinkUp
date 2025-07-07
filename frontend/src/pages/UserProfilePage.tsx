import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Avatar,
    Space,
    Typography,
    Button,
    Spin,
    message,
    Row,
    Col,
    Tag,
    Modal,
    Input,
    Divider,
    Empty
} from 'antd';
import {
    UserOutlined,
    BankOutlined,
    CalendarOutlined,
    UserAddOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    ArrowLeftOutlined,
    LinkOutlined,
    CodeOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { getUserProfile, UserPublicProfile } from '../Services/UserService';
import { sendFriendRequest, getMutualFriends, MutualFriendsResponse } from '../Services/FriendService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const UserProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAppSelector(state => state.auth);

    const [profile, setProfile] = useState<UserPublicProfile | null>(null);
    const [mutualFriends, setMutualFriends] = useState<MutualFriendsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');

    // Load user profile
    const loadProfile = useCallback(async () => {
        if (!token || !id) return;

        try {
            setLoading(true);
            const userId = parseInt(id);
            const [profileData, mutualData] = await Promise.all([
                getUserProfile(token, userId),
                getMutualFriends(token, userId).catch(() => null) // Don't fail if mutual friends fails
            ]);

            setProfile(profileData);
            setMutualFriends(mutualData);
        } catch (error: any) {
            console.error('Failed to load profile:', error);
            if (error?.response?.status === 404) {
                message.error('User not found');
                navigate('/dashboard/discover');
            } else {
                message.error('Failed to load user profile');
            }
        } finally {
            setLoading(false);
        }
    }, [token, id, navigate]);

    // Handle friend request
    const handleSendFriendRequest = async () => {
        if (!token || !profile) return;

        try {
            setSendingRequest(true);
            await sendFriendRequest(token, {
                receiverId: profile.id,
                message: requestMessage.trim() || undefined
            });

            message.success('Friend request sent successfully!');
            setShowRequestModal(false);
            setRequestMessage('');

            // Refresh profile to update status
            loadProfile();
        } catch (error: any) {
            console.error('Failed to send friend request:', error);
            message.error(error?.response?.data?.message || 'Failed to send friend request');
        } finally {
            setSendingRequest(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const getFriendshipStatusButton = () => {
        if (!profile) return null;

        if (profile.isFriend) {
            return (
                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    style={{ backgroundColor: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                    disabled
                >
                    Friends
                </Button>
            );
        }

        if (profile.hasPendingRequest) {
            if (profile.friendRequestStatus === 'sent') {
                return (
                    <Button
                        icon={<ClockCircleOutlined />}
                        disabled
                    >
                        Request Sent
                    </Button>
                );
            } else {
                return (
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                    >
                        Accept Request
                    </Button>
                );
            }
        }

        return (
            <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setShowRequestModal(true)}
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
                Add Friend
            </Button>
        );
    };

    useEffect(() => {
        loadProfile();
    }, [id, token, loadProfile]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ padding: '24px' }}>
                <Empty description="User not found" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', color: 'var(--text-color)' }}>
            {/* Back Button */}
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '24px' }}
            >
                Back
            </Button>

            <Row gutter={[24, 24]}>
                {/* Profile Info */}
                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            background: 'var(--card-background)',
                            borderColor: 'var(--border-color)',
                            textAlign: 'center'
                        }}
                    >
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <Avatar
                                size={120}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }}
                            />

                            <div>
                                <Title level={3} style={{ margin: 0, color: 'var(--text-color)' }}>
                                    {profile.firstName} {profile.lastName}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '16px' }}>
                                    @{profile.username}
                                </Text>
                            </div>

                            {profile.university && (
                                <Space>
                                    <BankOutlined style={{ color: 'var(--text-color-secondary)' }} />
                                    <Text>{profile.university}</Text>
                                </Space>
                            )}

                            <Space>
                                <CalendarOutlined style={{ color: 'var(--text-color-secondary)' }} />
                                <Text type="secondary">
                                    Joined {formatDate(profile.joinedAt)}
                                </Text>
                            </Space>

                            <Space size={12}>
                                {getFriendshipStatusButton()}
                                <Button
                                    type="default"
                                    icon={<UserOutlined />}
                                    onClick={() => navigate(`/dashboard/chat?userId=${profile.id}&userName=${encodeURIComponent(`${profile.firstName} ${profile.lastName}`)}`)}
                                    style={{ marginLeft: 8 }}
                                >
                                    Chat
                                </Button>
                            </Space>
                        </Space>
                    </Card>

                    {/* Mutual Friends */}
                    {mutualFriends && mutualFriends.count > 0 && (
                        <Card
                            title={`Mutual Friends (${mutualFriends.count})`}
                            style={{
                                marginTop: '16px',
                                background: 'var(--card-background)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                {mutualFriends.mutualFriends.slice(0, 5).map(friend => (
                                    <div key={friend.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        background: 'var(--hover-background)'
                                    }}>
                                        <Avatar
                                            size={32}
                                            icon={<UserOutlined />}
                                            style={{ marginRight: '12px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 500 }}>
                                                {friend.firstName} {friend.lastName}
                                            </div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                @{friend.username}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                                {mutualFriends.count > 5 && (
                                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                                        +{mutualFriends.count - 5} more
                                    </Text>
                                )}
                            </Space>
                        </Card>
                    )}
                </Col>

                {/* Skill Board */}
                <Col xs={24} lg={16}>
                    {profile.skillBoard ? (
                        <Card
                            title={
                                <Space>
                                    <CodeOutlined />
                                    <span>Skill Board</span>
                                </Space>
                            }
                            style={{
                                background: 'var(--card-background)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            {/* Introduction */}
                            {profile.skillBoard.introduction && (
                                <div style={{ marginBottom: '24px' }}>
                                    <Title level={5} style={{ color: 'var(--text-color)' }}>
                                        Introduction
                                    </Title>
                                    <Paragraph style={{ color: 'var(--text-color)' }}>
                                        {profile.skillBoard.introduction}
                                    </Paragraph>
                                </div>
                            )}

                            {/* Direction */}
                            {profile.skillBoard.direction && (
                                <div style={{ marginBottom: '24px' }}>
                                    <Title level={5} style={{ color: 'var(--text-color)' }}>
                                        Direction
                                    </Title>
                                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                        {profile.skillBoard.direction}
                                    </Tag>
                                </div>
                            )}

                            <Divider />

                            <Row gutter={[24, 24]}>
                                {/* Skills */}
                                {profile.skillBoard.skills.length > 0 && (
                                    <Col xs={24} md={12}>
                                        <Title level={5} style={{ color: 'var(--text-color)' }}>
                                            Skills
                                        </Title>
                                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                            {profile.skillBoard.skills.map((skill, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 12px',
                                                    background: 'var(--hover-background)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <Text style={{ fontWeight: 500 }}>{skill.language}</Text>
                                                    <Tag color={
                                                        skill.level === 'Expert' ? 'red' :
                                                            skill.level === 'Advanced' ? 'orange' :
                                                                skill.level === 'Intermediate' ? 'blue' : 'green'
                                                    }>
                                                        {skill.level}
                                                    </Tag>
                                                </div>
                                            ))}
                                        </Space>
                                    </Col>
                                )}

                                {/* Links */}
                                {profile.skillBoard.links.length > 0 && (
                                    <Col xs={24} md={12}>
                                        <Title level={5} style={{ color: 'var(--text-color)' }}>
                                            Links
                                        </Title>
                                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                            {profile.skillBoard.links.map((link, index) => (
                                                <div key={index} style={{
                                                    padding: '8px 12px',
                                                    background: 'var(--hover-background)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: 'var(--primary-color)',
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <LinkOutlined style={{ marginRight: '8px' }} />
                                                        {link.title}
                                                    </a>
                                                </div>
                                            ))}
                                        </Space>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    ) : (
                        <Card
                            style={{
                                background: 'var(--card-background)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <Empty
                                description="No skill board available"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Friend Request Modal */}
            <Modal
                title="Send Friend Request"
                open={showRequestModal}
                onCancel={() => setShowRequestModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowRequestModal(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="send"
                        type="primary"
                        loading={sendingRequest}
                        onClick={handleSendFriendRequest}
                    >
                        Send Request
                    </Button>
                ]}
            >
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Text>
                        Send a friend request to <strong>{profile.firstName} {profile.lastName}</strong>
                    </Text>
                    <TextArea
                        placeholder="Add a message (optional)"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={3}
                        maxLength={500}
                        showCount
                    />
                </Space>
            </Modal>
        </div>
    );
};

export default UserProfilePage; 