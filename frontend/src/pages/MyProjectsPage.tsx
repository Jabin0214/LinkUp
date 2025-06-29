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
    Spin
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

    useEffect(() => {
        fetchMyProjects();
    }, [fetchMyProjects]);

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

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={1} style={{ marginBottom: '8px' }}>
                    <ProjectOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                    My Projects
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Manage your projects and track your participation
                </Text>
            </div>

            {/* Statistics */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Total Projects"
                            value={stats.total}
                            prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Projects Owned"
                            value={stats.owned}
                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Projects Joined"
                            value={stats.joined}
                            prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Active Projects"
                            value={stats.recruiting + stats.inProgress}
                            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Action Buttons */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Space>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/dashboard/projects/create')}
                    >
                        Create New Project
                    </Button>
                    <Button
                        size="large"
                        icon={<EyeOutlined />}
                        onClick={() => navigate('/dashboard/projects')}
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
                                <div style={{ textAlign: 'center' }}>
                                    <Text style={{ fontSize: '16px', color: '#666' }}>
                                        You haven't created or joined any projects yet
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        Start by creating your first project or browse existing ones
                                    </Text>
                                </div>
                            }
                        >
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/dashboard/projects/create')}
                                >
                                    Create Project
                                </Button>
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate('/dashboard/projects')}
                                >
                                    Browse Projects
                                </Button>
                            </Space>
                        </Empty>
                    </Card>
                ) : (
                    <Row gutter={[16, 16]}>
                        {myProjects.map(project => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
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