import React, { memo } from 'react';
import { Modal, Input, Typography } from 'antd';

const { Text } = Typography;
const { TextArea } = Input;

interface JoinProjectModalProps {
    open: boolean;
    loading: boolean;
    joinMessage: string;
    onOk: () => void;
    onCancel: () => void;
    onMessageChange: (value: string) => void;
}

const JoinProjectModal: React.FC<JoinProjectModalProps> = memo(({
    open,
    loading,
    joinMessage,
    onOk,
    onCancel,
    onMessageChange
}) => {
    return (
        <Modal
            title="Join Project"
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            confirmLoading={loading}
        >
            <div style={{ marginBottom: '16px' }}>
                <Text>Send a message to the project creator:</Text>
            </div>
            <TextArea
                rows={4}
                placeholder="Introduce yourself and explain why you want to join this project..."
                value={joinMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                }}
            />
        </Modal>
    );
});

JoinProjectModal.displayName = 'JoinProjectModal';

export default JoinProjectModal; 