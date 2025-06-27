import axios from 'axios';

const API_URL = 'http://localhost:5006/api/skillboard';

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
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 根据用户ID获取技能板（公开访问）
export async function getSkillBoardByUserId(userId: number): Promise<SkillBoardResponse> {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
}

// 创建技能板
export async function createSkillBoard(data: CreateSkillBoardRequest, token: string): Promise<SkillBoardResponse> {
    const response = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 更新技能板
export async function updateSkillBoard(data: UpdateSkillBoardRequest, token: string): Promise<SkillBoardResponse> {
    const response = await axios.put(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 删除技能板
export async function deleteSkillBoard(token: string): Promise<void> {
    await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
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