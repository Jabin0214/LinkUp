import React from 'react';
import { Card, Button, Tag, Typography, Space, Avatar, Tooltip } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    UserAddOutlined,
    TeamOutlined,
    CalendarOutlined,
    FolderOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { Project } from '../../Services/ProjectService';
import { getProjectStatusColor, getProjectStatusText, formatDate, truncateSkills } from '../../utils/projectUtils';

const { Title, Paragraph, Text } = Typography;

interface ProjectCardProps {
    project: Project;
    onViewDetails: (id: number) => void;
    onEdit?: (id: number) => void;
    onJoin?: (id: number) => void;
    isLoading?: boolean;
    showEditButton?: boolean;
    showJoinButton?: boolean;
    showOwnerBadge?: boolean;
    showJoinedBadge?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onViewDetails,
    onEdit,
    onJoin,
    isLoading = false,
    showEditButton = false,
    showJoinButton = false,
    showOwnerBadge = false,
    showJoinedBadge = false
}) => {
    const { visibleSkills, remainingCount, hasMore } = truncateSkills(project.requiredSkills);

    const actions = [
        <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(project.id)}
        >
            View Details
        </Button>
    ];

    // 添加编辑按钮
    if (showEditButton && onEdit && project.isCreator) {
        actions.push(
            <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(project.id)}
            >
                Edit
            </Button>
        );
    }

    // 添加加入按钮
    if (showJoinButton && onJoin && !project.hasUserJoined && !project.isCreator && project.status === 'Recruiting') {
        actions.push(
            <Button
                type="text"
                icon={<UserAddOutlined />}
                loading={isLoading}
                disabled={project.currentMembers >= project.maxMembers}
                onClick={() => onJoin(project.id)}
            >
                Join
            </Button>
        );
    }

    return (
        <Card hoverable actions={actions}>
            <div style={{ marginBottom: '16px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                }}>
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            cursor: 'pointer',
                            flex: 1,
                            marginRight: '12px'
                        }}
                        onClick={() => onViewDetails(project.id)}
                        ellipsis={{ rows: 2 }}
                    >
                        {project.title}
                    </Title>
                    <Tag color={getProjectStatusColor(project.status)}>
                        {getProjectStatusText(project.status)}
                    </Tag>
                </div>

                {/* 状态标签 */}
                <Space size="small" style={{ marginBottom: '12px' }}>
                    {showJoinedBadge && project.hasUserJoined && (
                        <Tag color="success">Joined</Tag>
                    )}
                    {showOwnerBadge && project.isCreator && (
                        <Tag color="purple" icon={<CrownOutlined />}>Owner</Tag>
                    )}
                </Space>
            </div>

            {/* 项目描述 */}
            <Paragraph
                ellipsis={{ rows: 3 }}
                style={{ color: '#666', marginBottom: '16px' }}
            >
                {project.description}
            </Paragraph>

            {/* 项目信息 */}
            <div style={{ marginBottom: '16px' }}>
                <Space size="small" wrap>
                    <Text type="secondary">
                        <TeamOutlined style={{ marginRight: '4px' }} />
                        {project.creatorName}
                    </Text>
                    <Text type="secondary">
                        <FolderOutlined style={{ marginRight: '4px' }} />
                        {project.category}
                    </Text>
                </Space>
            </div>

            {/* 成员和日期信息 */}
            <div style={{ marginBottom: '16px' }}>
                <Space size="small" wrap>
                    <Text type="secondary">
                        <TeamOutlined style={{ marginRight: '4px' }} />
                        {project.currentMembers}/{project.maxMembers} members
                    </Text>
                    <Text type="secondary">
                        <CalendarOutlined style={{ marginRight: '4px' }} />
                        {formatDate(project.createdAt)}
                    </Text>
                </Space>
            </div>

            {/* 技能标签 */}
            {project.requiredSkills.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <Space size={[0, 4]} wrap>
                        {visibleSkills.map(skill => (
                            <Tag key={skill} color="blue">
                                {skill}
                            </Tag>
                        ))}
                        {hasMore && (
                            <Tag color="default">
                                +{remainingCount} more
                            </Tag>
                        )}
                    </Space>
                </div>
            )}

            {/* 团队成员预览（如果有成员信息） */}
            {project.members && project.members.length > 0 && (
                <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                        Team Members:
                    </Text>
                    <Avatar.Group maxCount={5} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {project.members.map(member => (
                            <Tooltip key={member.id} title={member.username}>
                                <Avatar
                                    style={{ backgroundColor: '#1890ff' }}
                                >
                                    {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
            )}
        </Card>
    );
};

export default ProjectCard; 