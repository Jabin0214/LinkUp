// 项目相关的工具函数

/**
 * 获取项目状态对应的颜色
 */
export const getProjectStatusColor = (status: string): string => {
    switch (status) {
        case 'Recruiting': return 'success';
        case 'InProgress': return 'processing';
        case 'Completed': return 'default';
        case 'Cancelled': return 'error';
        default: return 'default';
    }
};

/**
 * 获取项目状态的显示文本
 */
export const getProjectStatusText = (status: string): string => {
    switch (status) {
        case 'Recruiting': return 'Recruiting';
        case 'InProgress': return 'In Progress';
        case 'Completed': return 'Completed';
        case 'Cancelled': return 'Cancelled';
        default: return status;
    }
};

/**
 * 格式化日期显示
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 * 截取技能数组用于显示
 */
export const truncateSkills = (skills: string[], maxCount: number = 3) => {
    const visibleSkills = skills.slice(0, maxCount);
    const remainingCount = skills.length - maxCount;
    return {
        visibleSkills,
        remainingCount: remainingCount > 0 ? remainingCount : 0,
        hasMore: remainingCount > 0
    };
}; 