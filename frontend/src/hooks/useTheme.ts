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

    }, [isDark]);

    // 立即初始化主题，防止闪白
    useEffect(() => {
        // 在React应用启动时立即应用主题
        const storedMode = localStorage.getItem('theme-mode') || 'auto';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let shouldBeDark = false;
        if (storedMode === 'dark') {
            shouldBeDark = true;
        } else if (storedMode === 'light') {
            shouldBeDark = false;
        } else { // auto
            shouldBeDark = systemPrefersDark;
        }

        // 立即应用主题，不等Redux
        const root = document.documentElement;
        root.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');

        // 然后初始化Redux状态
        dispatch(initializeTheme());
    }, [dispatch]);

    // 监听系统主题变化
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            dispatch(updateSystemThemePreference(e.matches));
        };

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