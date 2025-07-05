const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';

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
    private getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    private getHeaders(): HeadersInit {
        const token = this.getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Get all projects with search filters
    async getProjects(query: ProjectSearchQuery = {}): Promise<ProjectSearchResponse> {
        const searchParams = new URLSearchParams();

        if (query.keyword) searchParams.append('keyword', query.keyword);
        if (query.category) searchParams.append('category', query.category);
        if (query.status) searchParams.append('status', query.status);
        if (query.requiredSkills) {
            query.requiredSkills.forEach(skill => searchParams.append('requiredSkills', skill));
        }
        if (query.page) searchParams.append('page', query.page.toString());
        if (query.pageSize) searchParams.append('pageSize', query.pageSize.toString());

        const url = `${API_BASE_URL}/project${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Get current user's projects
    async getMyProjects(): Promise<Project[]> {
        const response = await fetch(`${API_BASE_URL}/project/my`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Get project by ID
    async getProject(id: number): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/project/${id}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Create new project
    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        const token = this.getAuthToken();

        if (!token) {
            throw new Error('You must be logged in to create a project');
        }

        const response = await fetch(`${API_BASE_URL}/project`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(projectData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please login again');
            }

            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Response might not be JSON
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    }

    // Update project
    async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/project/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(projectData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Delete project
    async deleteProject(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/project/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    }

    // Join project
    async joinProject(id: number, joinData: JoinProjectRequest = {}): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/project/${id}/join`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(joinData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    }

    // Leave project
    async leaveProject(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/project/${id}/leave`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    }

    // Get project categories
    async getCategories(): Promise<string[]> {
        const response = await fetch(`${API_BASE_URL}/project/categories`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

export const projectService = new ProjectService();
export default projectService; 