import axios from 'axios';

const API_URL = 'http://localhost:5006/api/auth';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
}

export async function getCurrentUser(token: string) {
    const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function logout(refreshToken: string) {
    await axios.post(`${API_URL}/logout`, { refreshToken });
} 