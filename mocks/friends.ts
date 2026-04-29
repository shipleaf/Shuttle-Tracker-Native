import type {
  Friend,
  FriendRequest,
  SearchResult,
  SendRequestResponse,
} from '@/services/api/friends';

const FRIENDS: Friend[] = [
  { userId: 11, name: '민지', studentNumber: '2112345', isSharingLocation: true, currentRouteId: 1 },
  { userId: 12, name: '승호', studentNumber: '2112346', isSharingLocation: true, currentRouteId: 2 },
  { userId: 13, name: '나래', studentNumber: '2112347', isSharingLocation: true, currentRouteId: 1 },
  { userId: 14, name: '유리', studentNumber: '2112348', isSharingLocation: false, currentRouteId: null },
  { userId: 15, name: '재현', studentNumber: '2112349', isSharingLocation: false, currentRouteId: null },
];

const RECEIVED_REQUESTS: FriendRequest[] = [
  {
    friendshipId: 101,
    user: { userId: 21, name: '지수', studentNumber: '2112350' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    friendshipId: 102,
    user: { userId: 22, name: '현우', studentNumber: '2112351' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export function getFriends(): Friend[] {
  return [...FRIENDS];
}

export function getReceivedRequests(): FriendRequest[] {
  return [...RECEIVED_REQUESTS];
}

export function getSentRequests(): FriendRequest[] {
  return [];
}

export function sendFriendRequest(targetStudentNumber: string): SendRequestResponse {
  return { friendshipId: 200, status: 'PENDING' };
}

export function acceptRequest(_friendshipId: number): null {
  return null;
}

export function rejectRequest(_friendshipId: number): null {
  return null;
}

export function deleteFriend(_userId: number): null {
  return null;
}

export function searchFriends(keyword: string): SearchResult[] {
  if (!keyword || keyword.length < 2) return [];
  return FRIENDS.filter(
    (f) => f.name.includes(keyword) || f.studentNumber.includes(keyword)
  ).map((f) => ({ userId: f.userId, name: f.name, studentNumber: f.studentNumber, friendshipStatus: 'ACCEPTED' as const }));
}
