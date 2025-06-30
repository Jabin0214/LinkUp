import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    Button,
    Tag,
    Row,
    Col,
    Typography,
    Space,
    Modal,
    message,
    Spin,
    Descriptions,
    Alert,
    Input,
    Avatar
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserAddOutlined,
    LogoutOutlined,
    DeleteOutlined,
    TeamOutlined,
    CalendarOutlined,
    UserOutlined,
    CrownOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useProjectDetail } from '../hooks/useProject';
import { useProjectErrorHandler } from '../hooks/useErrorHandler';
import { getProjectStatusColor, getProjectStatusText, formatDate } from '../utils/projectUtils';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {
        project,
        loading,
        error,
        actionLoading,
        actionError,
        user,
        fetchProject,
        joinProject,
        leaveProject,
        deleteProject,
        clearCurrentProject,
        navigate
    } = useProjectDetail();

    // 使用错误处理Hook
    useProjectErrorHandler(actionError, error);

    const [joinMessage, setJoinMessage] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);

    useEffect(() => {
        if (id) {
            const projectId = parseInt(id);
            fetchProject(projectId);
        }

        return () => {
            // 只在组件卸载时清理，不在useEffect重新执行时清理
        };
    }, [id, fetchProject]);

    // 单独的cleanup effect，只在组件卸载时执行
    useEffect(() => {
        return () => {
            clearCurrentProject();
        };
    }, [clearCurrentProject]);

    const handleJoinProject = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowJoinModal(true);
    };

    const confirmJoinProject = async () => {
        if (project) {
            const result = await joinProject({
                id: project.id,
                joinData: { joinMessage: joinMessage.trim() || undefined }
            });

            if (result.type.endsWith('/fulfilled')) {
                message.success('Successfully joined the project!');
                setShowJoinModal(false);
                setJoinMessage('');
            }
        }
    };

    const handleLeaveProject = () => {
        if (!project) return;

        Modal.confirm({
            title: 'Leave Project',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to leave this project?',
            okText: 'Leave',
            okType: 'danger',
            onOk: async () => {
                const result = await leaveProject(project.id);
                if (result.type.endsWith('/fulfilled')) {
                    message.success('Successfully left the project');
                }
            }
        });
    };

    const handleDeleteProject = () => {
        if (!project) return;

        Modal.confirm({
            title: 'Delete Project',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this project? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                const result = await deleteProject(project.id);
                if (result.type.endsWith('/fulfilled')) {
                    message.success('Project deleted successfully');
                    navigate('/dashboard/projects');
                }
            }
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Project Not Found"
                    description="The project you're looking for doesn't exist or has been removed."
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate('/dashboard/projects')}>
                            Back to Projects
                        </Button>
                    }
                />
            </div>
        );
    }

    const canJoin = user && !project.hasUserJoined && !project.isCreator &&
        project.status === 'Recruiting' && project.currentMembers < project.maxMembers;
    const canEdit = user && project.isCreator;
    const canLeave = user && project.hasUserJoined && !project.isCreator;
    const canDelete = user && project.isCreator;

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/dashboard/projects')}
                    style={{ marginBottom: '16px' }}
                >
                    Back to Projects
                </Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <Title level={1} style={{ marginBottom: '8px' }}>
                            {project.title}
                        </Title>
                        <Space size="middle" wrap>
                            <Tag color={getProjectStatusColor(project.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                {getProjectStatusText(project.status)}
                            </Tag>
                            {project.isCreator && (
                                <Tag color="purple" icon={<CrownOutlined />}>
                                    Owner
                                </Tag>
                            )}
                            {project.hasUserJoined && !project.isCreator && (
                                <Tag color="success" icon={<UserOutlined />}>
                                    Member
                                </Tag>
                            )}
                        </Space>
                    </div>

                    <Space>
                        {canJoin && (
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={handleJoinProject}
                                loading={actionLoading}
                            >
                                Join Project
                            </Button>
                        )}
                        {canEdit && (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                            >
                                Edit Project
                            </Button>
                        )}
                        {canLeave && (
                            <Button
                                danger
                                icon={<LogoutOutlined />}
                                onClick={handleLeaveProject}
                                loading={actionLoading}
                            >
                                Leave Project
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteProject}
                                loading={actionLoading}
                            >
                                Delete
                            </Button>
                        )}
                    </Space>
                </div>
            </div>

            {/* Join Messages */}
            {project.status === 'Recruiting' && project.currentMembers >= project.maxMembers && (
                <Alert
                    message="Project Full"
                    description="This project has reached its maximum number of members."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            {project.status !== 'Recruiting' && (
                <Alert
                    message="Project Not Recruiting"
                    description="This project is no longer accepting new members."
                    type="info"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            <Row gutter={[24, 24]}>
                {/* Main Content */}
                <Col xs={24} lg={16}>
                    <Card title="Project Description" style={{ marginBottom: '24px' }}>
                        <Paragraph style={{ fontSize: '16px', lineHeight: 1.6 }}>
                            {project.description}
                        </Paragraph>
                    </Card>

                    {/* Required Skills */}
                    <Card title="Required Skills" style={{ marginBottom: '24px' }}>
                        <Space size={[0, 8]} wrap>
                            {project.requiredSkills.map(skill => (
                                <Tag key={skill} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                    {skill}
                                </Tag>
                            ))}
                        </Space>
                    </Card>

                    {/* Team Members */}
                    <Card title="Team Members" style={{ marginBottom: '24px' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {project.members && project.members.map(member => (
                                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Avatar
                                        size={40}
                                        style={{ backgroundColor: member.id === project.creatorId ? '#722ed1' : '#1890ff' }}
                                    >
                                        {member.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text strong>{member.username}</Text>
                                        {member.id === project.creatorId && (
                                            <Tag color="purple" style={{ marginLeft: '8px', fontSize: '12px' }}>
                                                Creator
                                            </Tag>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <Card title="Project Information">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Category">
                                <Tag color="blue">{project.category}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Creator">
                                {project.creatorName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Members">
                                <Text>
                                    {project.currentMembers} / {project.maxMembers}
                                    <TeamOutlined style={{ marginLeft: '8px' }} />
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">
                                <Text>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    {formatDate(project.createdAt)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={getProjectStatusColor(project.status)}>
                                    {getProjectStatusText(project.status)}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {/* Join Project Modal */}
            <Modal
                title="Join Project"
                open={showJoinModal}
                onOk={confirmJoinProject}
                onCancel={() => setShowJoinModal(false)}
                confirmLoading={actionLoading}
            >
                <div style={{ marginBottom: '16px' }}>
                    <Text>Send a message to the project creator:</Text>
                </div>
                <TextArea
                    rows={4}
                    placeholder="Introduce yourself and explain why you want to join this project..."
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default ProjectDetailPage; 