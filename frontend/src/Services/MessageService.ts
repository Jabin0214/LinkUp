import { getCurrentToken, isUserAuthenticated } from '../utils/authUtils';
import { API_CONFIG } from '../config/api';
import HttpClient from '../utils/httpClient';

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
    const result = await HttpClient.postWithAuth<ApiResponse<MessageDto>>(
        API_CONFIG.ENDPOINTS.MESSAGE.SEND,
        request,
        token
    );
    return result.data!;
};

// 获取对话消息
export const getConversation = async (
    token: string,
    userId: number,
    page: number = 1,
    pageSize: number = 50
): Promise<MessageDto[]> => {
    const result = await HttpClient.getWithAuth<ApiResponse<MessageDto[]>>(
        API_CONFIG.ENDPOINTS.MESSAGE.CONVERSATION(userId),
        token,
        { params: { page, pageSize } }
    );
    return result.data!;
};

// 获取对话列表
export const getConversations = async (
    token: string,
    page: number = 1,
    pageSize: number = 20
): Promise<ConversationDto[]> => {
    const result = await HttpClient.getWithAuth<ApiResponse<ConversationDto[]>>(
        API_CONFIG.ENDPOINTS.MESSAGE.CONVERSATIONS,
        token,
        { params: { page, pageSize } }
    );
    return result.data!;
};

// 标记消息为已读
export const markAsRead = async (token: string, messageId: number): Promise<void> => {
    await HttpClient.postWithAuth<void>(
        API_CONFIG.ENDPOINTS.MESSAGE.MARK_READ(messageId),
        {},
        token
    );
};

// 获取未读消息数量
export const getUnreadCount = async (token: string): Promise<number> => {
    const result = await HttpClient.getWithAuth<ApiResponse<{ count: number }>>(
        API_CONFIG.ENDPOINTS.MESSAGE.UNREAD_COUNT,
        token
    );
    return result.data!.count;
}; 