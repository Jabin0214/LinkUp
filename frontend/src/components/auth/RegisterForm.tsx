import React, { useState } from 'react';
import { Button, Form, Input, message, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { register, RegisterRequest, AuthResponse } from '../../Services/UserService';

interface RegisterFormProps {
    onRegisterSuccess: (auth: AuthResponse) => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: RegisterRequest) => {
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
                width: 450,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#333', marginBottom: 8 }}>Create Account</h2>
                <p style={{ color: '#666' }}>Join us today</p>
            </div>

            <Form name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
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
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                >
                    <Input
                        prefix={<IdcardOutlined />}
                        placeholder="First Name"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                >
                    <Input
                        prefix={<IdcardOutlined />}
                        placeholder="Last Name"
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

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{ required: true, message: 'Please confirm password' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm Password"
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
                        Create Account
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Button type="link" onClick={onSwitchToLogin}>
                        Already have an account? Sign in
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RegisterForm; 