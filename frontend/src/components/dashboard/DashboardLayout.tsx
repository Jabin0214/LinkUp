import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, SettingOutlined, DashboardOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthResponse } from '../../Services/UserService';
import UserSettingsPanel from './UserSettingsPanel';
import DashboardContent from './DashboardContent';
import FeatureModule1 from './FeatureModule1';
import FeatureModule2 from './FeatureModule2';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
    auth: AuthResponse;
    onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ auth, onLogout }) => {
    const [selectedKey, setSelectedKey] = useState('dashboard');

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'feature1',
            icon: <AppstoreOutlined />,
            label: 'Feature Module 1',
        },
        {
            key: 'feature2',
            icon: <AppstoreOutlined />,
            label: 'Feature Module 2',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'User Settings',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: onLogout,
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'settings':
                return <UserSettingsPanel auth={auth} />;
            case 'dashboard':
                return <DashboardContent />;
            case 'feature1':
                return <FeatureModule1 />;
            case 'feature2':
                return <FeatureModule2 />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} theme="dark">
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menuItems}
                    onClick={({ key }) => setSelectedKey(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>{auth.user.username}</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout; 