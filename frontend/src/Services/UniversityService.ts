import axios, { AxiosError } from 'axios';
import { API_CONFIG, buildApiUrl } from '../config/api';

export interface University {
    label: string;
    value: string;
    country: string;
    website?: string;
}

export async function searchUniversities(searchTerm: string): Promise<University[]> {
    if (!searchTerm || searchTerm.length < 2) {
        return [];
    }

    try {
        const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.USER.UNIVERSITIES), {
            params: {
                searchTerm
            },
            timeout: 10000 // 10秒超时
        });

        if (response.data?.success && Array.isArray(response.data.data)) {
            return response.data.data.map((uni: any) => ({
                label: `${uni.name} (${uni.country})`,
                value: uni.name,
                country: uni.country,
                website: uni.webPages?.[0]
            }));
        }

        console.warn('Unexpected API response format:', response.data);
        return [];
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Failed to fetch universities:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            error: axiosError.message
        });

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