import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const DashboardContent: React.FC = () => {
    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={1128}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Sessions"
                            value={93}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Completed Tasks"
                            value={1128}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Items"
                            value={93}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Recent Activity" style={{ height: 300 }}>
                        <p>This is a dashboard interface where you can add various statistics and quick actions.</p>
                        <p>You can customize this area to show:</p>
                        <ul>
                            <li>Recent user activities</li>
                            <li>System notifications</li>
                            <li>Quick action buttons</li>
                            <li>Charts and graphs</li>
                        </ul>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Quick Actions" style={{ height: 300 }}>
                        <p>Add your most frequently used actions here:</p>
                        <ul>
                            <li>Create new items</li>
                            <li>Generate reports</li>
                            <li>System settings</li>
                            <li>User management</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardContent; 