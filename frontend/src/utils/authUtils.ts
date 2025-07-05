import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// 检查是否是认证错误
export const isAuthError = (error: any): boolean => {
    return error?.response?.status === 401 ||
        (error?.code === 'ERR_BAD_REQUEST' &&
            error?.response?.status === 401);
};

// 检查JWT token是否过期
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true; // 如果无法解析，认为已过期
    }
};

// 处理认证错误 - 自动登出并清理状态
export const handleAuthError = (error: any) => {
    if (isAuthError(error)) {
        // 清理localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // 清理Redux状态
        store.dispatch(logout());

        // 重定向到登录页
        window.location.href = '/login';

        return true; // 表示已处理
    }
    return false; // 表示未处理
};

// 验证token格式
export const isValidTokenFormat = (token: string | null): boolean => {
    if (!token) return false;

    // JWT token通常有3个部分，用.分隔
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // 检查长度（一个简单的检查）
    if (token.length < 20) return false;

    // 检查是否过期
    if (isTokenExpired(token)) {
        return false;
    }

    return true;
};

// 获取当前有效的token
export const getCurrentToken = (): string | null => {
    const state = store.getState();
    const token = state.auth.token;

    if (!isValidTokenFormat(token)) {
        return null;
    }

    return token;
};

// 检查用户是否真正已认证（有有效token和用户信息）
export const isUserAuthenticated = (): boolean => {
    const state = store.getState();
    const { token, isAuthenticated, user } = state.auth;

    const hasValidToken = isValidTokenFormat(token);
    const hasUserInfo = !!user && !!user.username;

    return isAuthenticated &&
        hasValidToken &&
        hasUserInfo;
}; 