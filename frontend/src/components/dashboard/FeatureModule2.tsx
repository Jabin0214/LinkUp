import React from 'react';
import { Card, Table, Tag, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

const FeatureModule2: React.FC = () => {
    const dataSource = [
        {
            key: '1',
            name: 'Project Alpha',
            status: 'Active',
            progress: 75,
            priority: 'High',
        },
        {
            key: '2',
            name: 'Project Beta',
            status: 'Pending',
            progress: 30,
            priority: 'Medium',
        },
        {
            key: '3',
            name: 'Project Gamma',
            status: 'Completed',
            progress: 100,
            priority: 'Low',
        },
    ];

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'green';
                if (status === 'Pending') color = 'orange';
                if (status === 'Completed') color = 'blue';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress: number) => `${progress}%`,
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                let color = 'red';
                if (priority === 'Medium') color = 'orange';
                if (priority === 'Low') color = 'green';
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Button.Group>
                    <Button size="small" icon={<DownloadOutlined />}>Export</Button>
                    <Button size="small" icon={<UploadOutlined />}>Import</Button>
                </Button.Group>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2>Feature Module 2</h2>
                <Button type="primary" icon={<UploadOutlined />}>
                    Import Data
                </Button>
            </div>

            <Card title="Project Management">
                <p>This is the second feature module's blank interface for future development iterations.</p>
                <p>This module demonstrates a table-based interface with:</p>
                <ul>
                    <li>Data tables with sorting and filtering</li>
                    <li>Status indicators and progress tracking</li>
                    <li>Priority management</li>
                    <li>Import/Export functionality</li>
                </ul>
            </Card>

            <Card title="Project List" style={{ marginTop: 16 }}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default FeatureModule2; 