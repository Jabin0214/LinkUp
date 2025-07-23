import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Spin, Grid, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProjectList } from '../hooks/useProject';
import { useProjectErrorHandler } from '../hooks/useErrorHandler';
import {
    ProjectsHeader,
    ProjectsSearch,
    ProjectsList,
    JoinProjectModal
} from '../components/projects';

// 常量配置
const PAGE_CONFIG = {
    PAGE_SIZE: 10,
    DEFAULT_STATUS: 'Recruiting' as const,
} as const;

// 样式常量
const CONTAINER_STYLES = {
    desktop: {
        paddingTop: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '24px',
        background: 'var(--body-background)',
        minHeight: '100vh'
    },
    mobile: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '24px',
        background: 'var(--body-background)',
        minHeight: '100vh'
    }
} as const;

const CREATE_BUTTON_STYLES = {
    container: (isMobile: boolean) => ({
        textAlign: 'center' as const,
        marginBottom: '24px'
    }),
    button: (isMobile: boolean) => ({
        width: isMobile ? '100%' : 'auto' as const,
        maxWidth: isMobile ? '280px' : 'none'
    })
} as const;

const ProjectsPage: React.FC = () => {
    const {
        projects,
        loading,
        error,
        actionLoading,
        actionError,
        pagination,
        searchQuery,
        isDataFresh,
        user,
        fetchProjects,
        joinProject: joinProjectAction,
        updateSearchQuery,
        navigate
    } = useProjectList();

    // 使用错误处理Hook
    useProjectErrorHandler(actionError, error);

    // 响应式断点检测
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Local state for filters
    const [keyword, setKeyword] = useState(searchQuery.keyword || '');
    const [selectedCategory, setSelectedCategory] = useState(searchQuery.category || '');
    const [selectedStatus, setSelectedStatus] = useState(searchQuery.status || PAGE_CONFIG.DEFAULT_STATUS);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(searchQuery.requiredSkills || []);

    // Modal state
    const [joinMessage, setJoinMessage] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // 缓存样式对象
    const containerStyle = useMemo(() =>
        isMobile ? CONTAINER_STYLES.mobile : CONTAINER_STYLES.desktop,
        [isMobile]
    );

    const createButtonContainerStyle = useMemo(() =>
        CREATE_BUTTON_STYLES.container(isMobile),
        [isMobile]
    );

    const createButtonStyle = useMemo(() =>
        CREATE_BUTTON_STYLES.button(isMobile),
        [isMobile]
    );

    // 优化的数据获取逻辑
    useEffect(() => {
        if (!isDataFresh) {
            fetchProjects();
        }
    }, [fetchProjects, isDataFresh]);

    // 缓存的事件处理函数
    const handleSearch = useCallback(() => {
        const query = {
            keyword: keyword.trim() || undefined,
            category: selectedCategory || undefined,
            status: selectedStatus || undefined,
            requiredSkills: selectedSkills.length > 0 ? selectedSkills : undefined,
            page: 1,
            pageSize: PAGE_CONFIG.PAGE_SIZE
        };

        updateSearchQuery(query);
        fetchProjects(query);
    }, [keyword, selectedCategory, selectedStatus, selectedSkills, updateSearchQuery, fetchProjects]);

    const handleClearFilters = useCallback(() => {
        setKeyword('');
        setSelectedCategory('');
        setSelectedStatus(PAGE_CONFIG.DEFAULT_STATUS);
        setSelectedSkills([]);

        const query = {
            status: PAGE_CONFIG.DEFAULT_STATUS,
            page: 1,
            pageSize: PAGE_CONFIG.PAGE_SIZE
        };

        updateSearchQuery(query);
        fetchProjects(query);
    }, [updateSearchQuery, fetchProjects]);

    const handlePageChange = useCallback((page: number) => {
        const query = { ...searchQuery, page };
        updateSearchQuery(query);
        fetchProjects(query);
    }, [searchQuery, updateSearchQuery, fetchProjects]);

    const handleJoinProject = useCallback((projectId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedProjectId(projectId);
        setShowJoinModal(true);
    }, [user, navigate]);

    const handleViewDetails = useCallback((projectId: number) => {
        navigate(`/dashboard/projects/${projectId}`);
    }, [navigate]);

    const handleCreateProject = useCallback(() => {
        navigate('/dashboard/projects/create');
    }, [navigate]);

    const handleSkillToggle = useCallback((skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    }, []);

    const confirmJoinProject = useCallback(async () => {
        if (selectedProjectId) {
            const result = await joinProjectAction({
                id: selectedProjectId,
                joinData: { joinMessage: joinMessage.trim() || undefined }
            });

            if (result.type.endsWith('/fulfilled')) {
                message.success('Successfully joined the project!');
                setShowJoinModal(false);
                setJoinMessage('');
                setSelectedProjectId(null);
            }
        }
    }, [selectedProjectId, joinMessage, joinProjectAction]);

    const handleJoinModalCancel = useCallback(() => {
        setShowJoinModal(false);
        setJoinMessage('');
        setSelectedProjectId(null);
    }, []);

    return (
        <div style={containerStyle}>
            {/* Header */}
            <ProjectsHeader isMobile={isMobile} />

            {/* Search and Filters */}
            <ProjectsSearch
                keyword={keyword}
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                selectedSkills={selectedSkills}
                isMobile={isMobile}
                onKeywordChange={setKeyword}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                onSkillToggle={handleSkillToggle}
                onSearch={handleSearch}
                onClear={handleClearFilters}
            />

            {/* Create Project Button */}
            <div style={createButtonContainerStyle}>
                <Button
                    type="primary"
                    size={isMobile ? 'middle' : 'large'}
                    icon={<PlusOutlined />}
                    onClick={handleCreateProject}
                    style={createButtonStyle}
                >
                    {isMobile ? 'Create Project' : 'Create New Project'}
                </Button>
            </div>

            {/* Content */}
            <Spin spinning={loading}>
                <ProjectsList
                    projects={projects}
                    loading={loading}
                    isMobile={isMobile}
                    actionLoading={actionLoading}
                    pagination={pagination}
                    onViewDetails={handleViewDetails}
                    onJoinProject={handleJoinProject}
                    onPageChange={handlePageChange}
                    onCreateProject={handleCreateProject}
                />
            </Spin>

            {/* Join Project Modal */}
            <JoinProjectModal
                open={showJoinModal}
                loading={actionLoading}
                joinMessage={joinMessage}
                onOk={confirmJoinProject}
                onCancel={handleJoinModalCancel}
                onMessageChange={setJoinMessage}
            />
        </div>
    );
};

export default ProjectsPage; 