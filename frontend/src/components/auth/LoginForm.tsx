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
            message.success('Login successful');
        } catch (err: any) {
            message.error(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: 400,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#333', marginBottom: 8 }}>Welcome Back</h2>
                <p style={{ color: '#666' }}>Sign in to your account</p>
            </div>

            <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        size="large"
                        style={{ height: 48, borderRadius: 8 }}
                    >
                        Sign In
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Button type="link" onClick={onSwitchToRegister}>
                        Don't have an account? Sign up
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginForm; 