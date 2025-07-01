import React from 'react';
import { Button, Form, Input, message, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons';
import { RegisterRequest } from '../../Services/UserService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/authSlice';
import DebounceSelect from '../common/DebounceSelect';
import { searchUniversities, University } from '../../Services/UniversityService';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const onFinish = async (values: any) => {
        if (values.password !== values.confirmPassword) {
            message.error('Password and confirm password do not match');
            return;
        }

        // 处理university字段，如果是对象则取value
        const universityValue = typeof values.university === 'object'
            ? values.university.value
            : values.university;

        const registerData: RegisterRequest = {
            ...values,
            university: universityValue
        };

        try {
            const result = await dispatch(registerUser(registerData)).unwrap();
            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            onRegisterSuccess();
            message.success('Registration successful! 🎉 Welcome to LinkUp!');
        } catch (err: any) {
            message.error(err || 'Registration failed');
        }
    };

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: '450px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-2)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'var(--component-background)',
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
                    color: 'var(--text-color)',
                    marginBottom: 8,
                    fontSize: '1.75rem',
                    fontWeight: 600
                }}>
                    Create Account
                </h2>
                <p style={{
                    color: 'var(--text-color-secondary)',
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
                        prefix={<UserOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                        prefix={<MailOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                                prefix={<IdcardOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                                prefix={<IdcardOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                    name="university"
                    label={<span style={{ fontSize: '14px', fontWeight: 500 }}>University</span>}
                    rules={[
                        { required: true, message: 'Please select your university' }
                    ]}
                    style={{ marginBottom: 20 }}
                >
                    <DebounceSelect<University>
                        placeholder="Search and select your university..."
                        fetchOptions={searchUniversities}
                        size="large"
                        style={{
                            width: '100%',
                            borderRadius: 8,
                        }}
                        suffixIcon={<BankOutlined style={{ color: 'var(--text-color-disabled)' }} />}
                        debounceTimeout={300}
                    />
                </Form.Item>

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
                        prefix={<LockOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                        prefix={<LockOutlined style={{ color: 'var(--text-color-disabled)' }} />}
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
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-active) 100%)',
                            border: 'none',
                            boxShadow: 'var(--shadow-2)'
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
                            color: 'var(--primary-color)',
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