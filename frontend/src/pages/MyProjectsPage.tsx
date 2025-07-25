import React, { useEffect } from 'react';
import {
    Card,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Statistic,
    Empty,
    Spin,
    Grid
} from 'antd';
import {
    ProjectOutlined,
    PlusOutlined,
    TeamOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useMyProjects } from '../hooks/useProject';
import { useProjectErrorHandler } from '../hooks/useErrorHandler';
import ProjectCard from '../components/common/ProjectCard';

const { Title, Text } = Typography;

const MyProjectsPage: React.FC = () => {
    const {
        myProjects,
        loading,
        error,
        fetchMyProjects,
        navigate
    } = useMyProjects();

    // 使用错误处理Hook
    useProjectErrorHandler(null, error);

    // 响应式断点检测
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    useEffect(() => {
        // 初始化时获取我的项目数据
        if (myProjects.length === 0 && !error) {
            fetchMyProjects();
        }
    }, [fetchMyProjects, myProjects.length, error]);

    const handleViewDetails = (projectId: number) => {
        navigate(`/dashboard/projects/${projectId}`);
    };

    const handleEditProject = (projectId: number) => {
        navigate(`/dashboard/projects/edit/${projectId}`);
    };

    // 计算统计数据
    const stats = {
        total: myProjects.length,
        owned: myProjects.filter(p => p.isCreator).length,
        joined: myProjects.filter(p => !p.isCreator).length,
        recruiting: myProjects.filter(p => p.status === 'Recruiting').length,
        inProgress: myProjects.filter(p => p.status === 'InProgress').length,
        completed: myProjects.filter(p => p.status === 'Completed').length
    };

    // 动态样式基于屏幕大小
    const isMobile = !screens.md;
    const containerPadding = isMobile ? '16px' : '24px';
    const titleLevel = isMobile ? 3 : 2;
    const titleMargin = isMobile ? '16px' : '24px';
    const textSize = isMobile ? '14px' : '16px';
    const iconMargin = isMobile ? '8px' : '12px';

    return (
        <div style={{
            paddingTop: containerPadding,
            paddingLeft: containerPadding,
            paddingRight: containerPadding,
            paddingBottom: '24px',
            minHeight: '100vh',
            background: 'var(--body-background)'
        }}>
            {/* Header */}
            <div style={{ marginBottom: titleMargin }}>
                <Title
                    level={titleLevel}
                    style={{
                        marginBottom: '8px',
                        color: 'var(--text-color)'
                    }}
                >
                    <ProjectOutlined style={{ marginRight: iconMargin, color: 'var(--primary-color)' }} />
                    My Projects
                </Title>
                <Text type="secondary" style={{ fontSize: textSize }}>
                    Manage your projects and track your participation
                </Text>
            </div>

            {/* Statistics */}
            <Card
                style={{
                    marginBottom: '24px',
                    borderRadius: isMobile ? '8px' : '12px'
                }}
            >
                <Row gutter={[isMobile ? 12 : 16, isMobile ? 16 : 16]}>
                    <Col xs={12} sm={12} md={6}>
                        <Statistic
                            title={
                                <span style={{
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    Total Projects
                                </span>
                            }
                            value={stats.total}
                            valueStyle={{
                                fontSize: isMobile ? '20px' : '24px',
                                color: 'var(--text-color)'
                            }}
                            prefix={<ProjectOutlined style={{
                                color: 'var(--primary-color)',
                                fontSize: isMobile ? '16px' : '20px'
                            }} />}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                        <Statistic
                            title={
                                <span style={{
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    Projects Owned
                                </span>
                            }
                            value={stats.owned}
                            valueStyle={{
                                fontSize: isMobile ? '20px' : '24px',
                                color: 'var(--text-color)'
                            }}
                            prefix={<TrophyOutlined style={{
                                color: 'var(--warning-color)',
                                fontSize: isMobile ? '16px' : '20px'
                            }} />}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                        <Statistic
                            title={
                                <span style={{
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    Projects Joined
                                </span>
                            }
                            value={stats.joined}
                            valueStyle={{
                                fontSize: isMobile ? '20px' : '24px',
                                color: 'var(--text-color)'
                            }}
                            prefix={<TeamOutlined style={{
                                color: 'var(--success-color)',
                                fontSize: isMobile ? '16px' : '20px'
                            }} />}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                        <Statistic
                            title={
                                <span style={{
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    Active Projects
                                </span>
                            }
                            value={stats.recruiting + stats.inProgress}
                            valueStyle={{
                                fontSize: isMobile ? '20px' : '24px',
                                color: 'var(--text-color)'
                            }}
                            prefix={<ClockCircleOutlined style={{
                                color: 'var(--error-color)',
                                fontSize: isMobile ? '16px' : '20px'
                            }} />}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Action Buttons */}
            <div style={{
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <Space
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    size={isMobile ? 12 : 16}
                    style={{ width: isMobile ? '100%' : 'auto' }}
                >
                    <Button
                        type="primary"
                        size={isMobile ? 'middle' : 'large'}
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/dashboard/projects/create')}
                        style={{ width: isMobile ? '100%' : 'auto' }}
                    >
                        {isMobile ? 'Create Project' : 'Create New Project'}
                    </Button>
                    <Button
                        size={isMobile ? 'middle' : 'large'}
                        icon={<EyeOutlined />}
                        onClick={() => navigate('/dashboard/projects')}
                        style={{ width: isMobile ? '100%' : 'auto' }}
                    >
                        Browse Projects
                    </Button>
                </Space>
            </div>

            {/* Projects Content */}
            <Spin spinning={loading}>
                {myProjects.length === 0 && !loading ? (
                    <Card>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div style={{ textAlign: 'center', padding: isMobile ? '0 16px' : '0' }}>
                                    <Text style={{ fontSize: isMobile ? '14px' : '16px', color: 'var(--text-color-secondary)' }}>
                                        You haven't created or joined any projects yet
                                    </Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                                        Start by creating your first project or browse existing ones
                                    </Text>
                                </div>
                            }
                        >
                            <Space
                                direction={isMobile ? 'vertical' : 'horizontal'}
                                size={isMobile ? 8 : 16}
                                style={{ width: isMobile ? '100%' : 'auto' }}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/dashboard/projects/create')}
                                    style={{ width: isMobile ? '100%' : 'auto' }}
                                >
                                    Create Project
                                </Button>
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate('/dashboard/projects')}
                                    style={{ width: isMobile ? '100%' : 'auto' }}
                                >
                                    Browse Projects
                                </Button>
                            </Space>
                        </Empty>
                    </Card>
                ) : (
                    <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                        {myProjects.map(project => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={8}
                                xl={6}
                                xxl={6}
                                key={project.id}
                            >
                                <ProjectCard
                                    project={project}
                                    onViewDetails={handleViewDetails}
                                    onEdit={handleEditProject}
                                    showEditButton={true}
                                    showOwnerBadge={true}
                                    showJoinedBadge={true}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Spin>
        </div>
    );
};

export default MyProjectsPage; 