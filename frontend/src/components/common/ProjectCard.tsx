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

    // 内联样式定义
    const cardStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const
    };

    const bodyStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '16px'
    };

    const actionsStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 16px',
        borderTop: '1px solid var(--border-color)',
        gap: '8px'
    };

    const buttonStyle = {
        flex: 1,
        minWidth: '70px',
        fontSize: '12px'
    };

    const actions = [
        <Button
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(project.id)}
            style={buttonStyle}
        >
            View
        </Button>
    ];

    // 添加编辑按钮
    if (showEditButton && onEdit && project.isCreator) {
        actions.push(
            <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(project.id)}
                style={buttonStyle}
            >
                Edit
            </Button>
        );
    }

    // 添加加入按钮
    if (showJoinButton && onJoin && !project.hasUserJoined && !project.isCreator && project.status === 'Recruiting') {
        actions.push(
            <Button
                key="join"
                type="text"
                icon={<UserAddOutlined />}
                loading={isLoading}
                disabled={project.currentMembers >= project.maxMembers}
                onClick={() => onJoin(project.id)}
                style={buttonStyle}
            >
                Join
            </Button>
        );
    }

    return (
        <Card
            hoverable
            style={cardStyle}
            bodyStyle={bodyStyle}
            actions={actions.length > 0 ? [
                <div key="actions" style={actionsStyle}>
                    {actions}
                </div>
            ] : undefined}
        >
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
                            marginRight: '12px',
                            fontSize: '16px',
                            lineHeight: '1.3'
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
                style={{
                    color: 'var(--text-color-secondary)',
                    marginBottom: '16px',
                    fontSize: '14px',
                    lineHeight: '1.4'
                }}
            >
                {project.description}
            </Paragraph>

            {/* 项目信息 */}
            <div style={{ marginBottom: '16px' }}>
                <Space size="small" wrap>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        <TeamOutlined style={{ marginRight: '4px' }} />
                        {project.creatorName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        <FolderOutlined style={{ marginRight: '4px' }} />
                        {project.category}
                    </Text>
                </Space>
            </div>

            {/* 成员和日期信息 */}
            <div style={{ marginBottom: '16px' }}>
                <Space size="small" wrap>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        <TeamOutlined style={{ marginRight: '4px' }} />
                        {project.currentMembers}/{project.maxMembers} members
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
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
                            <Tag key={skill} color="blue" style={{ fontSize: '12px', marginBottom: '4px' }}>
                                {skill}
                            </Tag>
                        ))}
                        {hasMore && (
                            <Tag color="default" style={{ fontSize: '12px', marginBottom: '4px' }}>
                                +{remainingCount} more
                            </Tag>
                        )}
                    </Space>
                </div>
            )}

            {/* 团队成员预览（如果有成员信息） */}
            {project.members && project.members.length > 0 && (
                <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                        Team Members:
                    </Text>
                    <Avatar.Group max={{ count: 5, style: { color: 'var(--warning-color)', backgroundColor: 'var(--hover-background)' } }}>
                        {project.members.map(member => (
                            <Tooltip key={member.id} title={member.username}>
                                <Avatar
                                    style={{ backgroundColor: 'var(--primary-color)' }}
                                    size="small"
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