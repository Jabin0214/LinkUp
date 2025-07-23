import React, { memo } from 'react';
import { Row, Col, Pagination, Empty, Card, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProjectCard from '../common/ProjectCard';
import type { Project } from '../../Services/ProjectService';

const { Text } = Typography;

interface ProjectsListProps {
    projects: Project[];
    loading: boolean;
    isMobile: boolean;
    actionLoading: boolean;
    pagination: {
        currentPage: number;
        totalCount: number;
    };
    onViewDetails: (projectId: number) => void;
    onJoinProject: (projectId: number) => void;
    onPageChange: (page: number) => void;
    onCreateProject: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = memo(({
    projects,
    loading,
    isMobile,
    actionLoading,
    pagination,
    onViewDetails,
    onJoinProject,
    onPageChange,
    onCreateProject
}) => {
    if (projects.length === 0 && !loading) {
        return (
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
                                color: 'var(--text-color-secondary)'
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
                        onClick={onCreateProject}
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
        );
    }

    return (
        <>
            {/* Projects Grid */}
            <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                {projects.map(project => (
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
                            onViewDetails={onViewDetails}
                            onJoin={onJoinProject}
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
                    onChange={onPageChange}
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
    );
});

ProjectsList.displayName = 'ProjectsList';

export default ProjectsList; 