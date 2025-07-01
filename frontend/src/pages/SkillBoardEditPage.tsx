import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Space,
    message,
    Typography,
    Row,
    Col,
    Divider,
    List,
    Modal
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    DragOutlined
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    fetchSkillBoard,
    createSkillBoard as createSkillBoardAction,
    updateSkillBoard as updateSkillBoardAction,
    clearError
} from '../store/slices/skillBoardSlice';
import {
    CreateSkillBoardRequest,
    UpdateSkillBoardRequest,
    SkillItemDto,
    LinkItemDto,
    skillLevels,
    developmentDirections
} from '../Services/SkillBoardService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SkillFormItem extends Omit<SkillItemDto, 'id'> {
    key: string;
}

interface LinkFormItem extends Omit<LinkItemDto, 'id'> {
    key: string;
}

const SkillBoardEditPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const { skillBoard, loading: reduxLoading, error } = useAppSelector(state => state.skillBoard);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [skills, setSkills] = useState<SkillFormItem[]>([]);
    const [links, setLinks] = useState<LinkFormItem[]>([]);

    useEffect(() => {
        if (token) {
            dispatch(fetchSkillBoard(token));
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (skillBoard) {
            setIsEdit(true);

            // 填充表单数据
            form.setFieldsValue({
                introduction: skillBoard.introduction,
                direction: skillBoard.direction
            });

            // 设置技能数据
            const skillsData = skillBoard.skills.map((skill: any, index: number) => ({
                key: `skill-${index}`,
                language: skill.language,
                level: skill.level,
                order: skill.order
            }));
            setSkills(skillsData);

            // 设置链接数据
            const linksData = skillBoard.links.map((link: any, index: number) => ({
                key: `link-${index}`,
                title: link.title,
                url: link.url,
                order: link.order
            }));
            setLinks(linksData);
        }
        setInitialLoading(false);
    }, [skillBoard, form]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const addSkill = () => {
        const newSkill: SkillFormItem = {
            key: `skill-${Date.now()}`,
            language: '',
            level: 'Familiar',
            order: skills.length
        };
        setSkills([...skills, newSkill]);
    };

    const removeSkill = (key: string) => {
        setSkills(skills.filter(skill => skill.key !== key));
    };

    const updateSkill = (key: string, field: keyof Omit<SkillFormItem, 'key'>, value: any) => {
        setSkills(skills.map(skill =>
            skill.key === key ? { ...skill, [field]: value } : skill
        ));
    };

    const addLink = () => {
        const newLink: LinkFormItem = {
            key: `link-${Date.now()}`,
            title: '',
            url: '',
            order: links.length
        };
        setLinks([...links, newLink]);
    };

    const removeLink = (key: string) => {
        setLinks(links.filter(link => link.key !== key));
    };

    const updateLink = (key: string, field: keyof Omit<LinkFormItem, 'key'>, value: any) => {
        setLinks(links.map(link =>
            link.key === key ? { ...link, [field]: value } : link
        ));
    };

    const handleSubmit = async (values: any) => {
        // 验证技能数据
        const validSkills = skills.filter(skill => skill.language.trim());
        const invalidSkills = validSkills.find(skill => !skill.language.trim());
        if (invalidSkills) {
            message.error('Please fill in complete skill information');
            return;
        }

        // 验证链接数据
        const validLinks = links.filter(link => link.title.trim() && link.url.trim());
        const invalidLinks = links.find(link =>
            (link.title.trim() && !link.url.trim()) ||
            (!link.title.trim() && link.url.trim())
        );
        if (invalidLinks) {
            message.error('Please fill in complete link information');
            return;
        }

        const skillBoardData = {
            introduction: values.introduction,
            direction: values.direction,
            skills: validSkills.map((skill, index) => ({
                language: skill.language,
                level: skill.level,
                order: index
            })),
            links: validLinks.map((link, index) => ({
                title: link.title,
                url: link.url,
                order: index
            }))
        };

        try {
            setSubmitLoading(true);

            if (isEdit) {
                await dispatch(updateSkillBoardAction({ data: skillBoardData as UpdateSkillBoardRequest, token: token! })).unwrap();
                message.success('Skill board updated successfully!');
            } else {
                await dispatch(createSkillBoardAction({ data: skillBoardData as CreateSkillBoardRequest, token: token! })).unwrap();
                message.success('Skill board created successfully!');
            }

            navigate('/dashboard/skillboard');
        } catch (error: any) {
            message.error(error || `Failed to ${isEdit ? 'update' : 'create'} skill board`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleBack = () => {
        Modal.confirm({
            title: 'Confirm Leave',
            content: 'Are you sure you want to leave? Unsaved changes will be lost.',
            onOk: () => navigate('/dashboard/skillboard'),
        });
    };

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Loading...</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            {/* 页面标题 */}
            <div style={{ marginBottom: '24px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ marginBottom: '16px' }}
                >
                    Back
                </Button>
                <Title level={2}>
                    {isEdit ? 'Edit Skill Board' : 'Create Skill Board'}
                </Title>
                <Text type="secondary">
                    Fill in your skill information to showcase your professional abilities
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
            >
                <Card title="Basic Information" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="direction"
                                label="Development Direction"
                                rules={[{ required: true, message: 'Please select development direction' }]}
                            >
                                <Select placeholder="Select your main development direction" size="large">
                                    {developmentDirections.map(direction => (
                                        <Option key={direction} value={direction}>
                                            {direction}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="introduction"
                        label="Self Introduction"
                        rules={[
                            { required: true, message: 'Please fill in self introduction' },
                            { max: 1000, message: 'Self introduction cannot exceed 1000 characters' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Introduce yourself, including technical background, work experience, interests, etc..."
                            showCount
                            maxLength={1000}
                        />
                    </Form.Item>
                </Card>

                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Skills</span>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addSkill}>
                                Add Skill
                            </Button>
                        </div>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    {skills.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Text type="secondary">No skills added yet</Text>
                            <br />
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addSkill} style={{ marginTop: '16px' }}>
                                Add First Skill
                            </Button>
                        </div>
                    ) : (
                        <List
                            dataSource={skills}
                            renderItem={(skill) => (
                                <List.Item
                                    style={{ border: 'none', padding: '8px 0' }}
                                    actions={[
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeSkill(skill.key)}
                                        />
                                    ]}
                                >
                                    <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
                                        <DragOutlined style={{ color: 'var(--text-color-disabled)' }} />
                                        <Input
                                            placeholder="Programming Language/Technology Stack"
                                            value={skill.language}
                                            onChange={(e) => updateSkill(skill.key, 'language', e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <Select
                                            value={skill.level}
                                            onChange={(value) => updateSkill(skill.key, 'level', value)}
                                            style={{ width: '120px' }}
                                        >
                                            {skillLevels.map(level => (
                                                <Option key={level.value} value={level.value}>
                                                    {level.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>

                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Links</span>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addLink}>
                                Add Link
                            </Button>
                        </div>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    {links.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Text type="secondary">No links added yet</Text>
                            <br />
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addLink} style={{ marginTop: '16px' }}>
                                Add First Link
                            </Button>
                        </div>
                    ) : (
                        <List
                            dataSource={links}
                            renderItem={(link) => (
                                <List.Item
                                    style={{ border: 'none', padding: '8px 0' }}
                                    actions={[
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeLink(link.key)}
                                        />
                                    ]}
                                >
                                    <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
                                        <DragOutlined style={{ color: 'var(--text-color-disabled)' }} />
                                        <Input
                                            placeholder="Link Title (e.g., GitHub, Portfolio)"
                                            value={link.title}
                                            onChange={(e) => updateLink(link.key, 'title', e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <Input
                                            placeholder="https://..."
                                            value={link.url}
                                            onChange={(e) => updateLink(link.key, 'url', e.target.value)}
                                            style={{ flex: 2 }}
                                        />
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Space size="large">
                        <Button size="large" onClick={handleBack}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={submitLoading}
                            icon={<SaveOutlined />}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-active) 100%)',
                                border: 'none',
                                minWidth: '120px'
                            }}
                        >
                            {submitLoading ? 'Saving...' : isEdit ? 'Update Skill Board' : 'Create Skill Board'}
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default SkillBoardEditPage; 