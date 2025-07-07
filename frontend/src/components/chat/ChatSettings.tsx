import React, { useState } from 'react';
import { Card, Typography, Switch, Slider, Space, Button, Divider, List, Checkbox } from 'antd';
import {
    BellOutlined,
    SoundOutlined,
    EyeOutlined,
    LockOutlined,
    DeleteOutlined,
    BlockOutlined,
    StarOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ChatSettingsProps {
    onClose: () => void;
    onBlockUser?: () => void;
    onDeleteChat?: () => void;
    onStarChat?: () => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
    onClose,
    onBlockUser,
    onDeleteChat,
    onStarChat
}) => {
    const [notifications, setNotifications] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [soundVolume, setSoundVolume] = useState(70);

    const settingsItems = [
        {
            key: 'notifications',
            icon: <BellOutlined />,
            title: 'Message Notifications',
            description: 'Receive notifications for new messages',
            action: (
                <Switch
                    checked={notifications}
                    onChange={setNotifications}
                    size="small"
                />
            )
        },
        {
            key: 'sound',
            icon: <SoundOutlined />,
            title: 'Sound Alerts',
            description: 'Play sound for new messages',
            action: (
                <Switch
                    checked={soundEnabled}
                    onChange={setSoundEnabled}
                    size="small"
                />
            )
        },
        {
            key: 'readReceipts',
            icon: <EyeOutlined />,
            title: 'Read Receipts',
            description: 'Show when messages are read',
            action: (
                <Switch
                    checked={readReceipts}
                    onChange={setReadReceipts}
                    size="small"
                />
            )
        }
    ];

    const actionItems = [
        {
            key: 'star',
            icon: <StarOutlined />,
            title: 'Star Conversation',
            description: 'Pin this conversation to the top',
            action: (
                <Button
                    type="text"
                    size="small"
                    onClick={onStarChat}
                >
                    Star
                </Button>
            )
        },
        {
            key: 'block',
            icon: <BlockOutlined />,
            title: 'Block User',
            description: 'Block this user from contacting you',
            action: (
                <Button
                    type="text"
                    size="small"
                    danger
                    onClick={onBlockUser}
                >
                    Block
                </Button>
            )
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            title: 'Delete Chat',
            description: 'Permanently delete this conversation',
            action: (
                <Button
                    type="text"
                    size="small"
                    danger
                    onClick={onDeleteChat}
                >
                    Delete
                </Button>
            )
        }
    ];

    return (
        <Card className="chat-settings-card" size="small">
            <div className="chat-settings-header">
                <Title level={5} className="chat-settings-title">
                    Chat Settings
                </Title>
                <Button
                    type="text"
                    size="small"
                    onClick={onClose}
                >
                    ×
                </Button>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* Sound Volume */}
            {soundEnabled && (
                <div className="chat-settings-section">
                    <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        Sound Volume
                    </Text>
                    <Slider
                        value={soundVolume}
                        onChange={setSoundVolume}
                        min={0}
                        max={100}
                        style={{ marginBottom: '16px' }}
                    />
                </div>
            )}

            {/* Settings List */}
            <div className="chat-settings-section">
                <Text strong style={{ fontSize: '14px', marginBottom: '12px', display: 'block' }}>
                    Preferences
                </Text>
                <List
                    size="small"
                    dataSource={settingsItems}
                    renderItem={(item) => (
                        <List.Item className="chat-settings-item">
                            <List.Item.Meta
                                avatar={item.icon}
                                title={item.title}
                                description={item.description}
                            />
                            {item.action}
                        </List.Item>
                    )}
                />
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Actions */}
            <div className="chat-settings-section">
                <Text strong style={{ fontSize: '14px', marginBottom: '12px', display: 'block' }}>
                    Actions
                </Text>
                <List
                    size="small"
                    dataSource={actionItems}
                    renderItem={(item) => (
                        <List.Item className="chat-settings-item">
                            <List.Item.Meta
                                avatar={item.icon}
                                title={item.title}
                                description={item.description}
                            />
                            {item.action}
                        </List.Item>
                    )}
                />
            </div>
        </Card>
    );
};

export default ChatSettings; 