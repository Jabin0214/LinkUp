import React from 'react';
import { Button, Form, Input, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginRequest } from '../../Services/UserService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';

interface LoginFormProps {
    onLoginSuccess: () => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const onFinish = async (values: LoginRequest) => {
        try {
            const result = await dispatch(loginUser(values)).unwrap();
            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            onLoginSuccess();
            message.success('Login successful! 🎉 Welcome back!');
        } catch (err: any) {
            message.error(err || 'Login failed');
        }
    };

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-2)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'var(--component-background)',
                position: 'relative',
                zIndex: 1,
                color: 'var(--text-color)'
            }}
        >
            <div style={{
                textAlign: 'center',
                marginBottom: 32,
                padding: '0 8px'
            }}>
                <h2 style={{
                    color: 'var(--text-color)',
                    marginBottom: 8,
                    fontSize: '1.75rem',
                    fontWeight: 600
                }}>
                    Welcome Back
                </h2>
                <p style={{
                    color: 'var(--text-color-secondary)',
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
                        prefix={<UserOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                        prefix={<LockOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-active) 100%)',
                            border: 'none',
                            boxShadow: 'var(--shadow-2)',
                            color: '#ffffff'
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
                            color: 'var(--primary-color)',
                            fontWeight: 500,
                            padding: 0,
                            height: 'auto',
                            border: 'none',
                            boxShadow: 'none'
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