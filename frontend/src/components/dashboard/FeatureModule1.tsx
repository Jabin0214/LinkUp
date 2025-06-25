import React, { useState } from 'react';
import { Card, Button, Space, Row, Col, List, Avatar, Tag, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const FeatureModule1: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // 模拟数据
    const itemsData = [
        {
            id: 1,
            title: '项目开发任务',
            description: '完成前端页面开发和API集成',
            status: 'progress',
            assignee: '张三',
            dueDate: '2024-07-15',
            priority: 'high'
        },
        {
            id: 2,
            title: '系统测试',
            description: '进行系统功能测试和性能测试',
            status: 'pending',
            assignee: '李四',
            dueDate: '2024-07-20',
            priority: 'medium'
        },
        {
            id: 3,
            title: '文档编写',
            description: '编写项目技术文档和用户手册',
            status: 'completed',
            assignee: '王五',
            dueDate: '2024-07-10',
            priority: 'low'
        },
        {
            id: 4,
            title: '代码审查',
            description: '对提交的代码进行质量审查',
            status: 'progress',
            assignee: '赵六',
            dueDate: '2024-07-18',
            priority: 'high'
        }
    ];

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'orange',
            progress: 'blue',
            completed: 'green',
            cancelled: 'red'
        };
        return colors[status as keyof typeof colors];
    };

    const getStatusText = (status: string) => {
        const texts = {
            pending: '待处理',
            progress: '进行中',
            completed: '已完成',
            cancelled: '已取消'
        };
        return texts[status as keyof typeof texts];
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            high: 'red',
            medium: 'orange',
            low: 'blue'
        };
        return colors[priority as keyof typeof colors];
    };

    const getPriorityText = (priority: string) => {
        const texts = {
            high: '高优先级',
            medium: '中优先级',
            low: '低优先级'
        };
        return texts[priority as keyof typeof texts];
    };

    const filteredItems = itemsData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAddNew = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // 这里可以添加新建逻辑
        }, 1000);
    };

    return (
        <div className="feature-module-1">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    marginBottom: 8,
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#262626'
                }}>
                    项目任务管理
                </h2>
                <p style={{
                    color: '#8c8c8c',
                    fontSize: '14px',
                    margin: 0
                }}>
                    管理和跟踪项目任务进度
                </p>
            </div>

            {/* 操作工具栏 */}
            <Card
                style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                bodyStyle={{ padding: '16px' }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="搜索任务..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: '100%' }}
                            enterButton={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: '100%' }}
                            placeholder="筛选状态"
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="pending">待处理</Option>
                            <Option value="progress">进行中</Option>
                            <Option value="completed">已完成</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={10}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                loading={loading}
                                onClick={handleAddNew}
                                style={{ borderRadius: 6 }}
                            >
                                新建任务
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                style={{ borderRadius: 6 }}
                            >
                                批量编辑
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* 任务列表 */}
            <Card
                title="任务列表"
                style={{
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                bodyStyle={{ padding: '16px' }}
            >
                <List
                    itemLayout="vertical"
                    dataSource={filteredItems}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 项，共 ${total} 项`,
                        responsive: true
                    }}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                padding: '16px',
                                border: '1px solid #f0f0f0',
                                borderRadius: 8,
                                marginBottom: 12,
                                backgroundColor: '#fafafa'
                            }}
                            actions={[
                                <Button
                                    key="edit"
                                    type="text"
                                    icon={<EditOutlined />}
                                    size="small"
                                >
                                    编辑
                                </Button>,
                                <Button
                                    key="delete"
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                >
                                    删除
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#1890ff' }}
                                    />
                                }
                                title={
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                                        <Tag color={getStatusColor(item.status)}>
                                            {getStatusText(item.status)}
                                        </Tag>
                                        <Tag color={getPriorityColor(item.priority)}>
                                            {getPriorityText(item.priority)}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <p style={{ margin: 0, marginBottom: 8 }}>
                                            {item.description}
                                        </p>
                                        <Space size="middle" wrap>
                                            <span>
                                                <UserOutlined style={{ marginRight: 4 }} />
                                                负责人: {item.assignee}
                                            </span>
                                            <span>
                                                <CalendarOutlined style={{ marginRight: 4 }} />
                                                截止日期: {item.dueDate}
                                            </span>
                                        </Space>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>

            {/* 响应式样式 */}
            <style>
                {`
                .feature-module-1 {
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .feature-module-1 h2 {
                        font-size: 20px !important;
                        text-align: center;
                    }
                    
                    .ant-list-item-action {
                        margin-top: 12px !important;
                    }
                    
                    .ant-list-item-meta-title {
                        margin-bottom: 8px !important;
                    }
                    
                    .ant-card-head-title {
                        font-size: 16px !important;
                    }
                }

                @media (max-width: 575.98px) {
                    .feature-module-1 {
                        margin: 0 -4px;
                    }
                    
                    .ant-card {
                        margin-bottom: 12px;
                        border-radius: 6px !important;
                    }
                    
                    .ant-card-body {
                        padding: 12px !important;
                    }
                    
                    .ant-list-item {
                        padding: 12px !important;
                        margin-bottom: 8px !important;
                    }
                    
                    .ant-list-item-meta-avatar {
                        margin-right: 12px !important;
                    }
                    
                    .ant-btn {
                        padding: 4px 8px !important;
                        height: auto !important;
                        font-size: 12px !important;
                    }
                    
                    .ant-tag {
                        padding: 2px 6px !important;
                        font-size: 11px !important;
                        margin: 2px !important;
                    }
                }

                @media (max-width: 480px) {
                    .ant-space {
                        flex-wrap: wrap;
                    }
                    
                    .ant-list-item-action > li {
                        padding: 0 4px !important;
                    }
                }
            `}
            </style>
        </div>
    );
};

export default FeatureModule1; 