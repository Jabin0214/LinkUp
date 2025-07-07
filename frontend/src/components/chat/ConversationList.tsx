import React, { useState, useEffect, useCallback } from 'react';
import { List, Avatar, Typography, Badge, message, Button, Empty, Tooltip } from 'antd';
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
            if (!isInitialized) return;
            if (signalRMessage.senderId !== user?.id) {
                setConversations(prev => {
                    const updatedConversations = [...prev];
                    const conversationIndex = updatedConversations.findIndex(
                        conv => conv.userId === signalRMessage.senderId || conv.userId === signalRMessage.receiverId
                    );
                    if (conversationIndex !== -1) {
                        const existingConversation = updatedConversations[conversationIndex];
                        if (existingConversation.lastMessage === signalRMessage.content &&
                            Math.abs(new Date(existingConversation.lastMessageTime).getTime() - new Date().getTime()) < 5000) {
                            return prev;
                        }
                        updatedConversations[conversationIndex] = {
                            ...existingConversation,
                            lastMessage: signalRMessage.content,
                            lastMessageTime: new Date().toISOString(),
                            unreadCount: existingConversation.unreadCount + 1
                        };
                    } else {
                        updatedConversations.unshift({
                            userId: signalRMessage.senderId,
                            userName: 'Unknown User',
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
        return () => setIsInitialized(false);
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

    const truncateMessage = (message: string, maxLength: number = 36) => {
        return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    };

    return (
        <div className="conversation-list-modern">
            {error && (
                <div className="conversation-list-error">
                    <Text type="danger" style={{ fontSize: '12px' }}>{error}</Text>
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
                                <div className="conversation-modern-header">
                                    <span className="conversation-modern-username">
                                        {conversation.userName}
                                    </span>
                                    <span className="conversation-modern-time">
                                        {formatTime(conversation.lastMessageTime)}
                                    </span>
                                </div>
                                <div className="conversation-modern-footer">
                                    <span className="conversation-modern-message">
                                        {truncateMessage(conversation.lastMessage)}
                                    </span>
                                    {conversation.unreadCount > 0 && (
                                        <Badge count={conversation.unreadCount} className="conversation-modern-unread" />
                                    )}
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