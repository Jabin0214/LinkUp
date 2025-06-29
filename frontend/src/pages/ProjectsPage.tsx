import React, { useEffect, useState } from 'react';
import {
    Button,
    Input,
    Select,
    Row,
    Col,
    Typography,
    Space,
    Pagination,
    Modal,
    Spin,
    Empty,
    Divider,
    Card,
    Tag,
    message
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    ClearOutlined,
    RocketOutlined,
    FolderOutlined,
    StarOutlined
} from '@ant-design/icons';
import { useProjectList } from '../hooks/useProject';
import { useProjectErrorHandler } from '../hooks/useErrorHandler';
import ProjectCard from '../components/common/ProjectCard';
import { PROJECT_CATEGORIES, COMMON_SKILLS } from '../Services/ProjectService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

    // Local state for filters
    const [keyword, setKeyword] = useState(searchQuery.keyword || '');
    const [selectedCategory, setSelectedCategory] = useState(searchQuery.category || '');
    const [selectedStatus, setSelectedStatus] = useState(searchQuery.status || 'Recruiting');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(searchQuery.requiredSkills || []);
    const [joinMessage, setJoinMessage] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    useEffect(() => {
        if (!isDataFresh) {
            fetchProjects(searchQuery);
        }
    }, [fetchProjects, searchQuery, isDataFresh]);

    const handleSearch = () => {
        const query = {
            keyword: keyword.trim() || undefined,
            category: selectedCategory || undefined,
            status: selectedStatus || undefined,
            requiredSkills: selectedSkills.length > 0 ? selectedSkills : undefined,
            page: 1,
            pageSize: 10
        };

        updateSearchQuery(query);
        fetchProjects(query);
    };

    const handleClearFilters = () => {
        setKeyword('');
        setSelectedCategory('');
        setSelectedStatus('Recruiting');
        setSelectedSkills([]);

        const query = {
            status: 'Recruiting',
            page: 1,
            pageSize: 10
        };

        updateSearchQuery(query);
        fetchProjects(query);
    };

    const handlePageChange = (page: number) => {
        const query = { ...searchQuery, page };
        updateSearchQuery(query);
        fetchProjects(query);
    };

    const handleJoinProject = (projectId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedProjectId(projectId);
        setShowJoinModal(true);
    };

    const confirmJoinProject = async () => {
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
    };

    const handleSkillToggle = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const handleViewDetails = (projectId: number) => {
        navigate(`/dashboard/projects/${projectId}`);
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={1} style={{ marginBottom: '16px' }}>
                    <RocketOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                    Discover Amazing Projects
                </Title>
                <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    Find exciting collaborative projects and connect with like-minded partners to create something extraordinary
                </Paragraph>
            </div>

            {/* Search and Filters */}
            <Card style={{ marginBottom: '24px' }} bodyStyle={{ padding: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                <SearchOutlined style={{ marginRight: '4px' }} />
                                Search Projects
                            </Text>
                            <Input
                                placeholder="Enter keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                <FolderOutlined style={{ marginRight: '4px' }} />
                                Category
                            </Text>
                            <Select
                                placeholder="All Categories"
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                allowClear
                            >
                                {PROJECT_CATEGORIES.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                <StarOutlined style={{ marginRight: '4px' }} />
                                Status
                            </Text>
                            <Select
                                placeholder="All Status"
                                style={{ width: '100%' }}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                allowClear
                            >
                                <Option value="Recruiting">Recruiting</Option>
                                <Option value="InProgress">In Progress</Option>
                                <Option value="Completed">Completed</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                Search
                            </Button>
                            <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                                Clear
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Skills Filter */}
                <Divider />
                <div>
                    <Text strong style={{ display: 'block', marginBottom: '12px' }}>
                        Required Skills
                    </Text>
                    <Space size={[0, 8]} wrap>
                        {COMMON_SKILLS.map(skill => (
                            <Tag.CheckableTag
                                key={skill}
                                checked={selectedSkills.includes(skill)}
                                onChange={() => handleSkillToggle(skill)}
                            >
                                {skill}
                            </Tag.CheckableTag>
                        ))}
                    </Space>
                </div>
            </Card>

            {/* Create Project Button */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/dashboard/projects/create')}
                    style={{ marginRight: '16px' }}
                >
                    Create Project
                </Button>
            </div>

            {/* Content */}
            <Spin spinning={loading}>
                {projects.length === 0 && !loading ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div style={{ textAlign: 'center' }}>
                                <Text style={{ fontSize: '16px', color: '#666' }}>
                                    No projects found
                                </Text>
                                <br />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/dashboard/projects/create')}
                                    style={{ marginTop: '16px' }}
                                >
                                    Create Your First Project
                                </Button>
                            </div>
                        }
                    />
                ) : (
                    <>
                        {/* Projects Grid */}
                        <Row gutter={[16, 16]}>
                            {projects.map(project => (
                                <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                                    <ProjectCard
                                        project={project}
                                        onViewDetails={handleViewDetails}
                                        onJoin={handleJoinProject}
                                        isLoading={actionLoading}
                                        showJoinButton={true}
                                        showJoinedBadge={true}
                                    />
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Pagination
                                current={pagination.currentPage}
                                total={pagination.totalCount}
                                pageSize={10}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} of ${total} projects`
                                }
                            />
                        </div>
                    </>
                )}
            </Spin>

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

export default ProjectsPage; 