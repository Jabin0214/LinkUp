import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Drawer } from 'antd';
import { UserOutlined, SettingOutlined, DashboardOutlined, AppstoreOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
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
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: '仪表板',
        },
        {
            key: 'feature1',
            icon: <AppstoreOutlined />,
            label: '功能模块1',
        },
        {
            key: 'feature2',
            icon: <AppstoreOutlined />,
            label: '功能模块2',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '用户设置',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
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

    const handleMenuClick = (key: string) => {
        setSelectedKey(key);
        setMobileMenuVisible(false); // 移动端点击后关闭菜单
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 桌面端侧边栏 */}
            <Sider
                width={240}
                theme="dark"
                breakpoint="lg"
                collapsedWidth="0"
                collapsed={collapsed}
                onBreakpoint={(broken) => {
                    // 在lg断点以下自动隐藏侧边栏
                    setCollapsed(broken);
                }}
                onCollapse={(collapsed) => {
                    setCollapsed(collapsed);
                }}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100
                }}
                className="desktop-sider"
            >
                <div style={{
                    height: 64,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                    LinkUp
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menuItems}
                    onClick={({ key }) => handleMenuClick(key)}
                />
            </Sider>

            {/* 移动端抽屉菜单 */}
            <Drawer
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        LinkUp
                    </div>
                }
                placement="left"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                bodyStyle={{ padding: 0 }}
                width={280}
                className="mobile-drawer"
            >
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ border: 'none' }}
                    items={menuItems}
                    onClick={({ key }) => handleMenuClick(key)}
                />
            </Drawer>

            <Layout style={{
                marginLeft: collapsed ? 0 : 240,
                transition: 'margin-left 0.2s'
            }}>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 99,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    {/* 移动端菜单按钮 */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuVisible(true)}
                        style={{
                            fontSize: '16px',
                            width: 40,
                            height: 40
                        }}
                        className="mobile-menu-btn"
                    />

                    {/* 用户信息 */}
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span className="username-text">{auth.user.username}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    background: '#fff',
                    minHeight: 280,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    {renderContent()}
                </Content>
            </Layout>

            {/* 响应式样式 */}
            <style>
                {`
                /* 桌面端样式 */
                @media (min-width: 992px) {
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    .mobile-drawer .ant-drawer-content {
                        display: none;
                    }
                }

                /* 移动端样式 */
                @media (max-width: 991.98px) {
                    .desktop-sider {
                        display: none !important;
                    }
                    
                    .ant-layout {
                        margin-left: 0 !important;
                    }
                    
                    .ant-layout-header {
                        padding: 0 16px !important;
                    }
                    
                    .ant-layout-content {
                        margin: 16px 8px !important;
                        padding: 16px !important;
                    }
                }

                /* 超小屏幕优化 */
                @media (max-width: 575.98px) {
                    .username-text {
                        display: none;
                    }
                    
                    .ant-layout-header {
                        padding: 0 12px !important;
                    }
                    
                    .ant-layout-content {
                        margin: 12px 4px !important;
                        padding: 12px !important;
                        border-radius: 6px !important;
                    }
                    
                    .mobile-drawer .ant-drawer-header {
                        padding: 16px 20px !important;
                    }
                }

                /* 横屏模式优化 */
                @media (max-height: 500px) and (orientation: landscape) {
                    .ant-layout-content {
                        margin: 8px !important;
                        padding: 16px !important;
                    }
                }

                /* 高分辨率屏幕优化 */
                @media (min-width: 1400px) {
                    .ant-layout-sider {
                        width: 260px !important;
                        max-width: 260px !important;
                    }
                    
                    .ant-layout {
                        margin-left: 260px !important;
                    }
                }
            `}
            </style>
        </Layout>
    );
};

export default DashboardLayout; 