import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Space, message, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, CheckOutlined, LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { MessageDto, sendMessage, getConversation, markAsRead } from '../../Services/MessageService';
import { getCurrentToken, isUserAuthenticated } from '../../utils/authUtils';
import { useAppSelector } from '../../store/hooks';
import { useSignalR } from '../../hooks/useSignalR';

const { Text } = Typography;

interface ChatWindowProps {
    selectedUserId: number;
    selectedUserName: string;
    onClose: () => void;
}

interface MessageWithStatus extends MessageDto {
    status?: 'sending' | 'sent' | 'error';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUserId, selectedUserName, onClose }) => {
    const { user } = useAppSelector(state => state.auth);
    const [messages, setMessages] = useState<MessageWithStatus[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // SignalR连接
    const { sendMessage: sendSignalRMessage } = useSignalR({
        onReceiveMessage: (signalRMessage) => {
            // 只在初始化后处理消息，避免页面刷新时的混乱
            if (!isInitialized) {
                return;
            }

            // 只处理来自其他用户的消息，且不是自己发送的消息
            if (signalRMessage.senderId === selectedUserId && signalRMessage.senderId !== user?.id) {
                console.log('Received SignalR message:', signalRMessage.content);

                // 检查是否已经存在相同的消息（避免重复）
                setMessages(prev => {
                    const messageExists = prev.some(msg =>
                        msg.content === signalRMessage.content &&
                        msg.senderId === signalRMessage.senderId &&
                        Math.abs(new Date(msg.createdAt).getTime() - new Date().getTime()) < 5000 // 5秒内的消息
                    );

                    if (messageExists) {
                        console.log('Duplicate message detected, skipping:', signalRMessage.content);
                        return prev;
                    }

                    console.log('Adding new message from SignalR:', signalRMessage.content);
                    const newMessage: MessageDto = {
                        id: Date.now(), // 临时ID
                        senderId: signalRMessage.senderId,
                        receiverId: signalRMessage.receiverId,
                        senderName: selectedUserName,
                        receiverName: user?.username || '',
                        content: signalRMessage.content,
                        createdAt: new Date().toISOString(),
                        isRead: false
                    };
                    return [...prev, newMessage]; // 添加到末尾，新消息在底部
                });
            }
        },
        onError: (error) => {
            console.error('SignalR error:', error);
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // 只有在有新消息时才滚动到底部
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (selectedUserId) {
            setIsInitialized(false);
            setMessages([]);
            loadMessages();
        }

        return () => {
            // 组件卸载时清理状态
            setIsInitialized(false);
        };
    }, [selectedUserId]);

    const loadMessages = async () => {
        if (!isUserAuthenticated()) {
            message.error('Please login to view messages');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token');
            return;
        }

        try {
            setLoading(true);
            const conversationMessages = await getConversation(validToken, selectedUserId);
            // 按时间排序，最新的消息在底部
            const sortedMessages = conversationMessages.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setMessages(sortedMessages);
            setIsInitialized(true);

            // 标记未读消息为已读
            const unreadMessages = conversationMessages.filter(
                msg => !msg.isRead && msg.senderId === selectedUserId
            );

            for (const msg of unreadMessages) {
                try {
                    await markAsRead(validToken, msg.id);
                } catch (error) {
                    console.error('Failed to mark message as read:', error);
                }
            }
        } catch (error: any) {
            console.error('Failed to load messages:', error);
            message.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        if (!isUserAuthenticated()) {
            message.error('Please login to send messages');
            return;
        }

        const validToken = getCurrentToken();
        if (!validToken) {
            message.error('Invalid authentication token');
            return;
        }

        const messageContent = newMessage.trim();
        setNewMessage(''); // 立即清空输入框

        // 创建临时消息用于UI显示
        const tempMessage: MessageWithStatus = {
            id: Date.now(),
            senderId: user?.id || 0,
            receiverId: selectedUserId,
            senderName: user?.username || '',
            receiverName: selectedUserName,
            content: messageContent,
            createdAt: new Date().toISOString(),
            isRead: false,
            status: 'sending'
        };

        // 立即添加到消息列表（新消息在底部）
        setMessages(prev => [...prev, tempMessage]);

        try {
            setSending(true);
            console.log('Sending message via API:', messageContent);

            // 只通过API保存到数据库，后端会自动通过SignalR广播
            const sentMessage = await sendMessage(validToken, {
                receiverId: selectedUserId,
                content: messageContent
            });

            console.log('Message sent successfully via API:', sentMessage);

            // 更新消息列表，用真实消息替换临时消息
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? { ...sentMessage, status: 'sent' } : msg
            ));

        } catch (error: any) {
            console.error('Failed to send message:', error);
            message.error(error.message || 'Failed to send message');

            // 发送失败时恢复输入框内容
            setNewMessage(messageContent);

            // 标记临时消息为错误状态
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? { ...msg, status: 'error' } : msg
            ));
        } finally {
            setSending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        // 自动调整输入框高度
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isOwnMessage = (message: MessageDto) => {
        return message.senderId === user?.id;
    };

    return (
        <div className="chat-window-container">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-header-user">
                    <Avatar
                        icon={<UserOutlined />}
                        className="chat-header-avatar"
                    />
                    <div className="chat-header-info">
                        <Text strong className="chat-header-name">
                            {selectedUserName}
                        </Text>
                        <Text className="chat-header-status">
                            Online
                        </Text>
                    </div>
                </div>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onClose}
                    className="chat-header-back-btn"
                />
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--text-color-secondary)'
                    }}>
                        <div style={{ marginBottom: '12px' }}>
                            <LoadingOutlined style={{ fontSize: '24px' }} />
                        </div>
                        <Text>Loading messages...</Text>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: isOwnMessage(msg) ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}
                            >
                                <div
                                    className={`message-bubble ${isOwnMessage(msg) ? 'message-own' : 'message-other'}`}
                                >
                                    <div style={{
                                        fontSize: '14px',
                                        lineHeight: '1.4',
                                        marginBottom: '4px'
                                    }}>
                                        {msg.content}
                                    </div>
                                    <div className="message-time">
                                        {formatTime(msg.createdAt)}
                                        {isOwnMessage(msg) && (
                                            <span style={{ fontSize: '10px' }}>
                                                {msg.status === 'sending' && <LoadingOutlined />}
                                                {msg.status === 'sent' && <CheckOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />}
                                                {msg.status === 'error' && <span style={{ color: '#ff4d4f' }}>!</span>}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <Input.TextArea
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        className="chat-input"
                        disabled={sending}
                        onPressEnter={(e) => {
                            if (!e.shiftKey && !sending) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        style={{
                            padding: '8px 0',
                            lineHeight: '1.4',
                            fontSize: '14px',
                            minHeight: '24px',
                            maxHeight: '120px',
                            overflowY: 'auto'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        loading={sending}
                        disabled={!newMessage.trim()}
                        className="chat-send-button"
                        title="Send message (Enter)"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow; 