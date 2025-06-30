import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../Services/UserService';
import * as authAPI from '../../Services/UserService';

// 数据缓存时间（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

interface AuthState {
    isAuthenticated: boolean;
    user: AuthResponse['user'] | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null; // 用于判断数据是否过期
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

// 智能获取用户信息 - 只在需要时请求
export const fetchUserInfo = createAsyncThunk(
    'auth/fetchUserInfo',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { auth: AuthState };
        const { token, lastUpdated, user } = state.auth;

        if (!token) {
            return rejectWithValue('No token available');
        }

        // 如果数据是最近获取的且用户信息存在，跳过请求
        if (lastUpdated && user && (Date.now() - lastUpdated < CACHE_DURATION)) {
            console.log('🚀 Using cached user data, skipping API call');
            return user;
        }

        console.log('📡 Fetching fresh user data from API');
        try {
            const userInfo = await authAPI.getCurrentUser(token);
            return userInfo;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch user info');
        }
    }
);

// 登录
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Login failed');
        }
    }
);

// 注册
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Registration failed');
        }
    }
);

// 乐观更新用户信息 - 立即更新UI，后台同步
export const updateUserOptimistic = createAsyncThunk(
    'auth/updateUserOptimistic',
    async (updates: Partial<AuthResponse['user']>, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as { auth: AuthState };
        const { token, user } = state.auth;

        if (!token || !user) {
            return rejectWithValue('No user data available');
        }

        // 立即更新本地状态（乐观更新）
        const optimisticUser = { ...user, ...updates };

        try {
            // 这里可以添加实际的更新API调用
            // const updatedUser = await authAPI.updateUser(token, updates);
            console.log('🔄 Optimistic update:', optimisticUser);
            return optimisticUser;
        } catch (error: any) {
            // 如果后台更新失败，恢复原始数据
            return rejectWithValue(error?.response?.data?.message || 'Update failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 清除错误
        clearError: (state) => {
            state.error = null;
        },

        // 登出
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.lastUpdated = null;
            state.error = null;
        },

        // 从持久化存储恢复时验证数据有效性
        validatePersistedData: (state) => {
            // 如果数据过期，清除用户信息但保留token用于重新获取
            if (state.lastUpdated && (Date.now() - state.lastUpdated > CACHE_DURATION)) {
                console.log('⚠️ Persisted user data expired, will refresh on next request');
                state.user = null;
                state.lastUpdated = null;
            }

            // 如果有token，确保设置为已认证状态
            if (state.token && state.refreshToken) {
                state.isAuthenticated = true;
                console.log('🔄 Restored authentication state from persistence');
            }
        },

        // 初始化认证状态 - 用于应用启动时检查
        initializeAuth: (state) => {
            // 如果有有效的token，设置为已认证状态
            if (state.token && state.refreshToken) {
                state.isAuthenticated = true;
                console.log('✅ Authentication state initialized');
            } else {
                // 清理无效状态
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.lastUpdated = null;
                console.log('🧹 Cleared invalid authentication state');
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // 登录
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 注册
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 获取用户信息
            .addCase(fetchUserInfo.pending, (state) => {
                // 只有在没有用户数据时才显示loading
                if (!state.user) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.lastUpdated = Date.now();
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                // 如果获取用户信息失败，可能token已过期
                const errorMessage = action.payload as string;
                if (errorMessage?.includes('401') || errorMessage?.includes('unauthorized')) {
                    state.isAuthenticated = false;
                    state.token = null;
                    state.refreshToken = null;
                    state.user = null;
                    state.lastUpdated = null;
                }
            })

            // 乐观更新用户信息
            .addCase(updateUserOptimistic.fulfilled, (state, action) => {
                state.user = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(updateUserOptimistic.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError, logout, validatePersistedData, initializeAuth } = authSlice.actions;
export default authSlice.reducer; 