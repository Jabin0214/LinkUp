import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { SendOutlined, ArrowLeftOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { MessageDto, sendMessage, getConversation, markAsRead } from '../../Services/MessageService';
import { getCurrentToken, isUserAuthenticated } from '../../utils/authUtils';
import { useAppSelector } from '../../store/hooks';
import { useSignalR } from '../../hooks/useSignalR';

const { Text } = Typography;

// 常量配置
const CHAT_CONFIG = {
    DUPLICATE_CHECK_WINDOW: 5000, // 5秒内重复消息检查
    SCROLL_DELAY: 100,             // 滚动延迟
    INPUT_MAX_HEIGHT: 120,         // 输入框最大高度
    MESSAGE_TIME_FORMAT: { hour: '2-digit' as const, minute: '2-digit' as const },
} as const;

interface ChatWindowProps {
    selectedUserId: number;
    selectedUserName: string;
    onClose: () => void;
}

interface MessageWithStatus extends MessageDto {
    status?: 'sending' | 'sent' | 'error';
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    selectedUserId,
    selectedUserName,
    onClose
}) => {
    const { user } = useAppSelector(state => state.auth);
    const [messages, setMessages] = useState<MessageWithStatus[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 检查身份验证
    const checkAuthentication = useCallback(() => {
        if (!isUserAuthenticated()) {
            message.error('Please login to send messages');
            return null;
        }
        const token = getCurrentToken();
        if (!token) {
            message.error('Invalid authentication token');
            return null;
        }
        return token;
    }, []);

    // 优化的滚动函数
    const scrollToBottom = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
        }, CHAT_CONFIG.SCROLL_DELAY);
    }, []);

    // 清理计时器
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // 消息重复检查
    const isDuplicateMessage = useCallback((newMsg: any, existingMessages: MessageWithStatus[]) => {
        return existingMessages.some(msg =>
            msg.content === newMsg.content &&
            msg.senderId === newMsg.senderId &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date().getTime()) < CHAT_CONFIG.DUPLICATE_CHECK_WINDOW
        );
    }, []);

    // SignalR连接
    const {
        connection,
        sendMessage: sendSignalRMessage,  // eslint-disable-line @typescript-eslint/no-unused-vars
        markAsRead: markMessageAsRead
    } = useSignalR({
        onReceiveMessage: useCallback((signalRMessage: any) => {
            // 只在初始化后处理消息，避免页面刷新时的混乱
            if (!isInitialized) {
                return;
            }

            // 只处理来自当前对话用户的消息，避免处理自己发送的消息（因为已经在发送时添加了）
            if (signalRMessage.senderId === selectedUserId && signalRMessage.senderId !== user?.id) {
                setMessages(prev => {
                    // 检查是否已经存在相同的消息（避免重复）
                    if (isDuplicateMessage(signalRMessage, prev)) {
                        return prev;
                    }
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
        }, [isInitialized, selectedUserId, user?.id, selectedUserName, user?.username, isDuplicateMessage]),
        onError: useCallback((error: string) => {
            console.error('SignalR error:', error);
        }, [])
    });

    // 消息变化时自动滚动
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // 加载消息历史
    const loadMessages = useCallback(async () => {
        if (!selectedUserId) return;

        const token = checkAuthentication();
        if (!token) return;

        setLoading(true);
        try {
            const response = await getConversation(token, selectedUserId);
            setMessages(response || []);
            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to load messages:', error);
            message.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [selectedUserId, checkAuthentication]);

    // 用户切换时重置状态并加载消息
    useEffect(() => {
        if (selectedUserId) {
            setIsInitialized(false);
            setMessages([]);
            loadMessages();
        }
        return () => {
            setIsInitialized(false);
        };
    }, [selectedUserId, loadMessages]);

    // 初始化完成后滚动到底部
    useEffect(() => {
        if (isInitialized && messages.length > 0) {
            scrollToBottom();
        }
    }, [isInitialized, messages, scrollToBottom]);

    // 处理消息发送
    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || sending) return;

        const token = checkAuthentication();
        if (!token) return;

        const messageContent = newMessage.trim();
        setNewMessage('');

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

        setMessages(prev => [...prev, tempMessage]);

        try {
            setSending(true);
            await sendMessage(token, { receiverId: selectedUserId, content: messageContent });
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? { ...msg, status: 'sent' } : msg
            ));
        } catch (error: any) {
            console.error('Failed to send message:', error);
            message.error(error.message || 'Failed to send message');
            setNewMessage(messageContent);
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? { ...msg, status: 'error' } : msg
            ));
        } finally {
            setSending(false);
        }
    }, [newMessage, sending, checkAuthentication, selectedUserId, selectedUserName, user]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        // 自动调整输入框高度
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, CHAT_CONFIG.INPUT_MAX_HEIGHT) + 'px';
    }, []);

    const formatTime = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], CHAT_CONFIG.MESSAGE_TIME_FORMAT);
    }, []);

    const isOwnMessage = useCallback((message: MessageDto) => {
        return message.senderId === user?.id;
    }, [user?.id]);

    // 键盘事件处理
    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!e.shiftKey && !sending && e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    }, [sending, handleSendMessage]);

    // Memoized 组件部分
    const renderLoadingSection = () => (
        <div style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--text-color-secondary)'
        }}>
            <LoadingOutlined style={{ fontSize: 24, marginBottom: 16 }} />
            <div>Loading messages...</div>
        </div>
    );

    const renderMessagesSection = () => (
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
    );

    return (
        <div className="chat-window-container">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-header-user">
                    <div className="chat-header-info">
                        <Text strong className="chat-header-name" style={{ color: 'var(--text-color)' }}>
                            {selectedUserName}
                        </Text>
                    </div>
                </div>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onClose}
                    className="chat-header-back-btn"
                    style={{ color: 'var(--text-color)' }}
                />
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
                {loading ? renderLoadingSection() : renderMessagesSection()}
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
                        onKeyDown={handleKeyPress}
                        style={{
                            padding: '8px 0',
                            lineHeight: '1.4',
                            fontSize: '14px',
                            minHeight: '24px',
                            maxHeight: `${CHAT_CONFIG.INPUT_MAX_HEIGHT}px`,
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