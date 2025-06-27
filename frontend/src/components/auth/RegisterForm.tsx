import React, { useState } from 'react';
import { Button, Form, Input, message, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { register, RegisterRequest, AuthResponse } from '../../Services/UserService';

interface RegisterFormProps {
    onRegisterSuccess: (auth: AuthResponse) => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: RegisterRequest) => {
        if (values.password !== values.confirmPassword) {
            message.error('Password and confirm password do not match');
            return;
        }

        setLoading(true);
        try {
            const auth = await register(values);
            localStorage.setItem('token', auth.token);
            localStorage.setItem('refreshToken', auth.refreshToken);
            onRegisterSuccess(auth);
            message.success('Registration successful');
        } catch (err: any) {
            message.error(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: '450px',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                position: 'relative',
                zIndex: 1
            }}
        >
            <div style={{
                textAlign: 'center',
                marginBottom: 32,
                padding: '0 8px'
            }}>
                <h2 style={{
                    color: '#333',
                    marginBottom: 8,
                    fontSize: '1.75rem',
                    fontWeight: 600
                }}>
                    Create Account
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '14px',
                    margin: 0
                }}>
                    Join us to begin your journey
                </p>
            </div>

            <Form
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                validateTrigger="onBlur"
            >
                <Form.Item
                    name="username"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Username</span>}
                    rules={[
                        { required: true, message: 'Please enter username' },
                        { min: 3, message: 'Username must be at least 3 characters' },
                        { max: 20, message: 'Username cannot exceed 20 characters' }
                    ]}
                    style={{ marginBottom: 20 }}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Please enter username"
                        size="large"
                        style={{
                            borderRadius: 8,
                            fontSize: '16px',
                            padding: '12px 16px',
                            height: '48px'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Email</span>}
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                    style={{ marginBottom: 20 }}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Please enter email"
                        size="large"
                        style={{
                            borderRadius: 8,
                            fontSize: '16px',
                            padding: '12px 16px',
                            height: '48px'
                        }}
                    />
                </Form.Item>

                <Row gutter={12}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="firstName"
                            label={<span style={{ fontSize: '14px', fontWeight: 500 }}>First Name</span>}
                            rules={[
                                { required: true, message: 'Please enter first name' },
                                { max: 10, message: 'First name cannot exceed 10 characters' }
                            ]}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Please enter first name"
                                size="large"
                                style={{
                                    borderRadius: 8,
                                    fontSize: '16px',
                                    padding: '12px 16px',
                                    height: '48px'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="lastName"
                            label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Last Name</span>}
                            rules={[
                                { required: true, message: 'Please enter last name' },
                                { max: 10, message: 'Last name cannot exceed 10 characters' }
                            ]}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Please enter last name"
                                size="large"
                                style={{
                                    borderRadius: 8,
                                    fontSize: '16px',
                                    padding: '12px 16px',
                                    height: '48px'
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="password"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Password</span>}
                    rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                        { max: 50, message: 'Password cannot exceed 50 characters' }
                    ]}
                    style={{ marginBottom: 20 }}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Please enter password"
                        size="large"
                        style={{
                            borderRadius: 8,
                            fontSize: '16px',
                            height: '48px'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Confirm Password</span>}
                    rules={[
                        { required: true, message: 'Please confirm password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                    style={{ marginBottom: 24 }}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Please confirm password"
                        size="large"
                        style={{
                            borderRadius: 8,
                            fontSize: '16px',
                            height: '48px'
                        }}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 20 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        size="large"
                        style={{
                            height: 48,
                            borderRadius: 8,
                            fontSize: '16px',
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Button
                        type="link"
                        onClick={onSwitchToLogin}
                        style={{
                            color: '#667eea',
                            fontWeight: 500,
                            padding: 0,
                            height: 'auto'
                        }}
                    >
                        Already have an account? Sign in
                    </Button>
                </Form.Item>
            </Form>

            {/* 移动端优化样式 */}
            <style>
                {`
                @media (max-width: 480px) {
                    .ant-card-body {
                        padding: 24px 16px 16px !important;
                    }
                    
                    .ant-form-item {
                        margin-bottom: 16px !important;
                    }
                    
                    .ant-input,
                    .ant-input-password {
                        font-size: 16px !important;
                    }
                    
                    .ant-col {
                        margin-bottom: 0 !important;
                    }
                }
                
                @media (max-width: 360px) {
                    .ant-card-body {
                        padding: 20px 12px 12px !important;
                    }
                    
                    .ant-row .ant-col {
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                    }
                }
            `}
            </style>
        </Card>
    );
};

export default RegisterForm; 