import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions } from 'antd';
import { AuthResponse } from '../../Services/UserService';

interface UserSettingsPanelProps {
    auth: AuthResponse;
}

const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({ auth }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { currentPassword: string; newPassword: string }) => {
        setLoading(true);
        try {
            // TODO: Implement password change API call
            message.success('Password changed successfully');
        } catch (err: any) {
            message.error(err?.response?.data?.message || 'Password change failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <Card title="User Information" style={{ marginBottom: 24 }}>
                <Descriptions column={1}>
                    <Descriptions.Item label="Username">{auth.user.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">{auth.user.email}</Descriptions.Item>
                    <Descriptions.Item label="Full Name">{auth.user.firstName} {auth.user.lastName}</Descriptions.Item>
                    <Descriptions.Item label="Role">{auth.user.role}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Change Password">
                <Form name="changePassword" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true, message: 'Please enter current password' }]}
                    >
                        <Input.Password placeholder="Current Password" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please enter new password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password placeholder="New Password" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm New Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UserSettingsPanel; 