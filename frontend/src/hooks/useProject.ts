import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import {
    selectProjects,
    selectMyProjects,
    selectCurrentProject,
    selectProjectsLoading,
    selectMyProjectsLoading,
    selectCurrentProjectLoading,
    selectActionLoading,
    selectProjectsError,
    selectActionError,
    selectPagination,
    selectSearchQuery,
    selectIsDataFresh,
    fetchProjects,
    fetchMyProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    joinProject,
    leaveProject,
    clearError,
    clearCurrentProject,
    updateSearchQuery
} from '../store/slices/projectSlice';

/**
 * 项目列表相关的Hook
 */
export const useProjectList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const projects = useSelector(selectProjects);
    const loading = useSelector(selectProjectsLoading);
    const error = useSelector(selectProjectsError);
    const actionLoading = useSelector(selectActionLoading);
    const actionError = useSelector(selectActionError);
    const pagination = useSelector(selectPagination);
    const searchQuery = useSelector(selectSearchQuery);
    const isDataFresh = useSelector(selectIsDataFresh);
    const { user } = useSelector((state: RootState) => state.auth);

    return {
        // 状态
        projects,
        loading,
        error,
        actionLoading,
        actionError,
        pagination,
        searchQuery,
        isDataFresh,
        user,
        // 操作
        dispatch,
        navigate,
        fetchProjects: (query?: any) => dispatch(fetchProjects(query)),
        joinProject: (data: any) => dispatch(joinProject(data)),
        updateSearchQuery: (query: any) => dispatch(updateSearchQuery(query)),
        clearError: () => dispatch(clearError())
    };
};

/**
 * 我的项目相关的Hook
 */
export const useMyProjects = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const myProjects = useSelector(selectMyProjects);
    const loading = useSelector(selectMyProjectsLoading);
    const error = useSelector(selectProjectsError);
    const { user } = useSelector((state: RootState) => state.auth);

    return {
        // 状态
        myProjects,
        loading,
        error,
        user,
        // 操作
        dispatch,
        navigate,
        fetchMyProjects: () => dispatch(fetchMyProjects())
    };
};

/**
 * 项目详情相关的Hook
 */
export const useProjectDetail = (id?: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const project = useSelector(selectCurrentProject);
    const loading = useSelector(selectCurrentProjectLoading);
    const error = useSelector(selectProjectsError);
    const actionLoading = useSelector(selectActionLoading);
    const actionError = useSelector(selectActionError);
    const { user } = useSelector((state: RootState) => state.auth);

    return {
        // 状态
        project,
        loading,
        error,
        actionLoading,
        actionError,
        user,
        // 操作
        dispatch,
        navigate,
        fetchProject: (projectId: number) => dispatch(fetchProject(projectId)),
        joinProject: (data: any) => dispatch(joinProject(data)),
        leaveProject: (projectId: number) => dispatch(leaveProject(projectId)),
        deleteProject: (projectId: number) => dispatch(deleteProject(projectId)),
        clearError: () => dispatch(clearError()),
        clearCurrentProject: () => dispatch(clearCurrentProject())
    };
};

/**
 * 项目表单相关的Hook
 */
export const useProjectForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const project = useSelector(selectCurrentProject);
    const loading = useSelector(selectCurrentProjectLoading);
    const actionLoading = useSelector(selectActionLoading);
    const actionError = useSelector(selectActionError);
    const { user } = useSelector((state: RootState) => state.auth);

    return {
        // 状态
        project,
        loading,
        actionLoading,
        actionError,
        user,
        // 操作
        dispatch,
        navigate,
        createProject: (data: any) => dispatch(createProject(data)),
        updateProject: (data: any) => dispatch(updateProject(data)),
        fetchProject: (projectId: number) => dispatch(fetchProject(projectId)),
        clearError: () => dispatch(clearError()),
        clearCurrentProject: () => dispatch(clearCurrentProject())
    };
}; 