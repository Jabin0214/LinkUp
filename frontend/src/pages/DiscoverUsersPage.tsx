import React, { useState, useEffect, useCallback } from 'react';
import {
    Row,
    Col,
    Input,
    Select,
    Pagination,
    Spin,
    Empty,
    message,
    Space,
    Typography,
    Card,
    Button
} from 'antd';
import { TeamOutlined, BankOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { discoverUsers, getUniversities, DiscoverUser, University } from '../Services/UserService';
import { sendFriendRequest } from '../Services/FriendService';
import UserCard from '../components/user/UserCard';
import { handleAuthError, isUserAuthenticated, getCurrentToken } from '../utils/authUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const DiscoverUsersPage: React.FC = () => {
    const { token, isAuthenticated, user } = useAppSelector(state => state.auth);

    const [users, setUsers] = useState<DiscoverUser[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendingRequest, setSendingRequest] = useState<number | null>(null);

    // Filters and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 12;

    // Load users
    const loadUsers = useCallback(async (page: number = 1, resetSearch: boolean = false) => {
        // 使用工具函数进行更严格的认证检查
        if (!isUserAuthenticated()) {
            message.error('Please login first to discover users');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token. Please login again.');
            return;
        }

        try {
            setLoading(true);

            const params = {
                page,
                size: pageSize,
                university: selectedUniversity || undefined,
                search: searchTerm || undefined
            };

            const response = await discoverUsers(validToken, params);
            setUsers(response.users);
            setTotalCount(response.pagination.totalCount);
            setTotalPages(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);

            if (resetSearch) {
                setCurrentPage(1);
            }
        } catch (error: any) {
            console.error('Failed to load users:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理，会自动重定向
            }

            message.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [selectedUniversity, searchTerm]);

    // Load universities
    const loadUniversities = async () => {
        if (!isUserAuthenticated()) {
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            return;
        }

        try {
            const universitiesData = await getUniversities(validToken);
            setUniversities(universitiesData);
        } catch (error: any) {
            console.error('Failed to load universities:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理
            }
        }
    };

    // Handle friend request
    const handleSendFriendRequest = async (userId: number) => {
        if (!isUserAuthenticated()) {
            message.error('Please login first to send friend requests');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token. Please login again.');
            return;
        }

        try {
            setSendingRequest(userId);
            await sendFriendRequest(validToken, { receiverId: userId });
            message.success('Friend request sent successfully!');

            // Refresh the users list to update the UI
            loadUsers(currentPage);
        } catch (error: any) {
            console.error('Failed to send friend request:', error);

            // 使用工具函数处理认证错误
            if (handleAuthError(error)) {
                return; // 认证错误已处理
            }

            message.error(error?.response?.data?.message || 'Failed to send friend request');
        } finally {
            setSendingRequest(null);
        }
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Handle university filter
    const handleUniversityChange = (value: string) => {
        setSelectedUniversity(value);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadUsers(page);
    };

    // Effect to load data when filters change
    useEffect(() => {
        loadUsers(1, true);
    }, [searchTerm, selectedUniversity, token, loadUsers]);

    // Initial load
    useEffect(() => {
        loadUniversities();
    }, [token]);

    // Group users by university
    const groupedUsers = users.reduce((acc, user) => {
        const university = user.university || 'Other';
        if (!acc[university]) {
            acc[university] = [];
        }
        acc[university].push(user);
        return acc;
    }, {} as Record<string, DiscoverUser[]>);

    const renderUsersByUniversity = () => {
        const universityKeys = Object.keys(groupedUsers).sort((a, b) => {
            // Prioritize universities with schoolmates
            const aHasSchoolmates = groupedUsers[a].some(user => user.isSchoolmate);
            const bHasSchoolmates = groupedUsers[b].some(user => user.isSchoolmate);

            if (aHasSchoolmates && !bHasSchoolmates) return -1;
            if (!aHasSchoolmates && bHasSchoolmates) return 1;

            // Then sort by number of users
            return groupedUsers[b].length - groupedUsers[a].length;
        });

        return universityKeys.map(university => {
            const universityUsers = groupedUsers[university];
            const schoolmatesCount = universityUsers.filter(user => user.isSchoolmate).length;

            return (
                <div key={university} style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        padding: '12px 0',
                        borderBottom: '2px solid var(--border-color)'
                    }}>
                        <BankOutlined style={{
                            fontSize: '20px',
                            color: 'var(--primary-color)',
                            marginRight: '12px'
                        }} />
                        <Title level={4} style={{
                            margin: 0,
                            color: 'var(--text-color)'
                        }}>
                            {university}
                        </Title>
                        <Space style={{ marginLeft: 'auto' }}>
                            <Text type="secondary">
                                {universityUsers.length} user{universityUsers.length !== 1 ? 's' : ''}
                            </Text>
                            {schoolmatesCount > 0 && (
                                <Text style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                                    {schoolmatesCount} schoolmate{schoolmatesCount !== 1 ? 's' : ''}
                                </Text>
                            )}
                        </Space>
                    </div>

                    <Row gutter={[16, 16]}>
                        {universityUsers.map(user => (
                            <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
                                <UserCard
                                    user={user}
                                    onSendFriendRequest={handleSendFriendRequest}
                                    loading={sendingRequest === user.id}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            );
        });
    };

    // Early authentication check
    if (!isUserAuthenticated()) {
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
                        Discover People
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Find and connect with people from your university and beyond
                    </Text>
                </div>

                <Card style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: 'var(--card-background)',
                    borderColor: 'var(--border-color)'
                }}>
                    <Title level={4} style={{ color: 'var(--text-color)' }}>
                        Authentication Required
                    </Title>
                    <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                        You need to login to discover and connect with other users.
                    </Text>
                    <Space direction="vertical" size={12}>
                        <Button
                            type="primary"
                            onClick={() => window.location.href = '/login'}
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                borderColor: 'var(--primary-color)'
                            }}
                        >
                            Go to Login
                        </Button>
                        <Button
                            type="default"
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            size="small"
                        >
                            Clear Cache & Reload
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                message.info('Debug info logged to console');
                            }}
                        >
                            Debug Auth State
                        </Button>
                    </Space>
                </Card>
            </div>
        );
    }

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
                    Discover People
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Find and connect with people from your university and beyond
                </Text>
            </div>

            {/* Filters */}
            <Card style={{
                marginBottom: '24px',
                background: 'var(--card-background)',
                borderColor: 'var(--border-color)'
            }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Search by name or username..."
                            allowClear
                            size="large"
                            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    handleSearch(''); // 当清空输入框时立即搜索
                                }
                            }}
                            onBlur={(e) => handleSearch(e.target.value)}
                            style={{
                                width: '100%',
                                color: 'var(--text-color-secondary)'
                            }}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Filter by university"
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            value={selectedUniversity || undefined}
                            onChange={handleUniversityChange}
                            showSearch
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {universities.map(uni => (
                                <Option key={uni.name} value={uni.name} label={uni.name}>
                                    <Space>
                                        <span>{uni.name}</span>
                                        <Text type="secondary">({uni.userCount})</Text>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Text type="secondary">
                            {totalCount} user{totalCount !== 1 ? 's' : ''} found
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Users List */}
            <Spin spinning={loading}>
                {users.length === 0 && !loading ? (
                    <Empty
                        description="No users found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{
                            padding: '48px',
                            background: 'var(--card-background)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                        }}
                    />
                ) : selectedUniversity ? (
                    // Show users in a simple grid when filtering by university
                    <Row gutter={[16, 16]}>
                        {users.map(user => (
                            <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
                                <UserCard
                                    user={user}
                                    onSendFriendRequest={handleSendFriendRequest}
                                    loading={sendingRequest === user.id}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    // Show users grouped by university when not filtering
                    renderUsersByUniversity()
                )}
            </Spin>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    padding: '24px',
                    background: 'var(--card-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                }}>
                    <Pagination
                        current={currentPage}
                        total={totalCount}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default DiscoverUsersPage; 