import React, { useMemo } from 'react';
import {
    Input,
    Select,
    Row,
    Col,
    Typography,
    Space,
    Button,
    Card,
    Tag,
    Divider
} from 'antd';
import {
    SearchOutlined,
    ClearOutlined,
    FolderOutlined,
    StarOutlined
} from '@ant-design/icons';
import { PROJECT_CATEGORIES, COMMON_SKILLS } from '../../Services/ProjectService';

const { Text } = Typography;
const { Option } = Select;

interface ProjectsSearchProps {
    keyword: string;
    selectedCategory: string;
    selectedStatus: string;
    selectedSkills: string[];
    isMobile: boolean;
    onKeywordChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSkillToggle: (skill: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

// 样式常量
const SEARCH_STYLES = {
    card: {
        marginBottom: '24px',
        borderRadius: (isMobile: boolean) => isMobile ? '8px' : '12px'
    },
    label: (isMobile: boolean) => ({
        display: 'block',
        marginBottom: '8px',
        fontSize: isMobile ? '13px' : '14px',
        color: 'var(--text-color-secondary)'
    }),
    input: {
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-color)'
    },
    buttonContainer: (isMobile: boolean) => ({
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
        marginTop: isMobile ? '0' : '29px',
        justifyContent: isMobile ? 'stretch' : 'flex-start'
    }),
    skillsContainer: (isMobile: boolean) => ({
        maxHeight: isMobile ? '120px' : 'none',
        overflowY: isMobile ? 'auto' as const : 'visible' as const
    }),
    skillTag: (isMobile: boolean) => ({
        fontSize: isMobile ? '12px' : '13px',
        padding: isMobile ? '2px 8px' : '4px 12px',
        color: 'var(--text-color-secondary)'
    })
} as const;

const ProjectsSearch: React.FC<ProjectsSearchProps> = ({
    keyword,
    selectedCategory,
    selectedStatus,
    selectedSkills,
    isMobile,
    onKeywordChange,
    onCategoryChange,
    onStatusChange,
    onSkillToggle,
    onSearch,
    onClear
}) => {
    // 缓存样式对象
    const styles = useMemo(() => ({
        card: { ...SEARCH_STYLES.card, borderRadius: SEARCH_STYLES.card.borderRadius(isMobile) },
        label: SEARCH_STYLES.label(isMobile),
        buttonContainer: SEARCH_STYLES.buttonContainer(isMobile),
        skillsContainer: SEARCH_STYLES.skillsContainer(isMobile),
        skillTag: SEARCH_STYLES.skillTag(isMobile)
    }), [isMobile]);

    return (
        <>
            <style>
                {`
                    .custom-select .ant-select-selector {
                        background-color: var(--card-background) !important;
                        border-color: var(--border-color) !important;
                        color: var(--text-color) !important;
                    }
                    .custom-select .ant-select-selection-placeholder {
                        color: var(--text-color-secondary) !important;
                    }
                    .custom-select .ant-select-arrow {
                        color: var(--text-color-secondary) !important;
                    }
                    .custom-select .ant-select-clear {
                        color: var(--text-color-secondary) !important;
                        background-color: transparent !important;
                        opacity: 1 !important;
                    }
                    .custom-select .ant-select-clear * {
                        color: var(--text-color-secondary) !important;
                        fill: var(--text-color-secondary) !important;
                    }
                    .custom-select .ant-select-clear:hover {
                        color: var(--text-color) !important;
                        background-color: var(--hover-background) !important;
                    }
                    .custom-select .ant-select-clear:hover * {
                        color: var(--text-color) !important;
                        fill: var(--text-color) !important;
                    }
                `}
            </style>
            <Card style={styles.card}>
                <Row gutter={[isMobile ? 12 : 16, isMobile ? 16 : 16]}>
                    {/* 搜索框 */}
                    <Col xs={24} sm={12} md={7} lg={6}>
                        <div>
                            <Text strong style={styles.label}>
                                <SearchOutlined style={{ marginRight: '4px' }} />
                                Search Projects
                            </Text>
                            <Input
                                placeholder="Enter keywords..."
                                value={keyword}
                                onChange={(e) => onKeywordChange(e.target.value)}
                                onPressEnter={onSearch}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                                style={SEARCH_STYLES.input}
                            />
                        </div>
                    </Col>

                    {/* 分类 */}
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <div>
                            <Text strong style={styles.label}>
                                <FolderOutlined style={{ marginRight: '4px' }} />
                                Category
                            </Text>
                            <Select
                                placeholder="All Categories"
                                className="custom-select"
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                onChange={onCategoryChange}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                            >
                                {PROJECT_CATEGORIES.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>

                    {/* 状态 */}
                    <Col xs={24} sm={12} md={5} lg={4}>
                        <div>
                            <Text strong style={styles.label}>
                                <StarOutlined style={{ marginRight: '4px' }} />
                                Status
                            </Text>
                            <Select
                                placeholder="All Status"
                                className="custom-select"
                                style={{ width: '100%' }}
                                value={selectedStatus}
                                onChange={onStatusChange}
                                allowClear
                                size={isMobile ? 'middle' : 'middle'}
                            >
                                <Option value="Recruiting">Recruiting</Option>
                                <Option value="InProgress">In Progress</Option>
                                <Option value="Completed">Completed</Option>
                            </Select>
                        </div>
                    </Col>

                    {/* 操作按钮 */}
                    <Col xs={24} sm={12} md={7} lg={5}>
                        <div style={styles.buttonContainer}>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={onSearch}
                                size={isMobile ? 'middle' : 'middle'}
                                style={{ flex: isMobile ? 1 : 'none' }}
                            >
                                Search
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={onClear}
                                size={isMobile ? 'middle' : 'middle'}
                                style={{ flex: isMobile ? 1 : 'none' }}
                            >
                                Clear
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Skills Filter */}
                <Divider style={{ margin: isMobile ? '16px 0' : '24px 0' }} />
                <div>
                    <Text strong style={styles.label}>
                        Required Skills
                    </Text>
                    <div style={styles.skillsContainer}>
                        <Space size={[0, 8]} wrap>
                            {COMMON_SKILLS.map(skill => (
                                <Tag.CheckableTag
                                    key={skill}
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => onSkillToggle(skill)}
                                    style={styles.skillTag}
                                >
                                    {skill}
                                </Tag.CheckableTag>
                            ))}
                        </Space>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ProjectsSearch; 