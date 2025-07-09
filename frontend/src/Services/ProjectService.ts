import { API_CONFIG } from '../config/api';
import HttpClient from '../utils/httpClient';

// Types
export interface Project {
    id: number;
    title: string;
    description: string;
    creatorId: number;
    creatorName: string;
    status: string;
    category: string;
    requiredSkills: string[];
    maxMembers: number;
    currentMembers: number;
    startDate?: string;
    endDate?: string;
    contactInfo: string;
    createdAt: string;
    updatedAt: string;
    members: ProjectMember[];
    hasUserJoined: boolean;
    isCreator: boolean;
}

export interface ProjectMember {
    id: number;
    userId: number;
    username: string;
    role: string;
    joinMessage: string;
    joinedAt: string;
}

export interface CreateProjectRequest {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    maxMembers: number;
    startDate?: string;
    endDate?: string;
    contactInfo: string;
}

export interface UpdateProjectRequest {
    title: string;
    description: string;
    status: string;
    category: string;
    requiredSkills: string[];
    maxMembers: number;
    startDate?: string;
    endDate?: string;
    contactInfo: string;
}

export interface JoinProjectRequest {
    joinMessage?: string;
}

export interface ProjectSearchQuery {
    keyword?: string;
    category?: string;
    status?: string;
    requiredSkills?: string[];
    page?: number;
    pageSize?: number;
}

export interface ProjectSearchResponse {
    projects: Project[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Project Status Options
export const PROJECT_STATUSES = [
    'Recruiting',
    'InProgress',
    'Completed',
    'Cancelled'
] as const;

// Project Categories
export const PROJECT_CATEGORIES = [
    'Web Development',
    'Mobile App',
    'Desktop Application',
    'Game Development',
    'AI/Machine Learning',
    'Data Science',
    'DevOps/Infrastructure',
    'Blockchain',
    'IoT',
    'Cybersecurity',
    'UI/UX Design',
    'Research',
    'Open Source',
    'Startup',
    'Other'
] as const;

// Common Skills
export const COMMON_SKILLS = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Angular',
    'Node.js',
    'Python',
    'Java',
    'C#',
    'C++',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'HTML/CSS',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Git',
    'Linux',
    'DevOps',
    'Machine Learning',
    'Data Science',
    'UI/UX Design',
    'Figma',
    'Photoshop'
] as const;

class ProjectService {
    // Get all projects with search filters
    async getProjects(query: ProjectSearchQuery = {}): Promise<ProjectSearchResponse> {
        const params: Record<string, any> = {};
        
        if (query.keyword) params.keyword = query.keyword;
        if (query.category) params.category = query.category;
        if (query.status) params.status = query.status;
        if (query.requiredSkills) params.requiredSkills = query.requiredSkills;
        if (query.page) params.page = query.page;
        if (query.pageSize) params.pageSize = query.pageSize;

        return await HttpClient.get<ProjectSearchResponse>(
            API_CONFIG.ENDPOINTS.PROJECT.BASE,
            { params }
        );
    }

    // Get current user's projects
    async getMyProjects(): Promise<Project[]> {
        return await HttpClient.get<Project[]>(
            API_CONFIG.ENDPOINTS.PROJECT.MY
        );
    }

    // Get project by ID
    async getProject(id: number): Promise<Project> {
        return await HttpClient.get<Project>(
            API_CONFIG.ENDPOINTS.PROJECT.DETAIL(id)
        );
    }

    // Create new project
    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('You must be logged in to create a project');
        }

        return await HttpClient.postWithAuth<Project>(
            API_CONFIG.ENDPOINTS.PROJECT.BASE,
            projectData,
            token
        );
    }

    // Update project
    async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('You must be logged in to update a project');
        }

        return await HttpClient.putWithAuth<Project>(
            API_CONFIG.ENDPOINTS.PROJECT.DETAIL(id),
            projectData,
            token
        );
    }

    // Delete project
    async deleteProject(id: number): Promise<void> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('You must be logged in to delete a project');
        }

        await HttpClient.deleteWithAuth<void>(
            API_CONFIG.ENDPOINTS.PROJECT.DETAIL(id),
            token
        );
    }

    // Join project
    async joinProject(id: number, joinData: JoinProjectRequest = {}): Promise<void> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('You must be logged in to join a project');
        }

        await HttpClient.postWithAuth<void>(
            API_CONFIG.ENDPOINTS.PROJECT.JOIN(id),
            joinData,
            token
        );
    }

    // Leave project
    async leaveProject(id: number): Promise<void> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('You must be logged in to leave a project');
        }

        await HttpClient.deleteWithAuth<void>(
            API_CONFIG.ENDPOINTS.PROJECT.LEAVE(id),
            token
        );
    }

    // Get project categories
    async getCategories(): Promise<string[]> {
        return await HttpClient.get<string[]>(
            API_CONFIG.ENDPOINTS.PROJECT.CATEGORIES
        );
    }
}

export const projectService = new ProjectService();
export default projectService; 