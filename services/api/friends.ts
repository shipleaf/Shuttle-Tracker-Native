import { MOCK } from '@/config/mock';
import * as friendsMock from '@/mocks/friends';
import { apiClient } from './client';

export type Friend = {
  userId: number;
  name: string;
  studentNumber: string;
  isSharingLocation: boolean;
  currentRouteId: number | null;
};

export type FriendRequest = {
  friendshipId: number;
  user: { userId: number; name: string; studentNumber: string };
  createdAt: string;
};

export type SearchResult = {
  userId: number;
  name: string;
  studentNumber: string;
  friendshipStatus: 'NONE' | 'PENDING' | 'ACCEPTED';
};

export type SendRequestResponse = {
  friendshipId: number;
  status: 'PENDING';
};

export async function getFriends(): Promise<Friend[]> {
  if (MOCK.friends) return friendsMock.getFriends();
  return apiClient.get<Friend[]>('/friends');
}

export async function getReceivedRequests(): Promise<FriendRequest[]> {
  if (MOCK.friends) return friendsMock.getReceivedRequests();
  return apiClient.get<FriendRequest[]>('/friends/requests/received');
}

export async function getSentRequests(): Promise<FriendRequest[]> {
  if (MOCK.friends) return friendsMock.getSentRequests();
  return apiClient.get<FriendRequest[]>('/friends/requests/sent');
}

export async function sendFriendRequest(targetStudentNumber: string): Promise<SendRequestResponse> {
  if (MOCK.friends) return friendsMock.sendFriendRequest(targetStudentNumber);
  return apiClient.post<SendRequestResponse>('/friends/requests', { targetStudentNumber });
}

export async function acceptRequest(friendshipId: number): Promise<null> {
  if (MOCK.friends) return friendsMock.acceptRequest(friendshipId);
  return apiClient.post<null>(`/friends/requests/${friendshipId}/accept`, {});
}

export async function rejectRequest(friendshipId: number): Promise<null> {
  if (MOCK.friends) return friendsMock.rejectRequest(friendshipId);
  return apiClient.post<null>(`/friends/requests/${friendshipId}/reject`, {});
}

export async function deleteFriend(userId: number): Promise<null> {
  if (MOCK.friends) return friendsMock.deleteFriend(userId);
  return apiClient.delete<null>(`/friends/${userId}`);
}

export async function searchFriends(keyword: string): Promise<SearchResult[]> {
  if (MOCK.friends) return friendsMock.searchFriends(keyword);
  return apiClient.get<SearchResult[]>(`/friends/search?keyword=${encodeURIComponent(keyword)}`);
}
