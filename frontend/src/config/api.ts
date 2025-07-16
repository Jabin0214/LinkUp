// API配置文件 - 统一管理所有API端点
export const API_CONFIG = {
    // 基础URL - 支持环境变量配置，默认为本地Docker容器
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',

    // 超时配置
    TIMEOUT: 30000, // 增加到30秒

    // API端点路径 (注意大小写与后端控制器保持一致)
    ENDPOINTS: {
        // 认证相关 - /api/Auth
        AUTH: {
            LOGIN: '/Auth/login',
            REGISTER: '/Auth/register',
            REFRESH: '/Auth/refresh',
            LOGOUT: '/Auth/logout',
            ME: '/Auth/me',
            CHANGE_PASSWORD: '/Auth/change-password',
            VALIDATE_TOKEN: '/Auth/validate-token'
        },

        // 用户相关 - /api/User  
        USER: {
            DISCOVER: '/User/discover',
            PROFILE: (userId: number) => `/User/${userId}/profile`,
            UNIVERSITIES: '/User/universities',
            SEARCH: '/User/search'
        },

        // 好友相关 - /api/Friend
        FRIEND: {
            BASE: '/Friend',
            REQUEST: '/Friend/request',
            REQUESTS: '/Friend/requests',
            RESPOND: '/Friend/respond',
            REMOVE: (friendId: number) => `/Friend/${friendId}`,
            MUTUAL: (userId: number) => `/Friend/mutual/${userId}`
        },

        // 项目相关 - /api/Project
        PROJECT: {
            BASE: '/Project',
            MY: '/Project/my',
            DETAIL: (id: number) => `/Project/${id}`,
            JOIN: (id: number) => `/Project/${id}/join`,
            LEAVE: (id: number) => `/Project/${id}/leave`,
            CATEGORIES: '/Project/categories'
        },

        // 消息相关 - /api/Message
        MESSAGE: {
            SEND: '/Message/send',
            CONVERSATION: (userId: number) => `/Message/conversation/${userId}`,
            CONVERSATIONS: '/Message/conversations',
            MARK_READ: (messageId: number) => `/Message/mark-read/${messageId}`,
            UNREAD_COUNT: '/Message/unread-count'
        },

        // 技能板相关 - /api/SkillBoard
        SKILLBOARD: {
            BASE: '/SkillBoard',
            BY_USER: (userId: number) => `/SkillBoard/user/${userId}`
        }
    }
};

// 构建完整URL的工具函数
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 获取认证头的工具函数
export const getAuthHeaders = (token?: string): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// API响应通用类型
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    requestId?: string;
}

export interface PagedApiResponse<T = any> extends ApiResponse<T> {
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
} 