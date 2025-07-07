import React, { useState } from 'react';
import { Popover, Button, Space, Divider } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    disabled?: boolean;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, disabled = false }) => {
    const [visible, setVisible] = useState(false);

    const emojiCategories = [
        {
            name: 'Smileys',
            emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚']
        },
        {
            name: 'Gestures',
            emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👌']
        },
        {
            name: 'Hearts',
            emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️']
        },
        {
            name: 'Objects',
            emojis: ['💻', '📱', '📞', '📟', '📠', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰']
        }
    ];

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji);
        setVisible(false);
    };

    const emojiContent = (
        <div className="emoji-picker-content">
            {emojiCategories.map((category, index) => (
                <div key={category.name} className="emoji-category">
                    <div className="emoji-category-title">{category.name}</div>
                    <div className="emoji-grid">
                        {category.emojis.map((emoji, emojiIndex) => (
                            <button
                                key={`${category.name}-${emojiIndex}`}
                                className="emoji-button"
                                onClick={() => handleEmojiClick(emoji)}
                                type="button"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    {index < emojiCategories.length - 1 && <Divider style={{ margin: '8px 0' }} />}
                </div>
            ))}
        </div>
    );

    return (
        <Popover
            content={emojiContent}
            title="Emoji"
            trigger="click"
            visible={visible}
            onVisibleChange={setVisible}
            placement="topLeft"
            overlayClassName="emoji-picker-overlay"
        >
            <Button
                type="text"
                icon={<SmileOutlined />}
                disabled={disabled}
                className="emoji-picker-button"
                title="Add emoji"
            />
        </Popover>
    );
};

export default EmojiPicker; 