import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
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

    // 使用useCallback确保函数引用稳定，避免useEffect无限循环
    const fetchProjectsCallback = useCallback((query?: any) => {
        dispatch(fetchProjects(query));
    }, [dispatch]);

    const joinProjectCallback = useCallback((data: any) => {
        return dispatch(joinProject(data));
    }, [dispatch]);

    const updateSearchQueryCallback = useCallback((query: any) => {
        dispatch(updateSearchQuery(query));
    }, [dispatch]);

    const clearErrorCallback = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

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
        navigate,
        fetchProjects: fetchProjectsCallback,
        joinProject: joinProjectCallback,
        updateSearchQuery: updateSearchQueryCallback,
        clearError: clearErrorCallback
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

    const fetchMyProjectsCallback = useCallback(() => {
        dispatch(fetchMyProjects());
    }, [dispatch]);

    return {
        // 状态
        myProjects,
        loading,
        error,
        user,
        // 操作
        navigate,
        fetchMyProjects: fetchMyProjectsCallback
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

    const fetchProjectCallback = useCallback((projectId: number) => {
        dispatch(fetchProject(projectId));
    }, [dispatch]);

    const joinProjectDetailCallback = useCallback((data: any) => {
        return dispatch(joinProject(data));
    }, [dispatch]);

    const leaveProjectCallback = useCallback((projectId: number) => {
        return dispatch(leaveProject(projectId));
    }, [dispatch]);

    const deleteProjectCallback = useCallback((projectId: number) => {
        return dispatch(deleteProject(projectId));
    }, [dispatch]);

    const clearErrorDetailCallback = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentProjectCallback = useCallback(() => {
        dispatch(clearCurrentProject());
    }, [dispatch]);

    return {
        // 状态
        project,
        loading,
        error,
        actionLoading,
        actionError,
        user,
        // 操作
        navigate,
        fetchProject: fetchProjectCallback,
        joinProject: joinProjectDetailCallback,
        leaveProject: leaveProjectCallback,
        deleteProject: deleteProjectCallback,
        clearError: clearErrorDetailCallback,
        clearCurrentProject: clearCurrentProjectCallback
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

    const createProjectCallback = useCallback((data: any) => {
        return dispatch(createProject(data));
    }, [dispatch]);

    const updateProjectCallback = useCallback((data: any) => {
        return dispatch(updateProject(data));
    }, [dispatch]);

    const fetchProjectFormCallback = useCallback((projectId: number) => {
        dispatch(fetchProject(projectId));
    }, [dispatch]);

    const clearErrorFormCallback = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentProjectFormCallback = useCallback(() => {
        dispatch(clearCurrentProject());
    }, [dispatch]);

    return {
        // 状态
        project,
        loading,
        actionLoading,
        actionError,
        user,
        // 操作
        navigate,
        createProject: createProjectCallback,
        updateProject: updateProjectCallback,
        fetchProject: fetchProjectFormCallback,
        clearError: clearErrorFormCallback,
        clearCurrentProject: clearCurrentProjectFormCallback
    };
}; 