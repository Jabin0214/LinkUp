import React from 'react';
import { Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ProjectsHeaderProps {
    isMobile: boolean;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ isMobile }) => {
    return (
        <div style={{
            textAlign: 'center',
            marginBottom: isMobile ? '24px' : '32px'
        }}>
            <Title
                level={isMobile ? 2 : 1}
                style={{
                    marginBottom: isMobile ? '12px' : '16px',
                    fontSize: isMobile ? '24px' : '32px',
                    color: 'var(--primary-color)'
                }}
            >
                <RocketOutlined style={{
                    marginRight: isMobile ? '8px' : '12px',
                    color: 'var(--primary-color)',
                    fontSize: isMobile ? '20px' : '24px'
                }} />
                Discover Amazing Projects
            </Title>
            <Paragraph style={{
                fontSize: isMobile ? '14px' : '16px',
                color: 'var(--text-color-secondary)',
                maxWidth: isMobile ? '100%' : '600px',
                margin: '0 auto',
                padding: isMobile ? '0 8px' : '0'
            }}>
                Find exciting collaborative projects and connect with like-minded partners to create something extraordinary
            </Paragraph>
        </div>
    );
};

export default ProjectsHeader; 