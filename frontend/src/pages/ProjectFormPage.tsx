import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Typography,
    Space,
    Spin,
    Row,
    Col,
    Button,
    Alert
} from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    PlusOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useProjectForm } from '../hooks/useProject';
import { useProjectErrorHandler } from '../hooks/useErrorHandler';
import { PROJECT_CATEGORIES, COMMON_SKILLS } from '../Services/ProjectService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProjectFormData {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    maxMembers: number;
    startDate?: string;
    endDate?: string;
    contactInfo?: string;
}

const ProjectFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const {
        project,
        loading,
        actionLoading,
        actionError,
        user,
        createProject,
        updateProject,
        fetchProject,
        clearCurrentProject,
        navigate
    } = useProjectForm();

    // 使用错误处理Hook
    useProjectErrorHandler(actionError);

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing && id) {
            fetchProject(parseInt(id));
        } else {
            clearCurrentProject();
        }

        return () => {
            clearCurrentProject();
        };
    }, [id, isEditing, fetchProject, clearCurrentProject]);

    useEffect(() => {
        if (project && isEditing) {
            form.setFieldsValue({
                title: project.title,
                description: project.description,
                category: project.category,
                requiredSkills: project.requiredSkills,
                maxMembers: project.maxMembers,
                startDate: project.startDate ? dayjs(project.startDate) : undefined,
                endDate: project.endDate ? dayjs(project.endDate) : undefined,
                contactInfo: project.contactInfo
            });
        }
    }, [project, isEditing, form]);

    const handleSubmit = async (values: ProjectFormData) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSubmitting(true);

        const projectData = {
            ...values,
            startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : undefined,
            endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined
        };

        try {
            let result;
            if (isEditing && project) {
                result = await updateProject({ id: project.id, ...projectData });
            } else {
                result = await createProject(projectData);
            }

            if (result.type.endsWith('/fulfilled')) {
                if (isEditing) {
                    navigate(`/dashboard/projects/${project?.id}`);
                } else {
                    navigate('/dashboard/projects');
                }
            }
        } catch (error) {
            console.error('Error submitting project:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isEditing && project) {
            navigate(`/dashboard/projects/${project.id}`);
        } else {
            navigate('/dashboard/projects');
        }
    };

    if (isEditing && loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isEditing && !loading && !project) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Project Not Found"
                    description="The project you're trying to edit doesn't exist or has been removed."
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

    return (
        <div style={{ padding: '24px', background: 'var(--body-background)', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel}
                    style={{ marginBottom: '16px' }}
                >
                    Back to Projects
                </Button>

                <Title level={1} style={{ marginBottom: '8px' }}>
                    <ProjectOutlined style={{ marginRight: '12px', color: 'var(--primary-color)' }} />
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    {isEditing ? 'Update your project details' : 'Share your project idea and find collaborators'}
                </Text>
            </div>

            {/* Form */}
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                    requiredMark={false}
                >
                    <Row gutter={[24, 0]}>
                        <Col xs={24} lg={16}>
                            {/* Basic Information */}
                            <Title level={3} style={{ marginBottom: '24px' }}>
                                Basic Information
                            </Title>

                            <Form.Item
                                name="title"
                                label="Project Title"
                                rules={[
                                    { required: true, message: 'Please enter project title' },
                                    { min: 5, message: 'Title must be at least 5 characters' },
                                    { max: 100, message: 'Title cannot exceed 100 characters' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter a descriptive title for your project"
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Project Description"
                                rules={[
                                    { required: true, message: 'Please enter project description' },
                                    { min: 50, message: 'Description must be at least 50 characters' },
                                    { max: 2000, message: 'Description cannot exceed 2000 characters' }
                                ]}
                            >
                                <TextArea
                                    rows={6}
                                    placeholder="Describe your project, its goals, and what you're looking to achieve..."
                                    showCount
                                    maxLength={2000}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="category"
                                        label="Category"
                                        rules={[{ required: true, message: 'Please select a category' }]}
                                    >
                                        <Select placeholder="Select project category">
                                            {PROJECT_CATEGORIES.map(category => (
                                                <Option key={category} value={category}>
                                                    {category}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="maxMembers"
                                        label="Maximum Members"
                                        rules={[
                                            { required: true, message: 'Please specify maximum members' },
                                            { type: 'number', min: 2, message: 'Minimum 2 members required' },
                                            { type: 'number', max: 50, message: 'Maximum 50 members allowed' }
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            placeholder="e.g., 5"
                                            min={2}
                                            max={50}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="requiredSkills"
                                label="Required Skills"
                                rules={[
                                    { required: true, message: 'Please select at least one skill' },
                                    { type: 'array', min: 1, message: 'At least one skill is required' }
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select required skills for your project"
                                    showSearch
                                    optionFilterProp="children"
                                    maxTagCount="responsive"
                                >
                                    {COMMON_SKILLS.map(skill => (
                                        <Option key={skill} value={skill}>
                                            {skill}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={8}>
                            {/* Additional Information */}
                            <Title level={3} style={{ marginBottom: '24px' }}>
                                Additional Details
                            </Title>

                            <Form.Item
                                name="startDate"
                                label="Planned Start Date"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value && dayjs(value).isBefore(dayjs(), 'day')) {
                                                return Promise.reject('Start date cannot be in the past');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Select start date"
                                    disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="endDate"
                                label="Expected End Date"
                                dependencies={['startDate']}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator: (_, value) => {
                                            const startDate = getFieldValue('startDate');
                                            if (value && startDate && dayjs(value).isBefore(dayjs(startDate), 'day')) {
                                                return Promise.reject('End date must be after start date');
                                            }
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Select end date"
                                />
                            </Form.Item>

                            <Form.Item
                                name="contactInfo"
                                label="Contact Information"
                                rules={[
                                    { max: 500, message: 'Contact info cannot exceed 500 characters' }
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="How should people contact you? (Email, Discord, etc.)"
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                        <Space size="large">
                            <Button size="large" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                                loading={submitting || actionLoading}
                            >
                                {isEditing ? 'Update Project' : 'Create Project'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ProjectFormPage; 