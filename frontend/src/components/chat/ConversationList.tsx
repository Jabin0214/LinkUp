import React, { useState, useEffect, useCallback } from 'react';
import { List, Avatar, Typography, Badge, message, Button, Empty } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { ConversationDto, getConversations } from '../../Services/MessageService';
import { getCurrentToken, isUserAuthenticated } from '../../utils/authUtils';
import { useSignalR } from '../../hooks/useSignalR';
import { useAppSelector } from '../../store/hooks';

const { Text } = Typography;

interface ConversationListProps {
    onSelectConversation: (userId: number, userName: string) => void;
    selectedUserId?: number;
}

const ConversationList: React.FC<ConversationListProps> = ({
    onSelectConversation,
    selectedUserId
}) => {
    const { user } = useAppSelector(state => state.auth);
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // SignalR连接
    useSignalR({
        onReceiveMessage: (signalRMessage) => {
            // 只在初始化后处理消息
            if (!isInitialized) {
                return;
            }

            // 只处理来自其他用户的消息
            if (signalRMessage.senderId !== user?.id) {
                setConversations(prev => {
                    const updatedConversations = [...prev];
                    const conversationIndex = updatedConversations.findIndex(
                        conv => conv.userId === signalRMessage.senderId || conv.userId === signalRMessage.receiverId
                    );

                    // 检查是否已经更新过相同的消息（避免重复更新）
                    if (conversationIndex !== -1) {
                        const existingConversation = updatedConversations[conversationIndex];
                        if (existingConversation.lastMessage === signalRMessage.content &&
                            Math.abs(new Date(existingConversation.lastMessageTime).getTime() - new Date().getTime()) < 5000) {
                            return prev; // 跳过重复更新
                        }

                        // 更新现有对话
                        updatedConversations[conversationIndex] = {
                            ...existingConversation,
                            lastMessage: signalRMessage.content,
                            lastMessageTime: new Date().toISOString(),
                            unreadCount: existingConversation.unreadCount + 1
                        };
                    } else {
                        // 添加新对话
                        updatedConversations.unshift({
                            userId: signalRMessage.senderId,
                            userName: 'Unknown User', // 这里需要从用户服务获取用户名
                            lastMessage: signalRMessage.content,
                            lastMessageTime: new Date().toISOString(),
                            unreadCount: 1
                        });
                    }

                    return updatedConversations;
                });
            }
        },
        onError: (error) => {
            console.error('SignalR error:', error);
        }
    });

    useEffect(() => {
        setIsInitialized(false);
        setConversations([]);
        loadConversations();

        return () => {
            setIsInitialized(false);
        };
    }, []);

    const loadConversations = useCallback(async () => {
        if (!isUserAuthenticated()) {
            message.error('Please login to view conversations');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const conversationsData = await getConversations(validToken);
            setConversations(conversationsData);
            setIsInitialized(true);
        } catch (error: any) {
            console.error('Failed to load conversations:', error);
            setError('Failed to load conversations');
            message.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const truncateMessage = (message: string, maxLength: number = 50) => {
        return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Error Display */}
            {error && (
                <div style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'rgba(255, 77, 79, 0.1)'
                }}>
                    <Text type="danger" style={{ fontSize: '12px' }}>{error}</Text>
                    <br />
                    <Button
                        type="link"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={loadConversations}
                        style={{ marginTop: '4px', padding: 0 }}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Conversations List */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                <List
                    loading={loading}
                    dataSource={conversations}
                    renderItem={(conversation) => (
                        <List.Item
                            className={`conversation-item ${selectedUserId === conversation.userId ? 'selected' : ''}`}
                            onClick={() => onSelectConversation(conversation.userId, conversation.userName)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Badge count={conversation.unreadCount} size="small">
                                        <Avatar
                                            icon={<UserOutlined />}
                                            className={`conversation-avatar ${selectedUserId === conversation.userId ? 'selected' : ''}`}
                                        />
                                    </Badge>
                                }
                                title={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: '14px'
                                            }}
                                        >
                                            {conversation.userName}
                                        </Text>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: '11px'
                                            }}
                                        >
                                            {formatTime(conversation.lastMessageTime)}
                                        </Text>
                                    </div>
                                }
                                description={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '4px'
                                    }}>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                                                flex: 1,
                                                marginRight: '8px'
                                            }}
                                        >
                                            {truncateMessage(conversation.lastMessage)}
                                        </Text>
                                        {conversation.unreadCount > 0 && (
                                            <Badge
                                                count={conversation.unreadCount}
                                                size="small"
                                                style={{
                                                    backgroundColor: selectedUserId === conversation.userId
                                                        ? 'white'
                                                        : 'var(--primary-color)',
                                                    color: selectedUserId === conversation.userId
                                                        ? 'var(--primary-color)'
                                                        : 'white'
                                                }}
                                            />
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                    locale={{
                        emptyText: (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: 'var(--text-color-secondary)'
                            }}>
                                <div style={{
                                    fontSize: '48px',
                                    marginBottom: '16px',
                                    opacity: 0.5
                                }}>
                                    💬
                                </div>
                                <Text style={{
                                    fontSize: '14px',
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    No conversations yet
                                </Text>
                                <br />
                                <Text style={{
                                    fontSize: '12px',
                                    color: 'var(--text-color-secondary)',
                                    opacity: 0.7
                                }}>
                                    Start chatting with your friends!
                                </Text>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    );
};

export default ConversationList; 