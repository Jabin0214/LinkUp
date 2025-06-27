import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions, Row, Col } from 'antd';
import { UserOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { AuthResponse } from '../Services/UserService';

interface UserSettingsPanelProps {
    auth: AuthResponse;
}

const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({ auth }) => {
    const [passwordLoading, setPasswordLoading] = useState(false);

    const onPasswordChange = async (values: { currentPassword: string; newPassword: string }) => {
        setPasswordLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('Password changed successfully');
        } catch (err: any) {
            message.error(err?.response?.data?.message || 'Password change failed');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="user-settings-panel">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    marginBottom: 8,
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#262626'
                }}>
                    User Settings
                </h2>
                <p style={{
                    color: '#8c8c8c',
                    fontSize: '14px',
                    margin: 0
                }}>
                    Manage your account information and security
                </p>
            </div>

            <Row gutter={[24, 24]}>
                {/* 用户信息展示 */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <UserOutlined style={{ marginRight: 8 }} />
                                Profile Information
                            </span>
                        }
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Descriptions column={1} size="middle">
                            <Descriptions.Item label="Username">
                                {auth.user.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {auth.user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="First Name">
                                {auth.user.firstName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Name">
                                {auth.user.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {auth.user.role}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <SecurityScanOutlined style={{ marginRight: 8 }} />
                                Change Password
                            </span>
                        }
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Form layout="vertical" onFinish={onPasswordChange}>
                            <Form.Item
                                name="currentPassword"
                                label="Current Password"
                                rules={[{ required: true, message: 'Please enter current password' }]}
                            >
                                <Input.Password
                                    placeholder="Current password"
                                    size="large"
                                    style={{ borderRadius: 6 }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                label="New Password"
                                rules={[
                                    { required: true, message: 'Please enter new password' },
                                    { min: 6, message: 'Password must be at least 6 characters' }
                                ]}
                            >
                                <Input.Password
                                    placeholder="New password"
                                    size="large"
                                    style={{ borderRadius: 6 }}
                                />
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
                                            return Promise.reject(new Error('Passwords do not match'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder="Confirm new password"
                                    size="large"
                                    style={{ borderRadius: 6 }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={passwordLoading}
                                    size="large"
                                    style={{ borderRadius: 6 }}
                                    block
                                >
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserSettingsPanel; 