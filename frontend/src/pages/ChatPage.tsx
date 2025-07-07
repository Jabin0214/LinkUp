import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Empty, Button, Space, Badge, Avatar, List } from 'antd';
import { MessageOutlined, ArrowLeftOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    return (
        <div className="dashboard-chat-container">
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
                        <div className="chat-welcome-screen">
                            <div className="chat-welcome-content">
                                <div className="chat-welcome-icon">
                                    💬
                                </div>
                                <Title level={4} className="chat-welcome-title">
                                    Welcome to Messages
                                </Title>
                                <Text className="chat-welcome-text">
                                    Select a conversation to start chatting with your friends,
                                    or start a new chat from your friends list.
                                </Text>
                                <div className="chat-welcome-actions">
                                    <Button
                                        type="primary"
                                        icon={<UserOutlined />}
                                        onClick={() => navigate('/dashboard/friends')}
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