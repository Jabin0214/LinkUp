import { API_CONFIG } from '../config/api';
import HttpClient from '../utils/httpClient';

export interface FriendInfo {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    university?: string;
    friendSince: string;
    isOnline: boolean;
}

export interface FriendRequestInfo {
    id: number;
    senderId: number;
    senderUsername: string;
    senderFirstName: string;
    senderLastName: string;
    senderUniversity?: string;
    message?: string;
    status: string;
    createdAt: string;
}

export interface FriendsResponse {
    friends: FriendInfo[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

export interface FriendRequestsResponse {
    requests: FriendRequestInfo[];
}

export interface MutualFriendsResponse {
    mutualFriends: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        university?: string;
    }[];
    count: number;
}

export interface SendFriendRequestDto {
    receiverId: number;
    message?: string;
}

export interface RespondFriendRequestDto {
    requestId: number;
    action: 'accept' | 'reject';
}

// Get friends list
export async function getFriends(
    token: string,
    params: {
        page?: number;
        size?: number;
        search?: string;
    } = {}
): Promise<FriendsResponse> {
    return await HttpClient.getWithAuth<FriendsResponse>(
        API_CONFIG.ENDPOINTS.FRIEND.BASE,
        token,
        { params }
    );
}

// Send friend request
export async function sendFriendRequest(
    token: string,
    data: SendFriendRequestDto
): Promise<{ message: string }> {
    return await HttpClient.postWithAuth<{ message: string }>(
        API_CONFIG.ENDPOINTS.FRIEND.REQUEST,
        data,
        token
    );
}

// Get friend requests (received or sent)
export async function getFriendRequests(
    token: string,
    type: 'received' | 'sent' = 'received'
): Promise<FriendRequestsResponse> {
    return await HttpClient.getWithAuth<FriendRequestsResponse>(
        API_CONFIG.ENDPOINTS.FRIEND.REQUESTS,
        token,
        { params: { type } }
    );
}

// Respond to friend request
export async function respondToFriendRequest(
    token: string,
    data: RespondFriendRequestDto
): Promise<{ message: string }> {
    return await HttpClient.postWithAuth<{ message: string }>(
        API_CONFIG.ENDPOINTS.FRIEND.RESPOND,
        data,
        token
    );
}

// Remove friend
export async function removeFriend(
    token: string,
    friendId: number
): Promise<{ message: string }> {
    return await HttpClient.deleteWithAuth<{ message: string }>(
        API_CONFIG.ENDPOINTS.FRIEND.REMOVE(friendId),
        token
    );
}

// Get mutual friends
export async function getMutualFriends(
    token: string,
    userId: number
): Promise<MutualFriendsResponse> {
    return await HttpClient.getWithAuth<MutualFriendsResponse>(
        API_CONFIG.ENDPOINTS.FRIEND.MUTUAL(userId),
        token
    );
} 