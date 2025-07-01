import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions, Row, Col } from 'antd';
import { UserOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';
import { changePassword, ChangePasswordRequest } from '../../Services/UserService';

const UserSettingsPanel: React.FC = () => {
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [form] = Form.useForm();

    const onPasswordChange = async (values: { currentPassword: string; newPassword: string }) => {
        if (!token) {
            message.error('Authentication required');
            return;
        }

        setPasswordLoading(true);
        try {
            const changePasswordData: ChangePasswordRequest = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            };

            await changePassword(changePasswordData, token);
            message.success('Password changed successfully');
            form.resetFields(); // 清空表单
        } catch (err: any) {
            // 处理不同的错误类型
            const errorMessage = err?.response?.data?.message || 'Password change failed';
            message.error(errorMessage);
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
                    color: 'var(--text-color)'
                }}>
                    User Settings
                </h2>
                <p style={{
                    color: 'var(--text-color-secondary)',
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
                            boxShadow: 'var(--shadow-1)'
                        }}
                    >
                        <Descriptions column={1} size="middle">
                            <Descriptions.Item label="Username">
                                {user?.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {user?.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="First Name">
                                {user?.firstName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Name">
                                {user?.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="university">
                                {user?.university}
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
                            boxShadow: 'var(--shadow-1)'
                        }}
                    >
                        <Form form={form} layout="vertical" onFinish={onPasswordChange}>
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