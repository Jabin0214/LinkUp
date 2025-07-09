import { API_CONFIG } from '../config/api';
import HttpClient from '../utils/httpClient';

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
    return await HttpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data
    );
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    return await HttpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
    );
}

export async function changePassword(data: ChangePasswordRequest, token: string): Promise<void> {
    await HttpClient.postWithAuth<void>(
        API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data,
        token
    );
}

export async function getCurrentUser(token: string) {
    return await HttpClient.getWithAuth(
        API_CONFIG.ENDPOINTS.AUTH.ME,
        token
    );
}

export async function logout(refreshToken: string) {
    await HttpClient.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        { refreshToken }
    );
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
    return await HttpClient.getWithAuth<DiscoverUsersResponse>(
        API_CONFIG.ENDPOINTS.USER.DISCOVER,
        token,
        { params }
    );
}

// Get user public profile
export async function getUserProfile(
    token: string,
    userId: number
): Promise<UserPublicProfile> {
    return await HttpClient.getWithAuth<UserPublicProfile>(
        API_CONFIG.ENDPOINTS.USER.PROFILE(userId),
        token
    );
}

// Get universities list
export async function getUniversities(
    token: string,
    search?: string
): Promise<University[]> {
    return await HttpClient.getWithAuth<University[]>(
        API_CONFIG.ENDPOINTS.USER.UNIVERSITIES,
        token,
        { params: { search } }
    );
}

// Search users
export async function searchUsers(
    token: string,
    query: string,
    limit?: number
): Promise<SearchUsersResponse> {
    return await HttpClient.getWithAuth<SearchUsersResponse>(
        API_CONFIG.ENDPOINTS.USER.SEARCH,
        token,
        { params: { query, limit } }
    );
} 