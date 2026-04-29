import { MOCK } from '@/config/mock';
import * as locationMock from '@/mocks/location';
import { apiClient } from './client';

export type RouteLocationResponse =
  | { state: 'LIVE'; lat: number; lng: number; updatedAt: string }
  | { state: 'NONE' };

export type MyStatusResponse = {
  isActive: boolean;
  routeId?: number;
  startTime?: string;
  endTime?: string;
  remainingSeconds?: number;
};

export async function getRouteLocation(routeId: number, token?: string): Promise<RouteLocationResponse> {
  if (MOCK.location) return locationMock.getRouteLocation(routeId);
  return apiClient.get<RouteLocationResponse>(`/location/route/${routeId}`, token);
}

export async function getMyStatus(token?: string): Promise<MyStatusResponse> {
  if (MOCK.location) return locationMock.getMyStatus();
  return apiClient.get<MyStatusResponse>('/location/my-status', token);
}

export async function startSharing(routeId: number, latitude: number, longitude: number, token?: string) {
  if (MOCK.location) return { isActive: true, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600_000).toISOString() };
  return apiClient.post('/location/start', { routeId, latitude, longitude }, token);
}

export async function stopSharing(token?: string) {
  if (MOCK.location) return null;
  return apiClient.post('/location/stop', {}, token);
}

// Mock only — 노선별 공유 인원 수. API 미구현, WebSocket STOMP로 추후 대체 예정
export async function getSharingCount(routeId: number): Promise<number> {
  if (MOCK.location) return locationMock.getSharingCount(routeId);
  return 0;
}
