import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Tag, List, Space, message, Spin, Empty, Row, Col, Avatar, Divider } from 'antd';
import { EditOutlined, PlusOutlined, LinkOutlined, CodeOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchSkillBoard, clearError } from '../store/slices/skillBoardSlice';
import { skillLevels } from '../Services/SkillBoardService';

const { Title, Paragraph, Text } = Typography;

const SkillBoardPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.auth);
    const { skillBoard, loading, error, hasSkillBoard } = useAppSelector(state => state.skillBoard);

    useEffect(() => {
        if (token) {
            dispatch(fetchSkillBoard(token));
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const getLevelColor = (level: string) => {
        const levelConfig = skillLevels.find(l => l.value === level);
        return levelConfig?.color || '#d9d9d9';
    };

    const handleCreateSkillBoard = () => {
        navigate('/dashboard/skillboard/edit');
    };

    const handleEditSkillBoard = () => {
        navigate('/dashboard/skillboard/edit');
    };

    const openLink = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading...</div>
            </div>
        );
    }

    if (!hasSkillBoard) {
        return (
            <div style={{ padding: '24px' }}>
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <Empty
                        description={
                            <div>
                                <Title level={4}>No Skill Board Yet</Title>
                                <Paragraph type="secondary">
                                    Create your skill board to showcase your professional skills and project experience
                                </Paragraph>
                            </div>
                        }
                    >
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleCreateSkillBoard}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none'
                            }}
                        >
                            Create Skill Board
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* 页面标题和操作按钮 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Skill Board
                    </Title>
                    <Text type="secondary">
                        Last updated: {skillBoard && new Date(skillBoard.updatedAt).toLocaleDateString()}
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditSkillBoard}
                >
                    Edit Skill Board
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* 基本信息卡片 */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                Personal Introduction
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: '16px' }} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {user?.firstName} {user?.lastName}
                                    </Title>
                                    <Text type="secondary">{user?.email}</Text>
                                </div>
                            </div>

                            <Tag
                                color="blue"
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '14px',
                                    borderRadius: '16px'
                                }}
                            >
                                {skillBoard?.direction}
                            </Tag>
                        </div>

                        <Divider />

                        <div>
                            <Title level={5}>About Me</Title>
                            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                {skillBoard?.introduction}
                            </Paragraph>
                        </div>
                    </Card>
                </Col>

                {/* 统计信息卡片 */}
                <Col xs={24} lg={8}>
                    <Card title="Statistics" style={{ height: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                            {skillBoard?.skills.length || 0}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>Skills</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                            {skillBoard?.links.length || 0}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>Links</div>
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'left' }}>
                                <Space direction="vertical" size="small">
                                    <div>
                                        <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                                        <Text type="secondary">
                                            Created on {skillBoard && new Date(skillBoard.createdAt).toLocaleDateString()}
                                        </Text>
                                    </div>
                                    <div>
                                        <EditOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                                        <Text type="secondary">
                                            Updated on {skillBoard && new Date(skillBoard.updatedAt).toLocaleDateString()}
                                        </Text>
                                    </div>
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                {/* 技能列表 */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <CodeOutlined />
                                Skills ({skillBoard?.skills.length || 0})
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        {skillBoard && skillBoard.skills.length > 0 ? (
                            <List
                                dataSource={skillBoard.skills}
                                renderItem={(skill) => (
                                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}>
                                            <Text strong style={{ fontSize: '16px' }}>
                                                {skill.language}
                                            </Text>
                                            <Tag
                                                color={getLevelColor(skill.level)}
                                                style={{
                                                    color: skill.level === '初学' ? '#595959' : '#fff',
                                                    fontWeight: '500',
                                                    border: 'none'
                                                }}
                                            >
                                                {skill.level}
                                            </Tag>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No skills yet" />
                        )}
                    </Card>
                </Col>

                {/* 相关链接 */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <LinkOutlined />
                                Links ({skillBoard?.links.length || 0})
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        {skillBoard && skillBoard.links.length > 0 ? (
                            <List
                                dataSource={skillBoard.links}
                                renderItem={(link) => (
                                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                        <Button
                                            type="link"
                                            icon={<LinkOutlined />}
                                            onClick={() => openLink(link.url)}
                                            style={{
                                                padding: 0,
                                                height: 'auto',
                                                fontSize: '16px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {link.title}
                                        </Button>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No links yet" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SkillBoardPage; 