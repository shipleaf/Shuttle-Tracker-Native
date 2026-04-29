import type { RouteLocationResponse, MyStatusResponse } from '@/services/api/location';

const busPositions: Record<number, { lat: number; lng: number }> = {
  1: { lat: 35.1080, lng: 126.8940 },
  2: { lat: 35.1400, lng: 126.9280 },
  3: { lat: 35.1480, lng: 126.8490 },
  4: { lat: 35.2060, lng: 126.8380 },
};

export function getRouteLocation(routeId: number): RouteLocationResponse {
  const pos = busPositions[routeId];
  if (!pos) return { state: 'NONE' };
  return { state: 'LIVE', lat: pos.lat, lng: pos.lng, updatedAt: new Date().toISOString() };
}

export function getMyStatus(): MyStatusResponse {
  return { isActive: false };
}

// Mock only — 노선별 공유 인원. 실제 API 없음, WebSocket STOMP로 추후 대체 예정
export function getSharingCount(_routeId: number): number {
  return 3;
}
