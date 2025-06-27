import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import { UserOutlined, SettingOutlined, DashboardOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import UserSettingsPanel from '../../pages/UserSettingsPanel';
import DashboardContent from './DashboardContent';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
    onLogout: () => void;
}

// 统一的路由配置
const ROUTE_CONFIG = {
    dashboard: {
        path: '/dashboard/overview',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        component: <DashboardContent />
    },
    settings: {
        path: '/dashboard/settings',
        icon: <SettingOutlined />,
        label: 'User Settings',
        component: null
    }
} as const;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 从Redux获取用户信息
    const { user } = useAppSelector(state => state.auth);

    const selectedKey = Object.entries(ROUTE_CONFIG).find(
        ([_, config]) => location.pathname === config.path
    )?.[0] || 'dashboard';

    useEffect(() => {
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
            navigate(ROUTE_CONFIG.dashboard.path, { replace: true });
        }
    }, [location.pathname, navigate]);

    const menuItems = Object.entries(ROUTE_CONFIG).map(([key, config]) => ({
        key,
        icon: config.icon,
        label: config.label,
    }));

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

    const handleMenuClick = (key: string) => {
        const config = ROUTE_CONFIG[key as keyof typeof ROUTE_CONFIG];
        if (config) {
            navigate(config.path);
            if (window.innerWidth <= 991.98) {
                setCollapsed(true);
            }
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={240}
                theme="dark"
                breakpoint="lg"
                collapsedWidth="0"
                collapsed={collapsed}
                onBreakpoint={setCollapsed}
                onCollapse={setCollapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100
                }}
                trigger={null}
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
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 40,
                            height: 40
                        }}
                    />

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>{user?.username}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: '16px 16px',
                    padding: 20,
                    background: '#fff',
                    minHeight: 280,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <Routes>
                        <Route path="overview" element={<DashboardContent />} />
                        <Route path="settings" element={<UserSettingsPanel />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout; 