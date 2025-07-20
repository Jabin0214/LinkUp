import React from 'react';
import { Card, Button, Tag, Typography, Space, Avatar, Tooltip } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    UserAddOutlined,
    TeamOutlined,
    CalendarOutlined,
    FolderOutlined,
    CrownOutlined,
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
    showJoinedBadge = false,
}) => {
    const { visibleSkills, remainingCount, hasMore } = truncateSkills(project.requiredSkills);

    // Modern 卡片样式
    const cardStyle = {
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        height: '95%',
        minHeight: 370,
        display: 'flex',
        flexDirection: 'column' as const,
        background: 'var(--card-background)',
        border: '1px solid var(--border-color)',
    };

    // 按钮区
    const actionsStyle = {
        display: 'flex',
        gap: 12,
        borderTop: '1px solid var(--border-color)',
        padding: '14px 20px',
        background: 'var(--body-background)',
        justifyContent: 'flex-end',
    };

    // 按钮样式
    const buttonStyle = {
        minWidth: 70,
        fontWeight: 500,
        fontSize: 13,
        borderRadius: 8,
        border: 'none',
        background: 'var(--component-background)',
        color: 'var(--primary-color)',
        boxShadow: 'none',
    };

    // actions array
    const actions = [
        <Button
            key="view"
            type="default"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(project.id)}
            style={buttonStyle}
        >
            View
        </Button>,
    ];

    if (showEditButton && onEdit && project.isCreator) {
        actions.push(
            <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => onEdit(project.id)}
                style={buttonStyle}
            >
                Edit
            </Button>
        );
    }

    if (showJoinButton && onJoin && !project.hasUserJoined && !project.isCreator && project.status === 'Recruiting') {
        actions.push(
            <Button
                key="join"
                icon={<UserAddOutlined />}
                loading={isLoading}
                disabled={project.currentMembers >= project.maxMembers}
                onClick={() => onJoin(project.id)}
                style={{
                    ...buttonStyle,
                    background: 'var(--primary-color)',
                    color: '#fff',
                    fontWeight: 600,
                }}
            >
                Join
            </Button>
        );
    }

    return (
        <Card hoverable style={cardStyle}>
            {/* 顶部信息 */}
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            cursor: 'pointer',
                            fontSize: 17,
                            lineHeight: '1.35',
                            fontWeight: 600,
                            flex: 1,
                        }}
                        onClick={() => onViewDetails(project.id)}
                        ellipsis={{ rows: 2 }}
                    >
                        {project.title}
                    </Title>
                    <Tag color={getProjectStatusColor(project.status)} style={{ fontWeight: 500 }}>
                        {getProjectStatusText(project.status)}
                    </Tag>
                </div>

                {/* Owner / Joined 标识 */}
                <Space size="small">
                    {showJoinedBadge && project.hasUserJoined && (
                        <Tag color="success" style={{ fontWeight: 500 }}>
                            Joined
                        </Tag>
                    )}
                    {showOwnerBadge && project.isCreator && (
                        <Tag color="purple" icon={<CrownOutlined />} style={{ fontWeight: 500 }}>
                            Owner
                        </Tag>
                    )}
                </Space>
            </div>

            {/* 项目描述 */}
            <Paragraph
                ellipsis={{ rows: 3 }}
                style={{
                    color: 'var(--text-color-secondary)',
                    marginBottom: 13,
                    fontSize: 14,
                    minHeight: 52,
                }}
            >
                {project.description}
            </Paragraph>

            {/* 主要信息 */}
            <Space size={[16, 4]} wrap style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    {project.creatorName}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    <FolderOutlined style={{ marginRight: 4 }} />
                    {project.category}
                </Text>
            </Space>

            {/* 成员/时间 */}
            <Space size={[16, 4]} wrap style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    {project.currentMembers}/{project.maxMembers} members
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {formatDate(project.createdAt)}
                </Text>
            </Space>

            {/* 技能标签 */}
            {project.requiredSkills.length > 0 && (
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <Space size={[0, 4]} wrap>
                        {visibleSkills.map((skill) => (
                            <Tag
                                key={skill}
                                color="blue"
                                style={{
                                    fontSize: 12,
                                    padding: '0 10px',
                                    borderRadius: 6,
                                    marginBottom: 2,
                                }}
                            >
                                {skill}
                            </Tag>
                        ))}
                        {hasMore && (
                            <Tag
                                color="default"
                                style={{
                                    fontSize: 12,
                                    padding: '0 10px',
                                    borderRadius: 6,
                                    marginBottom: 2,
                                }}
                            >
                                +{remainingCount} more
                            </Tag>
                        )}
                    </Space>
                </div>
            )}

            {/* 成员头像 */}
            {project.members && project.members.length > 0 && (
                <div style={{ marginTop: 8, marginBottom: 10 }}>
                    <Text
                        type="secondary"
                        style={{ display: 'block', marginBottom: 5, fontSize: 13 }}
                    >
                        Team Members
                    </Text>
                    <Avatar.Group
                        max={{
                            count: 5,
                            style: {
                                color: 'var(--primary-color)',
                                backgroundColor: '#f0f2fa',
                            },
                        }}
                    >
                        {project.members.map((member) => (
                            <Tooltip key={member.id} title={member.username}>
                                <Avatar
                                    style={{
                                        backgroundColor: 'var(--primary-color)',
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                    size="small"
                                >
                                    {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
            )}
            {/* 按钮区域 */}
            {actions.length > 0 && (
                <div style={actionsStyle}>
                    {actions}
                </div>
            )}
        </Card>
    );
};

export default ProjectCard;