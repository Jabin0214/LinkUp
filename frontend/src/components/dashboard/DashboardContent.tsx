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
            dashboard content  
        </div>
    );
};

export default DashboardContent; 