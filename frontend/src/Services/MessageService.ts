import { getCurrentToken, isUserAuthenticated } from '../utils/authUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';

export interface MessageDto {
    id: number;
    senderId: number;
    receiverId: number;
    senderName: string;
    receiverName: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    readAt?: string;
}

export interface SendMessageRequest {
    receiverId: number;
    content: string;
}

export interface ConversationDto {
    userId: number;
    userName: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

// 发送消息
export const sendMessage = async (token: string, request: SendMessageRequest): Promise<MessageDto> => {
    const response = await fetch(`${API_BASE_URL}/Message/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
    }

    const result: ApiResponse<MessageDto> = await response.json();
    return result.data!;
};

// 获取对话消息
export const getConversation = async (
    token: string,
    userId: number,
    page: number = 1,
    pageSize: number = 50
): Promise<MessageDto[]> => {
    const response = await fetch(
        `${API_BASE_URL}/Message/conversation/${userId}?page=${page}&pageSize=${pageSize}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get conversation');
    }

    const result: ApiResponse<MessageDto[]> = await response.json();
    return result.data!;
};

// 获取对话列表
export const getConversations = async (
    token: string,
    page: number = 1,
    pageSize: number = 20
): Promise<ConversationDto[]> => {
    const response = await fetch(
        `${API_BASE_URL}/Message/conversations?page=${page}&pageSize=${pageSize}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get conversations');
    }

    const result: ApiResponse<ConversationDto[]> = await response.json();
    return result.data!;
};

// 标记消息为已读
export const markAsRead = async (token: string, messageId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Message/mark-read/${messageId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark message as read');
    }
};

// 获取未读消息数量
export const getUnreadCount = async (token: string): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/Message/unread-count`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get unread count');
    }

    const result: ApiResponse<{ count: number }> = await response.json();
    return result.data!.count;
}; 