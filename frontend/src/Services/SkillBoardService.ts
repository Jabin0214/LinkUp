import { API_CONFIG } from '../config/api';
import HttpClient from '../utils/httpClient';

export interface SkillItemDto {
    id?: number;
    language: string;
    level: string;
    order: number;
}

export interface LinkItemDto {
    id?: number;
    title: string;
    url: string;
    order: number;
}

export interface SkillBoardResponse {
    id: number;
    userId: number;
    introduction: string;
    direction: string;
    createdAt: string;
    updatedAt: string;
    skills: SkillItemDto[];
    links: LinkItemDto[];
}

export interface CreateSkillBoardRequest {
    introduction: string;
    direction: string;
    skills: Omit<SkillItemDto, 'id'>[];
    links: Omit<LinkItemDto, 'id'>[];
}

export interface UpdateSkillBoardRequest {
    introduction: string;
    direction: string;
    skills: Omit<SkillItemDto, 'id'>[];
    links: Omit<LinkItemDto, 'id'>[];
}

// 获取当前用户的技能板
export async function getMySkillBoard(token: string): Promise<SkillBoardResponse> {
    return await HttpClient.getWithAuth<SkillBoardResponse>(
        API_CONFIG.ENDPOINTS.SKILLBOARD.BASE,
        token
    );
}

// 根据用户ID获取技能板（公开访问）
export async function getSkillBoardByUserId(userId: number): Promise<SkillBoardResponse> {
    return await HttpClient.get<SkillBoardResponse>(
        API_CONFIG.ENDPOINTS.SKILLBOARD.BY_USER(userId)
    );
}

// 创建技能板
export async function createSkillBoard(data: CreateSkillBoardRequest, token: string): Promise<SkillBoardResponse> {
    return await HttpClient.postWithAuth<SkillBoardResponse>(
        API_CONFIG.ENDPOINTS.SKILLBOARD.BASE,
        data,
        token
    );
}

// 更新技能板
export async function updateSkillBoard(data: UpdateSkillBoardRequest, token: string): Promise<SkillBoardResponse> {
    return await HttpClient.putWithAuth<SkillBoardResponse>(
        API_CONFIG.ENDPOINTS.SKILLBOARD.BASE,
        data,
        token
    );
}

// 删除技能板
export async function deleteSkillBoard(token: string): Promise<void> {
    await HttpClient.deleteWithAuth<void>(
        API_CONFIG.ENDPOINTS.SKILLBOARD.BASE,
        token
    );
}

// Skill level options
export const skillLevels = [
    { value: 'Beginner', label: 'Beginner', color: '#f0f0f0' },
    { value: 'Familiar', label: 'Familiar', color: '#bae637' },
    { value: 'Proficient', label: 'Proficient', color: '#52c41a' },
    { value: 'Expert', label: 'Expert', color: '#1890ff' },
];

// Development direction options
export const developmentDirections = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Data Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'UI/UX Design',
    'Product Management',
    'Project Management',
    'Other'
]; 