import React from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const FeatureModule1: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2>Feature Module 1</h2>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add New Item
                </Button>
            </div>

            <Card title="Module Overview">
                <p>This is the first feature module's blank interface for future development iterations.</p>
                <p>You can implement features such as:</p>
                <ul>
                    <li>Data management</li>
                    <li>CRUD operations</li>
                    <li>Data visualization</li>
                    <li>Import/Export functionality</li>
                </ul>
            </Card>

            <Card title="Sample Data" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <span>Sample Item 1</span>
                    <Space>
                        <Button size="small" icon={<EditOutlined />}>Edit</Button>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Space>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <span>Sample Item 2</span>
                    <Space>
                        <Button size="small" icon={<EditOutlined />}>Edit</Button>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Space>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <span>Sample Item 3</span>
                    <Space>
                        <Button size="small" icon={<EditOutlined />}>Edit</Button>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default FeatureModule1; 