import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Space, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, RiseOutlined, EyeOutlined } from '@ant-design/icons';

const DashboardContent: React.FC = () => {
    // 模拟数据
    const recentActivities = [
        { id: 1, action: '用户登录', user: '张三', time: '2分钟前', status: 'success' },
        { id: 2, action: '创建任务', user: '李四', time: '5分钟前', status: 'info' },
        { id: 3, action: '完成项目', user: '王五', time: '10分钟前', status: 'success' },
        { id: 4, action: '系统更新', user: '系统', time: '30分钟前', status: 'warning' },
    ];

    const tableColumns = [
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            responsive: ['sm'] as any,
        },
        {
            title: '用户',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            responsive: ['md'] as any,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors = {
                    success: 'green',
                    info: 'blue',
                    warning: 'orange',
                    error: 'red'
                };
                return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
            },
        },
    ];

    return (
        <div className="dashboard-content">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    marginBottom: 8,
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#262626'
                }}>
                    仪表板概览
                </h2>
                <p style={{
                    color: '#8c8c8c',
                    fontSize: '14px',
                    margin: 0
                }}>
                    欢迎回来，这里是您的数据概览
                </p>
            </div>

            {/* 统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic
                            title={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>总用户数</span>}
                            value={1128}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{
                                color: '#52c41a',
                                fontSize: '24px',
                                fontWeight: 600
                            }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                            <span style={{ color: '#52c41a', fontSize: '12px' }}>+12.5%</span>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic
                            title={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>活跃会话</span>}
                            value={93}
                            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{
                                color: '#1890ff',
                                fontSize: '24px',
                                fontWeight: 600
                            }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <EyeOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                            <span style={{ color: '#1890ff', fontSize: '12px' }}>实时数据</span>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic
                            title={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>已完成任务</span>}
                            value={856}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{
                                color: '#52c41a',
                                fontSize: '24px',
                                fontWeight: 600
                            }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Progress
                                percent={85}
                                size="small"
                                strokeColor="#52c41a"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic
                            title={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>待处理项目</span>}
                            value={23}
                            prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{
                                color: '#faad14',
                                fontSize: '24px',
                                fontWeight: 600
                            }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Progress
                                percent={23}
                                size="small"
                                strokeColor="#faad14"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 详细信息区域 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="最近活动"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <div className="responsive-table">
                            <Table
                                dataSource={recentActivities}
                                columns={tableColumns}
                                pagination={false}
                                rowKey="id"
                                size="small"
                                scroll={{ x: 400 }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <Card
                            title="系统状态"
                            style={{
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0'
                            }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>CPU使用率</span>
                                        <span>45%</span>
                                    </div>
                                    <Progress percent={45} strokeColor="#52c41a" size="small" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>内存使用率</span>
                                        <span>72%</span>
                                    </div>
                                    <Progress percent={72} strokeColor="#faad14" size="small" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>存储空间</span>
                                        <span>38%</span>
                                    </div>
                                    <Progress percent={38} strokeColor="#1890ff" size="small" />
                                </div>
                            </Space>
                        </Card>

                        <Card
                            title="快速操作"
                            style={{
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0'
                            }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size={8}>
                                <Tag
                                    color="blue"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        border: 'none',
                                        borderRadius: 6
                                    }}
                                >
                                    创建新项目
                                </Tag>
                                <Tag
                                    color="green"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        border: 'none',
                                        borderRadius: 6
                                    }}
                                >
                                    查看报告
                                </Tag>
                                <Tag
                                    color="orange"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        border: 'none',
                                        borderRadius: 6
                                    }}
                                >
                                    系统设置
                                </Tag>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>

            {/* 响应式样式 */}
            <style>
                {`
                .dashboard-content {
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .dashboard-content h2 {
                        font-size: 20px !important;
                        text-align: center;
                    }
                    
                    .ant-statistic-title {
                        font-size: 12px !important;
                    }
                    
                    .ant-statistic-content-value {
                        font-size: 20px !important;
                    }
                    
                    .ant-card-head-title {
                        font-size: 14px !important;
                    }
                    
                    .ant-table-thead > tr > th {
                        padding: 8px 4px !important;
                        font-size: 12px !important;
                    }
                    
                    .ant-table-tbody > tr > td {
                        padding: 8px 4px !important;
                        font-size: 12px !important;
                    }
                }

                @media (max-width: 575.98px) {
                    .dashboard-content {
                        margin: 0 -4px;
                    }
                    
                    .ant-col {
                        padding: 0 4px !important;
                    }
                    
                    .ant-card {
                        margin-bottom: 8px;
                    }
                    
                    .ant-card-body {
                        padding: 12px !important;
                    }
                    
                    .ant-statistic-content-value {
                        font-size: 18px !important;
                    }
                }

                @media (max-width: 480px) {
                    .responsive-table {
                        font-size: 11px;
                    }
                    
                    .ant-tag {
                        padding: 6px 8px !important;
                        font-size: 11px !important;
                    }
                }
            `}
            </style>
        </div>
    );
};

export default DashboardContent; 