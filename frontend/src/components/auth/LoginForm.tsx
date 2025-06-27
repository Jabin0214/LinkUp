import React, { useState } from 'react';
import { Button, Form, Input, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, LoginRequest, AuthResponse } from '../../Services/UserService';

interface LoginFormProps {
    onLoginSuccess: (auth: AuthResponse) => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const auth = await login(values);
            localStorage.setItem('token', auth.token);
            localStorage.setItem('refreshToken', auth.refreshToken);
            onLoginSuccess(auth);
            message.success('login successfully');
        } catch (err: any) {
            message.error(err?.response?.data?.message || 'login failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: '400px',
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
                    Welcome Back
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '14px',
                    margin: 0
                }}>
                    Login to your account
                </p>
            </div>

            <Form
                name="login"
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
                        { required: true, message: 'Please enter your username' },
                        { min: 3, message: 'Username must be at least 3 characters' }
                    ]}
                    style={{ marginBottom: 20 }}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Username"
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
                    name="password"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Password</span>}
                    rules={[
                        { required: true, message: 'Please enter your password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                    style={{ marginBottom: 24 }}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Password"
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
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Button
                        type="link"
                        onClick={onSwitchToRegister}
                        style={{
                            color: '#667eea',
                            fontWeight: 500,
                            padding: 0,
                            height: 'auto'
                        }}
                    >
                        Don't have an account? Register now
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginForm; 