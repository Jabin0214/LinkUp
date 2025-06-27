import axios from 'axios';

export interface University {
    label: string;
    value: string;
    country: string;
    website?: string;
}

// 使用公开的大学API
const UNIVERSITY_API_URL = 'http://universities.hipolabs.com/search';

export async function searchUniversities(searchTerm: string): Promise<University[]> {
    if (!searchTerm || searchTerm.length < 2) {
        return [];
    }

    try {
        const response = await axios.get(UNIVERSITY_API_URL, {
            params: {
                name: searchTerm,
                limit: 20 // 限制返回结果数量
            },
            timeout: 5000 // 5秒超时
        });

        const universities = response.data || [];

        return universities.map((uni: any) => ({
            label: `${uni.name} (${uni.country})`,
            value: uni.name,
            country: uni.country,
            website: uni.web_pages?.[0]
        }));
    } catch (error) {
        console.error('Failed to fetch universities:', error);

        // 如果API失败，返回一些常见大学作为备选
        const fallbackUniversities = [
            'Harvard University',
            'Stanford University',
            'Massachusetts Institute of Technology',
            'University of Oxford',
            'University of Cambridge',
            'Beijing University',
            'Tsinghua University',
            'Other'
        ];

        return fallbackUniversities
            .filter(uni => uni.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(uni => ({
                label: uni,
                value: uni,
                country: 'Various'
            }));
    }
} 