import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Input,
    Pagination,
    Spin,
    Empty,
    message,
    Typography,
    Card,
    Modal,
    Tabs
} from 'antd';
import { TeamOutlined, UserAddOutlined, InboxOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import {
    getFriends,
    getFriendRequests,
    respondToFriendRequest,
    removeFriend,
    FriendInfo,
    FriendRequestInfo
} from '../Services/FriendService';
import FriendCard from '../components/friend/FriendCard';
import FriendRequestCard from '../components/friend/FriendRequestCard';
import { handleAuthError, isUserAuthenticated, getCurrentToken } from '../utils/authUtils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const FriendsPage: React.FC = () => {
    const { token, isAuthenticated } = useAppSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('friends');

    // Friends state
    const [friends, setFriends] = useState<FriendInfo[]>([]);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [friendsSearch, setFriendsSearch] = useState('');
    const [friendsPage, setFriendsPage] = useState(1);
    const [friendsTotalCount, setFriendsTotalCount] = useState(0);

    // Friend requests state
    const [receivedRequests, setReceivedRequests] = useState<FriendRequestInfo[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequestInfo[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [respondingRequest, setRespondingRequest] = useState<number | null>(null);

    const pageSize = 12;

    // Load friends
    const loadFriends = async (page: number = 1, search: string = '') => {
        if (!isUserAuthenticated()) {
            message.error('Please login to view your friends');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token. Please login again.');
            return;
        }

        try {
            setFriendsLoading(true);
            const response = await getFriends(validToken, {
                page,
                size: pageSize,
                search: search || undefined
            });

            setFriends(response.friends);
            setFriendsTotalCount(response.pagination.totalCount);
            setFriendsPage(response.pagination.currentPage);
        } catch (error: any) {
            console.error('Failed to load friends:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理
            }

            message.error('Failed to load friends');
        } finally {
            setFriendsLoading(false);
        }
    };

    // Load friend requests
    const loadFriendRequests = async () => {
        if (!isUserAuthenticated()) {
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            return;
        }

        try {
            setRequestsLoading(true);
            const [receivedResponse, sentResponse] = await Promise.all([
                getFriendRequests(validToken, 'received'),
                getFriendRequests(validToken, 'sent')
            ]);

            setReceivedRequests(receivedResponse.requests);
            setSentRequests(sentResponse.requests);
        } catch (error: any) {
            console.error('Failed to load friend requests:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理
            }

            message.error('Failed to load friend requests');
        } finally {
            setRequestsLoading(false);
        }
    };

    // Handle friend request response
    const handleRespondToRequest = async (requestId: number, action: 'accept' | 'reject') => {
        if (!isUserAuthenticated()) {
            message.error('Please login to respond to friend requests');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token. Please login again.');
            return;
        }

        try {
            setRespondingRequest(requestId);
            await respondToFriendRequest(validToken, { requestId, action });

            message.success(`Friend request ${action}ed successfully!`);

            // Refresh requests and friends list
            loadFriendRequests();
            if (action === 'accept') {
                loadFriends(friendsPage, friendsSearch);
            }
        } catch (error: any) {
            console.error('Failed to respond to friend request:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理
            }

            message.error(error?.response?.data?.message || 'Failed to respond to friend request');
        } finally {
            setRespondingRequest(null);
        }
    };

    // Handle remove friend
    const handleRemoveFriend = (friendId: number, friendName: string) => {
        confirm({
            title: 'Remove Friend',
            content: `Are you sure you want to remove ${friendName} from your friends list?`,
            okText: 'Yes, Remove',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                if (!isUserAuthenticated()) {
                    message.error('Please login to remove friends');
                    return;
                }

                const validToken = getCurrentToken();
                if (!validToken) {
                    message.error('Invalid authentication token. Please login again.');
                    return;
                }

                try {
                    await removeFriend(validToken, friendId);
                    message.success('Friend removed successfully');
                    loadFriends(friendsPage, friendsSearch);
                } catch (error: any) {
                    console.error('Failed to remove friend:', error);

                    // 使用工具函数处理认证错误
                    if (handleAuthError(error)) {
                        return; // 认证错误已处理
                    }

                    message.error(error?.response?.data?.message || 'Failed to remove friend');
                }
            }
        });
    };



    // Handle friends search
    const handleFriendsSearch = (value: string) => {
        setFriendsSearch(value);
        setFriendsPage(1);
        loadFriends(1, value);
    };

    // Handle friends page change
    const handleFriendsPageChange = (page: number) => {
        setFriendsPage(page);
        loadFriends(page, friendsSearch);
    };

    // Tab change handler
    const handleTabChange = (key: string) => {
        setActiveTab(key);
        if (key === 'requests') {
            loadFriendRequests();
        }
    };

    // Initial load
    useEffect(() => {
        // 检查用户是否已认证
        if (!isUserAuthenticated()) {
            return;
        }

        if (activeTab === 'friends') {
            loadFriends();
        } else if (activeTab === 'requests') {
            loadFriendRequests();
        }
    }, [token, activeTab, isAuthenticated]);

    // Tab items for the new Tabs API
    const tabItems = [
        {
            key: 'friends',
            label: (
                <span style={{ color: 'var(--text-color)' }}>
                    <TeamOutlined style={{ color: 'var(--text-color)' }} />
                    My Friends ({friendsTotalCount})
                </span>
            ),
            children: (
                <>
                    {/* Friends Search */}
                    <Card style={{
                        marginBottom: '24px',
                        background: 'var(--card-background)',
                        borderColor: 'var(--border-color)'
                    }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={12}>
                                <Input
                                    placeholder="Search friends..."
                                    allowClear
                                    size="large"
                                    onPressEnter={(e) => handleFriendsSearch((e.target as HTMLInputElement).value)}
                                    onChange={(e) => {
                                        if (!e.target.value) {
                                            handleFriendsSearch('');
                                        }
                                    }}
                                    onBlur={(e) => handleFriendsSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        color: 'var(--text-color-secondary)'
                                    }}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Text type="secondary" style={{ color: 'var(--text-color-secondary)' }}>
                                    {friendsTotalCount} friend{friendsTotalCount !== 1 ? 's' : ''}
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                    {/* Friends List */}
                    <Spin spinning={friendsLoading}>
                        {friends.length === 0 && !friendsLoading ? (
                            <Empty
                                description="No friends found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{
                                    padding: '48px',
                                    background: 'var(--card-background)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                        ) : (
                            <Row gutter={[16, 16]}>
                                {friends.map(friend => (
                                    <Col key={friend.id} xs={24} sm={12} md={8} lg={6}>
                                        <FriendCard
                                            friend={friend}
                                            onRemoveFriend={(friendId) =>
                                                handleRemoveFriend(friendId, `${friend.firstName} ${friend.lastName}`)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Spin>
                    {/* Friends Pagination */}
                    {Math.ceil(friendsTotalCount / pageSize) > 1 && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '32px',
                            padding: '24px',
                            background: 'var(--card-background)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <Pagination
                                current={friendsPage}
                                total={friendsTotalCount}
                                pageSize={pageSize}
                                onChange={handleFriendsPageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} of ${total} friends`
                                }
                            />
                        </div>
                    )}
                </>
            )
        },
        {
            key: 'requests',
            label: (
                <span style={{ color: 'var(--text-color)' }}>
                    <InboxOutlined style={{ color: 'var(--text-color)' }} />
                    Requests ({receivedRequests.length})
                </span>
            ),
            children: (
                <Spin spinning={requestsLoading}>
                    <Row gutter={[24, 24]}>
                        {/* Received Requests */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <span style={{ color: 'var(--text-color)' }}>
                                        <UserAddOutlined style={{
                                            marginRight: '8px',
                                            color: 'var(--text-color)'
                                        }} />
                                        Received Requests ({receivedRequests.length})
                                    </span>
                                }
                                style={{
                                    background: 'var(--card-background)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                {receivedRequests.length === 0 ? (
                                    <Empty
                                        description="No pending requests"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        style={{ padding: '24px' }}
                                    />
                                ) : (
                                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        {receivedRequests.map(request => (
                                            <div key={request.id} style={{ marginBottom: '16px' }}>
                                                <FriendRequestCard
                                                    request={request}
                                                    onAccept={(id) => handleRespondToRequest(id, 'accept')}
                                                    onReject={(id) => handleRespondToRequest(id, 'reject')}
                                                    loading={respondingRequest === request.id}
                                                    type="received"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        {/* Sent Requests */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <span style={{ color: 'var(--text-color)' }}>
                                        <InboxOutlined style={{
                                            marginRight: '8px',
                                            color: 'var(--text-color)'
                                        }} />
                                        Sent Requests ({sentRequests.length})
                                    </span>
                                }
                                style={{
                                    background: 'var(--card-background)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                {sentRequests.length === 0 ? (
                                    <Empty
                                        description="No sent requests"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        style={{ padding: '24px' }}
                                    />
                                ) : (
                                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        {sentRequests.map(request => (
                                            <div key={request.id} style={{ marginBottom: '16px' }}>
                                                <FriendRequestCard
                                                    request={request}
                                                    type="sent"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            )
        }
    ];

    return (
        <div style={{
            padding: '24px',
            color: 'var(--text-color)',
            backgroundColor: 'var(--body-background)',
            minHeight: '100vh'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{
                    color: 'var(--text-color)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TeamOutlined style={{ marginRight: '12px', color: 'var(--primary-color)' }} />
                    Friends
                </Title>
                <Text type="secondary" style={{
                    fontSize: '16px',
                    color: 'var(--text-color-secondary)'
                }}>
                    Manage your connections and friend requests
                </Text>
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                size="large"
                style={{
                    marginBottom: '24px',
                    color: 'var(--text-color)'
                }}
                items={tabItems}
            />
        </div>
    );
};

export default FriendsPage; 