import axios from 'axios';

const API_URL = 'http://localhost:5006/api';

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
    university: string;
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
        university: string;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UserPublicProfile {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    university?: string;
    joinedAt: string;
    isFriend: boolean;
    hasPendingRequest: boolean;
    friendRequestStatus?: 'sent' | 'received' | null;
    skillBoard?: SkillBoardInfo;
}

export interface SkillBoardInfo {
    introduction?: string;
    direction?: string;
    skills: SkillItemInfo[];
    links: LinkItemInfo[];
}

export interface SkillItemInfo {
    language: string;
    level: string;
}

export interface LinkItemInfo {
    title: string;
    url: string;
}

export interface DiscoverUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    university?: string;
    joinedAt: string;
    isSchoolmate: boolean;
    isFriend: boolean;
    hasPendingRequest: boolean;
    friendRequestStatus?: 'sent' | 'received' | null;
}

export interface DiscoverUsersResponse {
    users: DiscoverUser[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

export interface University {
    name: string;
    userCount: number;
}

export interface SearchUsersResponse {
    users: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        university?: string;
    }[];
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
}

export async function changePassword(data: ChangePasswordRequest, token: string): Promise<void> {
    await axios.post(`${API_URL}/auth/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getCurrentUser(token: string) {
    const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function logout(refreshToken: string) {
    await axios.post(`${API_URL}/auth/logout`, { refreshToken });
}

// Discover users with filters
export async function discoverUsers(
    token: string,
    params: {
        page?: number;
        size?: number;
        university?: string;
        search?: string;
    } = {}
): Promise<DiscoverUsersResponse> {
    const response = await axios.get(`${API_URL}/User/discover`, {
        headers: { Authorization: `Bearer ${token}` },
        params
    });
    return response.data;
}

// Get user public profile
export async function getUserProfile(
    token: string,
    userId: number
): Promise<UserPublicProfile> {
    const response = await axios.get(`${API_URL}/User/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Get universities list
export async function getUniversities(
    token: string,
    search?: string
): Promise<University[]> {
    const response = await axios.get(`${API_URL}/User/universities`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
    });
    return response.data;
}

// Search users
export async function searchUsers(
    token: string,
    query: string,
    limit?: number
): Promise<SearchUsersResponse> {
    const response = await axios.get(`${API_URL}/User/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query, limit }
    });
    return response.data;
} 