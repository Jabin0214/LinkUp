import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions, Switch, Select, Upload, Avatar, Divider, Row, Col, Radio, Tabs } from 'antd';
import { UserOutlined, UploadOutlined, SecurityScanOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { AuthResponse } from '../../Services/UserService';

const { Option } = Select;
const { TabPane } = Tabs;

interface UserSettingsPanelProps {
    auth: AuthResponse;
}

const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({ auth }) => {
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // 模拟用户设置状态
    const [userSettings, setUserSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        theme: 'light',
        autoSave: true,
        twoFactorAuth: false
    });

    const onPasswordChange = async (values: { currentPassword: string; newPassword: string }) => {
        setPasswordLoading(true);
        try {
            // TODO: 实现密码修改API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('密码修改成功');
        } catch (err: any) {
            message.error(err?.response?.data?.message || '密码修改失败');
        } finally {
            setPasswordLoading(false);
        }
    };

    const onProfileUpdate = async (values: any) => {
        setProfileLoading(true);
        try {
            // TODO: 实现个人信息更新API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('个人信息更新成功');
        } catch (err: any) {
            message.error(err?.response?.data?.message || '更新失败');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleSettingChange = (key: string, value: any) => {
        setUserSettings(prev => ({
            ...prev,
            [key]: value
        }));
        message.success('设置已保存');
    };

    const uploadProps = {
        name: 'avatar',
        action: '/api/upload/avatar',
        headers: {
            authorization: `Bearer ${auth.token}`,
        },
        onChange: (info: any) => {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 文件上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
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
                    用户设置
                </h2>
                <p style={{
                    color: '#8c8c8c',
                    fontSize: '14px',
                    margin: 0
                }}>
                    管理您的账户信息和偏好设置
                </p>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            个人资料
                        </span>
                    }
                    key="profile"
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={8}>
                            <Card
                                title="头像设置"
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                                bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
                            >
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    style={{
                                        marginBottom: 16,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ marginBottom: 4 }}>
                                        {auth.user.firstName} {auth.user.lastName}
                                    </h4>
                                    <p style={{ color: '#8c8c8c', margin: 0 }}>
                                        @{auth.user.username}
                                    </p>
                                </div>
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />} block>
                                        上传新头像
                                    </Button>
                                </Upload>
                            </Card>
                        </Col>

                        <Col xs={24} lg={16}>
                            <Card
                                title="基本信息"
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                            >
                                <Form
                                    layout="vertical"
                                    onFinish={onProfileUpdate}
                                    initialValues={{
                                        username: auth.user.username,
                                        email: auth.user.email,
                                        firstName: auth.user.firstName,
                                        lastName: auth.user.lastName,
                                        role: auth.user.role
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="firstName"
                                                label="姓"
                                                rules={[{ required: true, message: '请输入姓' }]}
                                            >
                                                <Input size="large" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="lastName"
                                                label="名"
                                                rules={[{ required: true, message: '请输入名' }]}
                                            >
                                                <Input size="large" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="username"
                                        label="用户名"
                                        rules={[{ required: true, message: '请输入用户名' }]}
                                    >
                                        <Input size="large" disabled />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="邮箱地址"
                                        rules={[
                                            { required: true, message: '请输入邮箱地址' },
                                            { type: 'email', message: '请输入有效的邮箱地址' }
                                        ]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        name="role"
                                        label="角色"
                                    >
                                        <Input size="large" disabled />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={profileLoading}
                                            size="large"
                                            style={{ borderRadius: 6 }}
                                        >
                                            更新个人信息
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <SecurityScanOutlined />
                            安全设置
                        </span>
                    }
                    key="security"
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={12}>
                            <Card
                                title="修改密码"
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                            >
                                <Form layout="vertical" onFinish={onPasswordChange}>
                                    <Form.Item
                                        name="currentPassword"
                                        label="当前密码"
                                        rules={[{ required: true, message: '请输入当前密码' }]}
                                    >
                                        <Input.Password placeholder="当前密码" size="large" />
                                    </Form.Item>
                                    <Form.Item
                                        name="newPassword"
                                        label="新密码"
                                        rules={[
                                            { required: true, message: '请输入新密码' },
                                            { min: 6, message: '密码至少6个字符' }
                                        ]}
                                    >
                                        <Input.Password placeholder="新密码" size="large" />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        label="确认新密码"
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: '请确认新密码' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="确认新密码" size="large" />
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
                                            修改密码
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title="安全选项"
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                            >
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <span style={{ fontWeight: 500 }}>两步验证</span>
                                        <Switch
                                            checked={userSettings.twoFactorAuth}
                                            onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                                        />
                                    </div>
                                    <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0 }}>
                                        增强账户安全性
                                    </p>
                                </div>

                                <Divider />

                                <div>
                                    <h4 style={{ marginBottom: 16 }}>登录活动</h4>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: 16,
                                        borderRadius: 6,
                                        marginBottom: 12
                                    }}>
                                        <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                            当前设备 (Chrome on macOS)
                                        </div>
                                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                            IP: 192.168.1.100 · 北京市 · 刚刚
                                        </div>
                                    </div>
                                    <Button type="link" style={{ padding: 0 }}>
                                        查看所有活动记录
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <BellOutlined />
                            通知设置
                        </span>
                    }
                    key="notifications"
                >
                    <Card
                        title="通知偏好"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <span style={{ fontWeight: 500 }}>邮件通知</span>
                                        <Switch
                                            checked={userSettings.emailNotifications}
                                            onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                                        />
                                    </div>
                                    <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0 }}>
                                        接收重要更新和通知邮件
                                    </p>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <span style={{ fontWeight: 500 }}>推送通知</span>
                                        <Switch
                                            checked={userSettings.pushNotifications}
                                            onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                                        />
                                    </div>
                                    <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0 }}>
                                        浏览器推送通知
                                    </p>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <span style={{ fontWeight: 500 }}>短信通知</span>
                                        <Switch
                                            checked={userSettings.smsNotifications}
                                            onChange={(checked) => handleSettingChange('smsNotifications', checked)}
                                        />
                                    </div>
                                    <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0 }}>
                                        紧急事项短信提醒
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <SettingOutlined />
                            偏好设置
                        </span>
                    }
                    key="preferences"
                >
                    <Card
                        title="应用偏好"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <div style={{ marginBottom: 24 }}>
                                    <h4 style={{ marginBottom: 12 }}>语言设置</h4>
                                    <Select
                                        value={userSettings.language}
                                        onChange={(value) => handleSettingChange('language', value)}
                                        style={{ width: '100%' }}
                                        size="large"
                                    >
                                        <Option value="zh-CN">中文（简体）</Option>
                                        <Option value="zh-TW">中文（繁體）</Option>
                                        <Option value="en-US">English</Option>
                                        <Option value="ja-JP">日本語</Option>
                                    </Select>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <h4 style={{ marginBottom: 12 }}>时区设置</h4>
                                    <Select
                                        value={userSettings.timezone}
                                        onChange={(value) => handleSettingChange('timezone', value)}
                                        style={{ width: '100%' }}
                                        size="large"
                                    >
                                        <Option value="Asia/Shanghai">北京时间 (UTC+8)</Option>
                                        <Option value="Asia/Tokyo">东京时间 (UTC+9)</Option>
                                        <Option value="America/New_York">纽约时间 (UTC-5)</Option>
                                        <Option value="Europe/London">伦敦时间 (UTC+0)</Option>
                                    </Select>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <h4 style={{ marginBottom: 12 }}>主题设置</h4>
                                    <Radio.Group
                                        value={userSettings.theme}
                                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Radio.Button value="light">浅色</Radio.Button>
                                        <Radio.Button value="dark">深色</Radio.Button>
                                        <Radio.Button value="auto">跟随系统</Radio.Button>
                                    </Radio.Group>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <span style={{ fontWeight: 500 }}>自动保存</span>
                                        <Switch
                                            checked={userSettings.autoSave}
                                            onChange={(checked) => handleSettingChange('autoSave', checked)}
                                        />
                                    </div>
                                    <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0 }}>
                                        自动保存编辑内容
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </TabPane>
            </Tabs>

            {/* 响应式样式 */}
            <style>
                {`
                .user-settings-panel {
                    width: 100%;
                    max-width: 1200px;
                }

                @media (max-width: 768px) {
                    .user-settings-panel h2 {
                        font-size: 20px !important;
                        text-align: center;
                    }
                    
                    .ant-tabs-tab {
                        padding: 8px 12px !important;
                        font-size: 14px !important;
                    }
                    
                    .ant-card-head-title {
                        font-size: 16px !important;
                    }
                }

                @media (max-width: 575.98px) {
                    .user-settings-panel {
                        margin: 0 -4px;
                    }
                    
                    .ant-col {
                        padding: 0 4px !important;
                        margin-bottom: 16px;
                    }
                    
                    .ant-card {
                        margin-bottom: 16px;
                        border-radius: 6px !important;
                    }
                    
                    .ant-card-body {
                        padding: 16px !important;
                    }
                    
                    .ant-avatar {
                        width: 80px !important;
                        height: 80px !important;
                    }
                    
                    .ant-tabs-tab-btn {
                        font-size: 12px !important;
                    }
                    
                    .ant-radio-button-wrapper {
                        padding: 4px 8px !important;
                        font-size: 12px !important;
                    }
                }

                @media (max-width: 480px) {
                    .ant-tabs-tab {
                        padding: 6px 8px !important;
                        font-size: 12px !important;
                    }
                    
                    .ant-form-item-label > label {
                        font-size: 13px !important;
                    }
                }
            `}
            </style>
        </div>
    );
};

export default UserSettingsPanel; 