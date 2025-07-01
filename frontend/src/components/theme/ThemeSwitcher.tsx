import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { SunOutlined, MoonOutlined, DesktopOutlined, BulbOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setThemeMode } from '../../store/slices/themeSlice';
import { ThemeMode } from '../../types/theme';

interface ThemeSwitcherProps {
    size?: 'small' | 'middle' | 'large';
    showLabel?: boolean;
    type?: 'button' | 'compact';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    size = 'middle',
    showLabel = false,
    type = 'button'
}) => {
    const dispatch = useAppDispatch();
    const { mode, isDark } = useAppSelector(state => state.theme);

    const themeOptions = [
        {
            key: 'light',
            label: 'Light',
            icon: <SunOutlined />,
            description: 'Light theme'
        },
        {
            key: 'dark',
            label: 'Dark',
            icon: <MoonOutlined />,
            description: 'Dark theme'
        },
        {
            key: 'auto',
            label: 'Auto',
            icon: <DesktopOutlined />,
            description: 'Follow system'
        }
    ] as const;

    const getCurrentThemeIcon = () => {
        switch (mode) {
            case 'light':
                return <SunOutlined />;
            case 'dark':
                return <MoonOutlined />;
            case 'auto':
                return <DesktopOutlined />;
            default:
                return <BulbOutlined />;
        }
    };

    const getCurrentThemeLabel = () => {
        const option = themeOptions.find(opt => opt.key === mode);
        return option?.label || 'Theme';
    };

    const handleThemeChange = (newMode: ThemeMode) => {
        dispatch(setThemeMode(newMode));
    };

    const menuItems = themeOptions.map(option => ({
        key: option.key,
        label: (
            <Space>
                {option.icon}
                <div>
                    <div>{option.label}</div>
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--text-color-secondary)',
                        marginTop: '2px'
                    }}>
                        {option.description}
                    </div>
                </div>
                {mode === option.key && (
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--primary-color)',
                        marginLeft: 'auto'
                    }} />
                )}
            </Space>
        ),
        onClick: () => handleThemeChange(option.key)
    }));

    // 紧凑型显示 - 显示为选项卡样式
    if (type === 'compact') {
        return (
            <div className="theme-switcher">
                {themeOptions.map(option => (
                    <div
                        key={option.key}
                        className={`theme-option ${mode === option.key ? 'active' : ''}`}
                        onClick={() => handleThemeChange(option.key)}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </div>
                ))}
            </div>
        );
    }

    // 按钮型显示
    return (
        <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
        >
            <Button
                type="text"
                size={size}
                icon={getCurrentThemeIcon()}
                style={{
                    color: isDark ? 'var(--text-color)' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: showLabel ? '6px' : 0
                }}
            >
                {showLabel && getCurrentThemeLabel()}
            </Button>
        </Dropdown>
    );
};

export default ThemeSwitcher; 