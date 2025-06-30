import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, ThemeState } from '../../types/theme';

// 检测系统主题偏好
const getSystemThemePreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// 从localStorage获取保存的主题模式
const getStoredThemeMode = (): ThemeMode => {
    if (typeof window === 'undefined') return 'auto';
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored;
    }
    return 'auto';
};

// 计算实际的主题模式
const calculateActualTheme = (mode: ThemeMode, systemPrefersDark: boolean): boolean => {
    if (mode === 'auto') {
        return systemPrefersDark;
    }
    return mode === 'dark';
};

const initialState: ThemeState = {
    mode: getStoredThemeMode(),
    systemPrefersDark: getSystemThemePreference(),
    isDark: false, // 将在初始化时计算
};

// 计算初始的isDark状态
initialState.isDark = calculateActualTheme(initialState.mode, initialState.systemPrefersDark);

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        // 设置主题模式
        setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            state.isDark = calculateActualTheme(action.payload, state.systemPrefersDark);

            // 保存到localStorage
            localStorage.setItem('themeMode', action.payload);

            console.log(`🎨 Theme mode changed to: ${action.payload}, isDark: ${state.isDark}`);
        },

        // 更新系统主题偏好（当系统主题改变时）
        updateSystemThemePreference: (state, action: PayloadAction<boolean>) => {
            state.systemPrefersDark = action.payload;

            // 如果当前是auto模式，重新计算isDark
            if (state.mode === 'auto') {
                state.isDark = action.payload;
                console.log(`🔄 System theme preference updated: ${action.payload}, isDark: ${state.isDark}`);
            }
        },

        // 切换主题（在light和dark之间切换）
        toggleTheme: (state) => {
            const newMode: ThemeMode = state.isDark ? 'light' : 'dark';
            state.mode = newMode;
            state.isDark = newMode === 'dark';

            // 保存到localStorage
            localStorage.setItem('themeMode', newMode);

            console.log(`🔀 Theme toggled to: ${newMode}`);
        },

        // 初始化主题（用于应用启动时）
        initializeTheme: (state) => {
            const systemPrefersDark = getSystemThemePreference();
            state.systemPrefersDark = systemPrefersDark;
            state.isDark = calculateActualTheme(state.mode, systemPrefersDark);

            console.log(`🚀 Theme initialized: mode=${state.mode}, isDark=${state.isDark}, system=${systemPrefersDark}`);
        }
    }
});

export const {
    setThemeMode,
    updateSystemThemePreference,
    toggleTheme,
    initializeTheme
} = themeSlice.actions;

export default themeSlice.reducer; 