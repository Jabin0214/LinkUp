export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
    primary: string;
    success: string;
    warning: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    border: string;
    background: string;
    componentBackground: string;
    bodyBackground: string;
    shadow1: string;
    shadow2: string;
}

export interface ThemeConfig {
    mode: ThemeMode;
    colors: ThemeColors;
    borderRadius: {
        base: number;
        large: number;
    };
}

export interface ThemeState {
    mode: ThemeMode;
    isDark: boolean;
    systemPrefersDark: boolean;
} 