import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Empty, Button, Space, Badge, Avatar, List } from 'antd';
import { MessageOutlined, ArrowLeftOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const { Title, Text } = Typography;

// 移动端检测hook
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const ChatPage: React.FC = () => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // 从URL参数获取选中的用户ID
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');
        const userName = params.get('userName');

        if (userId && userName) {
            setSelectedUserId(parseInt(userId));
            setSelectedUserName(userName);
            setShowMobileChat(true);
        }
    }, [location.search]);

    const handleSelectConversation = (userId: number, userName: string) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setShowMobileChat(true);

        // 更新URL参数
        navigate(`/dashboard/chat?userId=${userId}&userName=${encodeURIComponent(userName)}`, { replace: true });
    };

    const handleBackToConversations = () => {
        setSelectedUserId(null);
        setSelectedUserName('');
        setShowMobileChat(false);
        navigate('/dashboard/chat', { replace: true });
    };

    // 移动端添加更好的手势支持
    useEffect(() => {
        if (isMobile) {
            // 禁用页面缩放
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
            }
        }
    }, [isMobile]);

    return (
        <div className={`dashboard-chat-container ${isMobile ? 'mobile' : 'desktop'}`}>
            {/* Desktop Layout */}
            <div className="chat-desktop-layout">
                {/* Conversations Panel */}
                <div className="chat-conversations-panel">
                    <div className="chat-panel-header">
                        <div className="chat-panel-title">
                            <MessageOutlined className="chat-panel-icon" />
                            <Title level={4} className="chat-panel-title-text">
                                Messages
                            </Title>
                        </div>
                    </div>

                    <div className="chat-conversations-content">
                        <ConversationList
                            onSelectConversation={handleSelectConversation}
                            selectedUserId={selectedUserId || undefined}
                        />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {selectedUserId ? (
                        <ChatWindow
                            selectedUserId={selectedUserId}
                            selectedUserName={selectedUserName}
                            onClose={handleBackToConversations}
                        />
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--background-color)'
                        }}>
                            <div style={{
                                textAlign: 'center',
                                maxWidth: '400px',
                                padding: '40px'
                            }}>
                                <div style={{
                                    fontSize: '64px',
                                    color: 'var(--text-color-secondary)',
                                    marginBottom: '20px'
                                }}>
                                    💬
                                </div>
                                <Title level={4} style={{
                                    fontSize: '24px',
                                    marginBottom: '12px',
                                    color: 'var(--text-color)'
                                }}>
                                    Welcome to Messages
                                </Title>
                                <Text style={{
                                    fontSize: '16px',
                                    color: 'var(--text-color-secondary)',
                                    lineHeight: 1.5
                                }}>
                                    Select a conversation to start chatting with your friends,
                                    or start a new chat from your friends list.
                                </Text>
                                <div style={{ marginTop: '24px' }}>
                                    <Button
                                        type="primary"
                                        icon={<UserOutlined />}
                                        onClick={() => navigate('/dashboard/friends')}
                                        size={isMobile ? 'large' : 'middle'}
                                    >
                                        Go to Friends
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className={`chat-mobile-layout ${showMobileChat ? 'active' : ''}`}>
                {selectedUserId ? (
                    <ChatWindow
                        selectedUserId={selectedUserId}
                        selectedUserName={selectedUserName}
                        onClose={handleBackToConversations}
                    />
                ) : (
                    <div className="chat-mobile-conversations">
                        <div className="chat-mobile-header">
                            <Title level={4} className="chat-mobile-title">
                                Messages
                            </Title>
                        </div>
                        <ConversationList
                            onSelectConversation={handleSelectConversation}
                            selectedUserId={selectedUserId || undefined}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage; 