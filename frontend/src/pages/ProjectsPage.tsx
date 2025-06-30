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
    message,
    Grid
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

    // 响应式断点检测
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Local state for filters
    const [keyword, setKeyword] = useState(searchQuery.keyword || '');
    const [selectedCategory, setSelectedCategory] = useState(searchQuery.category || '');
    const [selectedStatus, setSelectedStatus] = useState(searchQuery.status || 'Recruiting');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(searchQuery.requiredSkills || []);
    const [joinMessage, setJoinMessage] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // 优化的数据获取逻辑，避免重复请求
    useEffect(() => {
        // 数据不新鲜或没有项目数据时请求
        if (!isDataFresh || projects.length === 0) {
            fetchProjects(searchQuery);
        }
    }, [fetchProjects, isDataFresh, projects.length, searchQuery]);

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
        <div style={{
            paddingTop: isMobile ? '16px' : '24px',
            paddingLeft: isMobile ? '16px' : '24px',
            paddingRight: isMobile ? '16px' : '24px',
            paddingBottom: '24px',
            background: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: isMobile ? '24px' : '32px'
            }}>
                <Title
                    level={isMobile ? 2 : 1}
                    style={{
                        marginBottom: isMobile ? '12px' : '16px',
                        fontSize: isMobile ? '24px' : '32px'
                    }}
                >
                    <RocketOutlined style={{
                        marginRight: isMobile ? '8px' : '12px',
                        color: '#1890ff',
                        fontSize: isMobile ? '20px' : '24px'
                    }} />
                    Discover Amazing Projects
                </Title>
                <Paragraph style={{
                    fontSize: isMobile ? '14px' : '16px',
                    color: '#666',
                    maxWidth: isMobile ? '100%' : '600px',
                    margin: '0 auto',
                    padding: isMobile ? '0 8px' : '0'
                }}>
                    Find exciting collaborative projects and connect with like-minded partners to create something extraordinary
                </Paragraph>
            </div>

            {/* Search and Filters */}
            <Card
                style={{
                    marginBottom: '24px',
                    borderRadius: isMobile ? '8px' : '12px'
                }}
                bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
            >
                <Row gutter={[isMobile ? 12 : 16, isMobile ? 16 : 16]}>
                    {/* 搜索框 */}
                    <Col xs={24} sm={12} md={7} lg={6}>
                        <div>
                            <Text strong style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: isMobile ? '13px' : '14px'
                            }}>
                                <SearchOutlined style={{ marginRight: '4px' }} />
                                Search Projects
                            </Text>
                            <Input
                                placeholder="Enter keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                            />
                        </div>
                    </Col>

                    {/* 分类 */}
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <div>
                            <Text strong style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: isMobile ? '13px' : '14px'
                            }}>
                                <FolderOutlined style={{ marginRight: '4px' }} />
                                Category
                            </Text>
                            <Select
                                placeholder="All Categories"
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                            >
                                {PROJECT_CATEGORIES.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>

                    {/* 状态 */}
                    <Col xs={24} sm={12} md={5} lg={4}>
                        <div>
                            <Text strong style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: isMobile ? '13px' : '14px'
                            }}>
                                <StarOutlined style={{ marginRight: '4px' }} />
                                Status
                            </Text>
                            <Select
                                placeholder="All Status"
                                style={{ width: '100%' }}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                            >
                                <Option value="Recruiting">Recruiting</Option>
                                <Option value="InProgress">In Progress</Option>
                                <Option value="Completed">Completed</Option>
                            </Select>
                        </div>
                    </Col>

                    {/* 操作按钮 */}
                    <Col xs={24} sm={12} md={7} lg={5}>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-end',
                            marginTop: isMobile ? '0' : '29px',
                            justifyContent: isMobile ? 'stretch' : 'flex-start'
                        }}>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                size={isMobile ? 'middle' : 'middle'}
                                style={{ flex: isMobile ? 1 : 'none' }}
                            >
                                {isMobile ? 'Search' : 'Search'}
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                size={isMobile ? 'middle' : 'middle'}
                                style={{ flex: isMobile ? 1 : 'none' }}
                            >
                                {isMobile ? 'Clear' : 'Clear'}
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Skills Filter */}
                <Divider style={{ margin: isMobile ? '16px 0' : '24px 0' }} />
                <div>
                    <Text strong style={{
                        display: 'block',
                        marginBottom: isMobile ? '8px' : '12px',
                        fontSize: isMobile ? '13px' : '14px'
                    }}>
                        Required Skills
                    </Text>
                    <div style={{
                        maxHeight: isMobile ? '120px' : 'none',
                        overflowY: isMobile ? 'auto' : 'visible'
                    }}>
                        <Space size={[0, 8]} wrap>
                            {COMMON_SKILLS.map(skill => (
                                <Tag.CheckableTag
                                    key={skill}
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => handleSkillToggle(skill)}
                                    style={{
                                        fontSize: isMobile ? '12px' : '13px',
                                        padding: isMobile ? '2px 8px' : '4px 12px'
                                    }}
                                >
                                    {skill}
                                </Tag.CheckableTag>
                            ))}
                        </Space>
                    </div>
                </div>
            </Card>

            {/* Create Project Button */}
            <div style={{
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <Button
                    type="primary"
                    size={isMobile ? 'middle' : 'large'}
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/dashboard/projects/create')}
                    style={{
                        width: isMobile ? '100%' : 'auto',
                        maxWidth: isMobile ? '280px' : 'none'
                    }}
                >
                    {isMobile ? 'Create Project' : 'Create New Project'}
                </Button>
            </div>

            {/* Content */}
            <Spin spinning={loading}>
                {projects.length === 0 && !loading ? (
                    <Card style={{
                        textAlign: 'center',
                        borderRadius: isMobile ? '8px' : '12px'
                    }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div style={{
                                    textAlign: 'center',
                                    padding: isMobile ? '0 16px' : '0'
                                }}>
                                    <Text style={{
                                        fontSize: isMobile ? '14px' : '16px',
                                        color: '#666'
                                    }}>
                                        No projects found
                                    </Text>
                                    <br />
                                    <Text type="secondary" style={{
                                        fontSize: isMobile ? '12px' : '14px'
                                    }}>
                                        Try adjusting your search filters or create a new project
                                    </Text>
                                </div>
                            }
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/dashboard/projects/create')}
                                style={{
                                    marginTop: '16px',
                                    width: isMobile ? '100%' : 'auto',
                                    maxWidth: isMobile ? '200px' : 'none'
                                }}
                                size={isMobile ? 'middle' : 'middle'}
                            >
                                Create Your First Project
                            </Button>
                        </Empty>
                    </Card>
                ) : (
                    <>
                        {/* Projects Grid */}
                        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                            {projects.map(project => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={12}
                                    lg={8}
                                    xl={6}
                                    xxl={4}
                                    key={project.id}
                                >
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
                        <div style={{
                            textAlign: 'center',
                            marginTop: isMobile ? '24px' : '32px'
                        }}>
                            <Pagination
                                current={pagination.currentPage}
                                total={pagination.totalCount}
                                pageSize={10}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper={!isMobile}
                                size={isMobile ? 'small' : 'default'}
                                showTotal={(total, range) =>
                                    isMobile
                                        ? `${range[0]}-${range[1]}/${total}`
                                        : `${range[0]}-${range[1]} of ${total} projects`
                                }
                                style={{
                                    padding: isMobile ? '0 16px' : '0'
                                }}
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