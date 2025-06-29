import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectService, {
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    JoinProjectRequest,
    ProjectSearchQuery,
    ProjectSearchResponse
} from '../../Services/ProjectService';

interface ProjectState {
    // All projects with search/filter
    projects: Project[];
    totalCount: number;
    currentPage: number;
    totalPages: number;

    // My projects
    myProjects: Project[];

    // Current project detail
    currentProject: Project | null;

    // Loading states
    loading: boolean;
    myProjectsLoading: boolean;
    currentProjectLoading: boolean;
    actionLoading: boolean; // For join/leave/create/update actions

    // Error states
    error: string | null;
    actionError: string | null;

    // Search filters
    searchQuery: ProjectSearchQuery;

    // Cache timestamp for smart caching (5 minutes)
    lastFetch: number | null;
}

const initialState: ProjectState = {
    projects: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    myProjects: [],
    currentProject: null,
    loading: false,
    myProjectsLoading: false,
    currentProjectLoading: false,
    actionLoading: false,
    error: null,
    actionError: null,
    searchQuery: {
        page: 1,
        pageSize: 10
    },
    lastFetch: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (query: ProjectSearchQuery = {}, { rejectWithValue }) => {
        try {
            const response = await projectService.getProjects(query);
            return { response, query };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch projects');
        }
    }
);

export const fetchMyProjects = createAsyncThunk(
    'projects/fetchMyProjects',
    async (_, { rejectWithValue }) => {
        try {
            const projects = await projectService.getMyProjects();
            return projects;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch my projects');
        }
    }
);

export const fetchProject = createAsyncThunk(
    'projects/fetchProject',
    async (id: number, { rejectWithValue }) => {
        try {
            const project = await projectService.getProject(id);
            return project;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch project');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: CreateProjectRequest, { rejectWithValue, dispatch }) => {
        try {
            const project = await projectService.createProject(projectData);
            // Refresh my projects after creation
            dispatch(fetchMyProjects());
            return project;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, projectData }: { id: number; projectData: UpdateProjectRequest }, { rejectWithValue, dispatch }) => {
        try {
            const project = await projectService.updateProject(id, projectData);
            // Refresh my projects after update
            dispatch(fetchMyProjects());
            return project;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            await projectService.deleteProject(id);
            // Refresh my projects after deletion
            dispatch(fetchMyProjects());
            return id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete project');
        }
    }
);

export const joinProject = createAsyncThunk(
    'projects/joinProject',
    async ({ id, joinData }: { id: number; joinData?: JoinProjectRequest }, { rejectWithValue, dispatch }) => {
        try {
            await projectService.joinProject(id, joinData);
            // Refresh current project to show updated member list
            dispatch(fetchProject(id));
            return id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to join project');
        }
    }
);

export const leaveProject = createAsyncThunk(
    'projects/leaveProject',
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            await projectService.leaveProject(id);
            // Refresh current project to show updated member list
            dispatch(fetchProject(id));
            return id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to leave project');
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.actionError = null;
        },
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
        updateSearchQuery: (state, action: PayloadAction<ProjectSearchQuery>) => {
            state.searchQuery = { ...state.searchQuery, ...action.payload };
        },
        resetProjects: (state) => {
            state.projects = [];
            state.totalCount = 0;
            state.currentPage = 1;
            state.totalPages = 0;
            state.lastFetch = null;
        },
        clearProjectState: (state) => {
            return { ...initialState };
        }
    },
    extraReducers: (builder) => {
        // Fetch Projects
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.response.projects;
                state.totalCount = action.payload.response.totalCount;
                state.currentPage = action.payload.response.page;
                state.totalPages = action.payload.response.totalPages;
                state.searchQuery = { ...state.searchQuery, ...action.payload.query };
                state.lastFetch = Date.now();
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch My Projects
        builder
            .addCase(fetchMyProjects.pending, (state) => {
                state.myProjectsLoading = true;
                state.error = null;
            })
            .addCase(fetchMyProjects.fulfilled, (state, action) => {
                state.myProjectsLoading = false;
                state.myProjects = action.payload;
            })
            .addCase(fetchMyProjects.rejected, (state, action) => {
                state.myProjectsLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Project Detail
        builder
            .addCase(fetchProject.pending, (state) => {
                state.currentProjectLoading = true;
                state.error = null;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.currentProjectLoading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.currentProjectLoading = false;
                state.error = action.payload as string;
            });

        // Create Project
        builder
            .addCase(createProject.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Add to projects list if it matches current search
                state.projects.unshift(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload as string;
            });

        // Update Project
        builder
            .addCase(updateProject.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Update in projects list
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                // Update current project if it's the same
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload as string;
            });

        // Delete Project
        builder
            .addCase(deleteProject.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Remove from projects list
                state.projects = state.projects.filter(p => p.id !== action.payload);
                // Clear current project if it's the deleted one
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload as string;
            });

        // Join Project
        builder
            .addCase(joinProject.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(joinProject.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Update hasUserJoined flag in projects list
                const projectIndex = state.projects.findIndex(p => p.id === action.payload);
                if (projectIndex !== -1) {
                    state.projects[projectIndex].hasUserJoined = true;
                    state.projects[projectIndex].currentMembers += 1;
                }
            })
            .addCase(joinProject.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload as string;
            });

        // Leave Project
        builder
            .addCase(leaveProject.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(leaveProject.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Update hasUserJoined flag in projects list
                const projectIndex = state.projects.findIndex(p => p.id === action.payload);
                if (projectIndex !== -1) {
                    state.projects[projectIndex].hasUserJoined = false;
                    state.projects[projectIndex].currentMembers -= 1;
                }
            })
            .addCase(leaveProject.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearCurrentProject,
    updateSearchQuery,
    resetProjects,
    clearProjectState
} = projectSlice.actions;

// Selectors
export const selectProjects = (state: { projects: ProjectState }) => state.projects.projects;
export const selectMyProjects = (state: { projects: ProjectState }) => state.projects.myProjects;
export const selectCurrentProject = (state: { projects: ProjectState }) => state.projects.currentProject;
export const selectProjectsLoading = (state: { projects: ProjectState }) => state.projects.loading;
export const selectMyProjectsLoading = (state: { projects: ProjectState }) => state.projects.myProjectsLoading;
export const selectCurrentProjectLoading = (state: { projects: ProjectState }) => state.projects.currentProjectLoading;
export const selectActionLoading = (state: { projects: ProjectState }) => state.projects.actionLoading;
export const selectProjectsError = (state: { projects: ProjectState }) => state.projects.error;
export const selectActionError = (state: { projects: ProjectState }) => state.projects.actionError;
export const selectSearchQuery = (state: { projects: ProjectState }) => state.projects.searchQuery;
export const selectPagination = (state: { projects: ProjectState }) => ({
    currentPage: state.projects.currentPage,
    totalPages: state.projects.totalPages,
    totalCount: state.projects.totalCount,
});

// Smart caching selector - returns true if data is fresh (less than 5 minutes old)
export const selectIsDataFresh = (state: { projects: ProjectState }) => {
    const { lastFetch } = state.projects;
    if (!lastFetch) return false;
    const FIVE_MINUTES = 5 * 60 * 1000;
    return Date.now() - lastFetch < FIVE_MINUTES;
};

export default projectSlice.reducer; 