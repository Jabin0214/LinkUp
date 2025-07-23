import React, { useState, useEffect, useCallback } from 'react';
import { List, Avatar, Typography, message, Button } from 'antd';
import { UserOutlined, ReloadOutlined, BugOutlined } from '@ant-design/icons';
import { ConversationDto, getConversations } from '../../Services/MessageService';
import { getCurrentToken, isUserAuthenticated } from '../../utils/authUtils';
import { useSignalR } from '../../hooks/useSignalR';
import { useAppSelector } from '../../store/hooks';
import HttpClient from '../../utils/httpClient';

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
    const [debugInfo, setDebugInfo] = useState<any>(null);

    // SignalR连接
    useSignalR({
        onReceiveMessage: (signalRMessage) => {
            if (!isInitialized) return;

            console.log('ConversationList received SignalR message:', signalRMessage);

            setConversations(prev => {
                const updatedConversations = [...prev];

                // 确定对话对象的用户ID
                let conversationUserId: number;
                if (signalRMessage.senderId === user?.id) {
                    // 当前用户发送的消息，对话对象是接收者
                    conversationUserId = signalRMessage.receiverId;
                } else {
                    // 其他用户发送的消息，对话对象是发送者
                    conversationUserId = signalRMessage.senderId;
                }

                const conversationIndex = updatedConversations.findIndex(
                    conv => conv.userId === conversationUserId
                );

                if (conversationIndex !== -1) {
                    const existingConversation = updatedConversations[conversationIndex];

                    // 检查是否是重复消息
                    if (existingConversation.lastMessage === signalRMessage.content &&
                        Math.abs(new Date(existingConversation.lastMessageTime).getTime() - new Date().getTime()) < 5000) {
                        return prev;
                    }

                    // 更新现有对话的最后消息
                    updatedConversations[conversationIndex] = {
                        ...existingConversation,
                        lastMessage: signalRMessage.content,
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: signalRMessage.senderId === user?.id ? 0 : existingConversation.unreadCount + 1
                    };

                    // 将更新的对话移到列表顶部
                    const updatedConversation = updatedConversations.splice(conversationIndex, 1)[0];
                    updatedConversations.unshift(updatedConversation);

                } else if (signalRMessage.senderId !== user?.id) {
                    // 只有当接收到新用户的消息时才创建新对话
                    updatedConversations.unshift({
                        userId: signalRMessage.senderId,
                        userName: `User ${signalRMessage.senderId}`,
                        lastMessage: signalRMessage.content,
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 1
                    });
                }

                return updatedConversations;
            });
        },
        onError: (error) => {
            console.error('SignalR error:', error);
        }
    });

    // 加载对话列表
    const loadConversations = useCallback(async () => {
        if (!isUserAuthenticated()) {
            message.error('Please login to view conversations');
            return;
        }

        const token = getCurrentToken();
        if (!token) {
            message.error('Invalid authentication token');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const conversationsData = await getConversations(token);
            setConversations(conversationsData);
            setIsInitialized(true);
        } catch (error: any) {
            console.error('Failed to load conversations:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load conversations';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // 初始化加载
    useEffect(() => {
        if (isUserAuthenticated()) {
            setIsInitialized(false);
            setConversations([]);
            loadConversations();
        }
        return () => setIsInitialized(false);
    }, [loadConversations, isUserAuthenticated]);

    const loadDebugInfo = useCallback(async () => {
        const validToken = getCurrentToken();
        if (!validToken) return;

        try {
            const result = await HttpClient.getWithAuth<any>(
                '/Message/debug',
                validToken
            );
            setDebugInfo(result.data);
            console.log('Debug info:', result.data);
        } catch (error) {
            console.error('Failed to load debug info:', error);
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

    const truncateMessage = (message: string, maxLength: number = 36) => {
        return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    };

    return (
        <div className="conversation-list-modern">
            {error && (
                <div className="conversation-list-error">
                    <Text type="danger" style={{ fontSize: '12px' }}>{error}</Text>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <Button
                            type="link"
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={loadConversations}
                            style={{ padding: 0 }}
                        >
                            Retry
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            icon={<BugOutlined />}
                            onClick={loadDebugInfo}
                            style={{ padding: 0 }}
                        >
                            Debug
                        </Button>
                    </div>
                    {debugInfo && (
                        <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                            <Text style={{ fontSize: '10px' }}>
                                User ID: {debugInfo.userId}<br />
                                Total Messages: {debugInfo.totalMessages}<br />
                                Conversations: {debugInfo.conversationsCount}<br />
                                Unread: {debugInfo.unreadCount}
                            </Text>
                        </div>
                    )}
                </div>
            )}
            <List
                loading={loading}
                dataSource={conversations}
                renderItem={conversation => {
                    const selected = selectedUserId === conversation.userId;
                    return (
                        <div
                            className={`conversation-modern-item${selected ? ' selected' : ''}`}
                            onClick={() => onSelectConversation(conversation.userId, conversation.userName)}
                        >
                            <Avatar
                                size={44}
                                icon={<UserOutlined />}
                                className="conversation-modern-avatar"
                            />
                            <div className="conversation-modern-content">
                                <div className="conversation-modern-header" style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="conversation-modern-username" style={{ color: 'var(--text-color)', fontWeight: 500, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                        {conversation.userName}
                                    </span>
                                    <span className="conversation-modern-time" style={{ color: 'var(--text-color-secondary)', fontSize: 13, marginLeft: 16, flexShrink: 0, textAlign: 'right', minWidth: 60 }}>
                                        {formatTime(conversation.lastMessageTime)}
                                    </span>
                                </div>
                                <div className="conversation-modern-footer">
                                    <span className="conversation-modern-message" style={{ color: 'var(--text-color-secondary)' }}>
                                        {truncateMessage(conversation.lastMessage)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                }}
                locale={{
                    emptyText: (
                        <div className="conversation-modern-empty">
                            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.5 }}>💬</div>
                            <Text style={{ fontSize: '14px', color: 'var(--text-color-secondary)' }}>
                                No conversations yet
                            </Text>
                            <br />
                            <Text style={{ fontSize: '12px', color: 'var(--text-color-secondary)', opacity: 0.7 }}>
                                Start chatting with your friends!
                            </Text>
                        </div>
                    )
                }}
            />
        </div>
    );
};

export default ConversationList; 