import axios from 'axios';

const API_URL = 'http://localhost:5006/api/Friend';

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
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params
    });
    return response.data;
}

// Send friend request
export async function sendFriendRequest(
    token: string,
    data: SendFriendRequestDto
): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/request`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Get friend requests (received or sent)
export async function getFriendRequests(
    token: string,
    type: 'received' | 'sent' = 'received'
): Promise<FriendRequestsResponse> {
    const response = await axios.get(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type }
    });
    return response.data;
}

// Respond to friend request
export async function respondToFriendRequest(
    token: string,
    data: RespondFriendRequestDto
): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/respond`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Remove friend
export async function removeFriend(
    token: string,
    friendId: number
): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Get mutual friends
export async function getMutualFriends(
    token: string,
    userId: number
): Promise<MutualFriendsResponse> {
    const response = await axios.get(`${API_URL}/mutual/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
} 