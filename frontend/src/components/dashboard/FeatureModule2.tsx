import React, { useState } from 'react';
import { Card, Row, Col, Progress, Select, DatePicker, Space, Statistic, Tabs, Table, Tag } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const FeatureModule2: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(false);

    // 模拟数据
    const analyticsData = {
        visitors: 15420,
        pageViews: 45680,
        bounceRate: 24.5,
        avgSession: 185,
        conversionRate: 3.2,
        revenue: 89560
    };

    const topPages = [
        { id: 1, path: '/dashboard', views: 12450, uniqueVisitors: 8920, bounceRate: 18.5 },
        { id: 2, path: '/products', views: 9860, uniqueVisitors: 7140, bounceRate: 22.3 },
        { id: 3, path: '/login', views: 8750, uniqueVisitors: 8750, bounceRate: 45.2 },
        { id: 4, path: '/about', views: 6420, uniqueVisitors: 5890, bounceRate: 15.8 },
        { id: 5, path: '/contact', views: 4320, uniqueVisitors: 3980, bounceRate: 28.9 }
    ];

    const trafficSources = [
        { source: '直接访问', percentage: 45.2, visitors: 6980 },
        { source: '搜索引擎', percentage: 32.8, visitors: 5060 },
        { source: '社交媒体', percentage: 15.6, visitors: 2408 },
        { source: '邮件营销', percentage: 4.2, visitors: 648 },
        { source: '其他', percentage: 2.2, visitors: 340 }
    ];

    const pageColumns = [
        {
            title: '页面路径',
            dataIndex: 'path',
            key: 'path',
            render: (path: string) => <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{path}</code>
        },
        {
            title: '页面浏览量',
            dataIndex: 'views',
            key: 'views',
            render: (views: number) => views.toLocaleString(),
            responsive: ['md'] as any
        },
        {
            title: '独立访客',
            dataIndex: 'uniqueVisitors',
            key: 'uniqueVisitors',
            render: (visitors: number) => visitors.toLocaleString()
        },
        {
            title: '跳出率',
            dataIndex: 'bounceRate',
            key: 'bounceRate',
            render: (rate: number) => (
                <Tag color={rate > 30 ? 'red' : rate > 20 ? 'orange' : 'green'}>
                    {rate}%
                </Tag>
            )
        }
    ];

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="feature-module-2">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    marginBottom: 8,
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#262626'
                }}>
                    数据分析中心
                </h2>
                <p style={{
                    color: '#8c8c8c',
                    fontSize: '14px',
                    margin: 0
                }}>
                    网站流量和用户行为分析
                </p>
            </div>

            {/* 控制面板 */}
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
                        <Select
                            value={timeRange}
                            onChange={setTimeRange}
                            style={{ width: '100%' }}
                            placeholder="选择时间范围"
                        >
                            <Option value="today">今天</Option>
                            <Option value="week">本周</Option>
                            <Option value="month">本月</Option>
                            <Option value="quarter">本季度</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={10}>
                        <RangePicker style={{ width: '100%' }} />
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
                            <button
                                onClick={handleRefresh}
                                style={{
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 6,
                                    padding: '8px 16px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                <ReloadOutlined spin={loading} />
                                刷新
                            </button>
                            <button
                                style={{
                                    border: '1px solid #1890ff',
                                    borderRadius: 6,
                                    padding: '8px 16px',
                                    background: '#1890ff',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                <DownloadOutlined />
                                导出
                            </button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* 核心指标 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="访客数"
                            value={analyticsData.visitors}
                            precision={0}
                            valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="页面浏览量"
                            value={analyticsData.pageViews}
                            precision={0}
                            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                            prefix={<LineChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="跳出率"
                            value={analyticsData.bounceRate}
                            precision={1}
                            suffix="%"
                            valueStyle={{ color: '#faad14', fontSize: '20px' }}
                            prefix={<PieChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="平均会话时长"
                            value={analyticsData.avgSession}
                            precision={0}
                            suffix="秒"
                            valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="转化率"
                            value={analyticsData.conversionRate}
                            precision={2}
                            suffix="%"
                            valueStyle={{ color: '#13c2c2', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} lg={4}>
                    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
                        <Statistic
                            title="收入"
                            value={analyticsData.revenue}
                            precision={0}
                            prefix="¥"
                            valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 详细分析 */}
            <Card
                style={{
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="流量来源" key="traffic">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="流量来源分析" size="small">
                                    {trafficSources.map((source, index) => (
                                        <div key={index} style={{ marginBottom: 16 }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 8
                                            }}>
                                                <span>{source.source}</span>
                                                <span>{source.percentage}%</span>
                                            </div>
                                            <Progress
                                                percent={source.percentage}
                                                strokeColor={
                                                    index === 0 ? '#1890ff' :
                                                        index === 1 ? '#52c41a' :
                                                            index === 2 ? '#faad14' :
                                                                index === 3 ? '#722ed1' : '#f5222d'
                                                }
                                                size="small"
                                            />
                                            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 4 }}>
                                                访客数: {source.visitors.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="趋势图表" size="small">
                                    <div style={{
                                        height: 300,
                                        background: '#fafafa',
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#8c8c8c'
                                    }}>
                                        图表占位符<br />
                                        (可集成Chart.js或ECharts)
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="页面分析" key="pages">
                        <Card title="热门页面" size="small">
                            <div className="responsive-table">
                                <Table
                                    dataSource={topPages}
                                    columns={pageColumns}
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: false,
                                        showQuickJumper: true,
                                        responsive: true
                                    }}
                                    rowKey="id"
                                    size="small"
                                    scroll={{ x: 500 }}
                                />
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            </Card>

            {/* 响应式样式 */}
            <style>
                {`
                .feature-module-2 {
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .feature-module-2 h2 {
                        font-size: 20px !important;
                        text-align: center;
                    }
                    
                    .ant-statistic-title {
                        font-size: 12px !important;
                    }
                    
                    .ant-statistic-content-value {
                        font-size: 16px !important;
                    }
                    
                    .ant-card-head-title {
                        font-size: 14px !important;
                    }
                    
                    .ant-tabs-tab {
                        padding: 8px 12px !important;
                        font-size: 14px !important;
                    }
                }

                @media (max-width: 575.98px) {
                    .feature-module-2 {
                        margin: 0 -4px;
                    }
                    
                    .ant-col {
                        padding: 0 4px !important;
                        margin-bottom: 8px;
                    }
                    
                    .ant-card {
                        margin-bottom: 8px;
                        border-radius: 6px !important;
                    }
                    
                    .ant-card-body {
                        padding: 12px !important;
                    }
                    
                    .ant-statistic-content-value {
                        font-size: 14px !important;
                    }
                    
                    .ant-progress-text {
                        font-size: 10px !important;
                    }
                    
                    .ant-table-thead > tr > th {
                        padding: 8px 4px !important;
                        font-size: 11px !important;
                    }
                    
                    .ant-table-tbody > tr > td {
                        padding: 8px 4px !important;
                        font-size: 11px !important;
                    }
                }

                @media (max-width: 480px) {
                    .ant-space {
                        flex-wrap: wrap;
                        justify-content: center !important;
                    }
                    
                    .ant-tabs-tab {
                        padding: 6px 8px !important;
                        font-size: 12px !important;
                    }
                    
                    button {
                        font-size: 12px !important;
                        padding: 6px 12px !important;
                    }
                }
            `}
            </style>
        </div>
    );
};

export default FeatureModule2; 