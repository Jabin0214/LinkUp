import React from 'react';
import { Avatar, Typography, Space, Tooltip } from 'antd';
import { UserOutlined, FileOutlined, PictureOutlined, VideoCameraOutlined, AudioOutlined } from '@ant-design/icons';
import { MessageDto } from '../../Services/MessageService';

const { Text } = Typography;

interface MessageItemProps {
    message: MessageDto;
    isOwnMessage: boolean;
    showAvatar?: boolean;
    showTime?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    isOwnMessage,
    showAvatar = true,
    showTime = true
}) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getMessageType = (content: string) => {
        if (content.includes('[File:') && content.includes(']')) {
            const fileName = content.match(/\[File: (.+?)\]/)?.[1];
            if (fileName) {
                const extension = fileName.split('.').pop()?.toLowerCase();
                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
                    return 'image';
                } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
                    return 'video';
                } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
                    return 'audio';
                } else {
                    return 'file';
                }
            }
        }
        return 'text';
    };

    const messageType = getMessageType(message.content);
    const fileName = message.content.match(/\[File: (.+?)\]/)?.[1];

    const renderMessageContent = () => {
        switch (messageType) {
            case 'image':
                return (
                    <div className="message-file">
                        <PictureOutlined className="message-file-icon" />
                        <Text className="message-file-name">{fileName}</Text>
                    </div>
                );
            case 'video':
                return (
                    <div className="message-file">
                        <VideoCameraOutlined className="message-file-icon" />
                        <Text className="message-file-name">{fileName}</Text>
                    </div>
                );
            case 'audio':
                return (
                    <div className="message-file">
                        <AudioOutlined className="message-file-icon" />
                        <Text className="message-file-name">{fileName}</Text>
                    </div>
                );
            case 'file':
                return (
                    <div className="message-file">
                        <FileOutlined className="message-file-icon" />
                        <Text className="message-file-name">{fileName}</Text>
                    </div>
                );
            default:
                return (
                    <div className="message-text">
                        {message.content}
                    </div>
                );
        }
    };

    return (
        <div className={`message-item ${isOwnMessage ? 'message-own' : 'message-other'}`}>
            {showAvatar && !isOwnMessage && (
                <Avatar
                    icon={<UserOutlined />}
                    size={32}
                    className="message-avatar"
                />
            )}

            <div className="message-content">
                <div className={`message-bubble ${isOwnMessage ? 'message-own' : 'message-other'}`}>
                    {renderMessageContent()}

                    {showTime && (
                        <div className="message-time">
                            {formatTime(message.createdAt)}
                        </div>
                    )}
                </div>
            </div>

            {showAvatar && isOwnMessage && (
                <Avatar
                    icon={<UserOutlined />}
                    size={32}
                    className="message-avatar"
                />
            )}
        </div>
    );
};

export default MessageItem; 