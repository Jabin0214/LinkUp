import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ApiResponse, getAuthHeaders } from '../config/api';

// 创建axios实例
const httpClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 自动添加认证token
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一处理错误
httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        // 处理401未授权错误
        if (error.response?.status === 401) {
            // 清除本地存储的认证信息
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // 重定向到登录页面
            window.location.href = '/login';
        }

        // 处理网络错误
        if (!error.response) {
            console.error('网络错误:', error.message);
        }

        return Promise.reject(error);
    }
);

// HTTP客户端工具类
export class HttpClient {
    // GET请求
    static async get<T = any>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await httpClient.get<T>(endpoint, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // POST请求
    static async post<T = any>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await httpClient.post<T>(endpoint, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // PUT请求
    static async put<T = any>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await httpClient.put<T>(endpoint, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // DELETE请求
    static async delete<T = any>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await httpClient.delete<T>(endpoint, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // 带认证的请求方法（可以手动传入token）
    static async getWithAuth<T = any>(
        endpoint: string,
        token: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const authConfig = {
            ...config,
            headers: {
                ...config?.headers,
                ...getAuthHeaders(token)
            }
        };
        return this.get<T>(endpoint, authConfig);
    }

    static async postWithAuth<T = any>(
        endpoint: string,
        data: any,
        token: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const authConfig = {
            ...config,
            headers: {
                ...config?.headers,
                ...getAuthHeaders(token)
            }
        };
        return this.post<T>(endpoint, data, authConfig);
    }

    static async putWithAuth<T = any>(
        endpoint: string,
        data: any,
        token: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const authConfig = {
            ...config,
            headers: {
                ...config?.headers,
                ...getAuthHeaders(token)
            }
        };
        return this.put<T>(endpoint, data, authConfig);
    }

    static async deleteWithAuth<T = any>(
        endpoint: string,
        token: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const authConfig = {
            ...config,
            headers: {
                ...config?.headers,
                ...getAuthHeaders(token)
            }
        };
        return this.delete<T>(endpoint, authConfig);
    }

    // 错误处理
    private static handleError(error: any): Error {
        if (error.response) {
            // 服务器返回错误状态码
            const message = error.response.data?.message ||
                error.response.data?.title ||
                `HTTP ${error.response.status}: ${error.response.statusText}`;
            return new Error(message);
        } else if (error.request) {
            // 请求发送但没有收到响应
            return new Error('网络连接错误，请检查网络连接');
        } else {
            // 其他错误
            return new Error(error.message || '未知错误');
        }
    }
}

// 导出axios实例供特殊用途使用
export { httpClient };
export default HttpClient; 