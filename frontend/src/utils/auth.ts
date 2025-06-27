import { AuthResponse } from '../Services/UserService';

export const AuthStorage = {
    // 保存认证信息
    save: (auth: AuthResponse) => {
        localStorage.setItem('token', auth.token);
        localStorage.setItem('refreshToken', auth.refreshToken);
    },

    // 获取认证信息
    get: () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        return { token, refreshToken };
    },

    // 清除认证信息
    clear: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
};

export const handleApiError = (err: any, fallbackMessage: string) => {
    return err?.response?.data?.message || fallbackMessage;
}; 