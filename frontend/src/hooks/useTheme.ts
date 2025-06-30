import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { initializeTheme, updateSystemThemePreference } from '../store/slices/themeSlice';

export const useTheme = () => {
    const dispatch = useAppDispatch();
    const { mode, isDark, systemPrefersDark } = useAppSelector(state => state.theme);

    // 应用主题到DOM
    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            // 为了兼容一些第三方组件，也添加类名
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            root.setAttribute('data-theme', 'light');
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }

        console.log(`🎨 Applied theme to DOM: ${isDark ? 'dark' : 'light'}`);
    }, [isDark]);

    // 监听系统主题变化
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            dispatch(updateSystemThemePreference(e.matches));
        };

        // 初始化主题
        dispatch(initializeTheme());

        // 监听系统主题变化
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [dispatch]);

    return {
        mode,
        isDark,
        systemPrefersDark
    };
}; 