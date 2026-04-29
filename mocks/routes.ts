import type { Route, RouteDetail } from '@/services/api/routes';

export const mockRoutes: Route[] = [
  { routeId: 1, region: '광주', routeNumber: 1, routeName: '광주 1호차', description: '효덕초 ↔ SSAFY' },
  { routeId: 2, region: '광주', routeNumber: 2, routeName: '광주 2호차', description: '광천터미널 ↔ SSAFY' },
  { routeId: 3, region: '광주', routeNumber: 3, routeName: '광주 3호차', description: '상무지구 ↔ SSAFY' },
  { routeId: 4, region: '광주', routeNumber: 4, routeName: '광주 4호차', description: '첨단지구 ↔ SSAFY' },
];

const SSAFY = { lat: 35.1796, lng: 126.9037 };

const routeDetails: Record<number, RouteDetail> = {
  1: {
    route: mockRoutes[0],
    stops: [
      { stopId: 11, stopName: '효덕초 후문 앞', lat: 35.1128, lng: 126.8970, sequence: 1, isTerminal: false },
      { stopId: 12, stopName: '광천터미널', lat: 35.1450, lng: 126.8870, sequence: 2, isTerminal: false },
      { stopId: 13, stopName: '상무사거리', lat: 35.1530, lng: 126.8530, sequence: 3, isTerminal: false },
      { stopId: 14, stopName: 'SSAFY 광주', lat: SSAFY.lat, lng: SSAFY.lng, sequence: 4, isTerminal: true },
    ],
    polyline: [
      { lat: 35.1128, lng: 126.8970 },
      { lat: 35.1280, lng: 126.8920 },
      { lat: 35.1450, lng: 126.8870 },
      { lat: 35.1490, lng: 126.8710 },
      { lat: 35.1530, lng: 126.8530 },
      { lat: 35.1620, lng: 126.8680 },
      { lat: SSAFY.lat, lng: SSAFY.lng },
    ],
  },
  2: {
    route: mockRoutes[1],
    stops: [
      { stopId: 21, stopName: '학동', lat: 35.1450, lng: 126.9320, sequence: 1, isTerminal: false },
      { stopId: 22, stopName: '조선대 후문', lat: 35.1380, lng: 126.9220, sequence: 2, isTerminal: false },
      { stopId: 23, stopName: '충장로', lat: 35.1490, lng: 126.9160, sequence: 3, isTerminal: false },
      { stopId: 24, stopName: 'SSAFY 광주', lat: SSAFY.lat, lng: SSAFY.lng, sequence: 4, isTerminal: true },
    ],
    polyline: [
      { lat: 35.1450, lng: 126.9320 },
      { lat: 35.1380, lng: 126.9220 },
      { lat: 35.1490, lng: 126.9160 },
      { lat: 35.1620, lng: 126.9100 },
      { lat: SSAFY.lat, lng: SSAFY.lng },
    ],
  },
  3: {
    route: mockRoutes[2],
    stops: [
      { stopId: 31, stopName: '쌍촌역', lat: 35.1540, lng: 126.8410, sequence: 1, isTerminal: false },
      { stopId: 32, stopName: '풍암지구', lat: 35.1330, lng: 126.8560, sequence: 2, isTerminal: false },
      { stopId: 33, stopName: '서광주역', lat: 35.1250, lng: 126.8780, sequence: 3, isTerminal: false },
      { stopId: 34, stopName: 'SSAFY 광주', lat: SSAFY.lat, lng: SSAFY.lng, sequence: 4, isTerminal: true },
    ],
    polyline: [
      { lat: 35.1540, lng: 126.8410 },
      { lat: 35.1330, lng: 126.8560 },
      { lat: 35.1250, lng: 126.8780 },
      { lat: 35.1490, lng: 126.8920 },
      { lat: SSAFY.lat, lng: SSAFY.lng },
    ],
  },
  4: {
    route: mockRoutes[3],
    stops: [
      { stopId: 41, stopName: '첨단지구', lat: 35.2140, lng: 126.8420, sequence: 1, isTerminal: false },
      { stopId: 42, stopName: '수완지구', lat: 35.1890, lng: 126.8140, sequence: 2, isTerminal: false },
      { stopId: 43, stopName: '유덕고', lat: 35.1760, lng: 126.8560, sequence: 3, isTerminal: false },
      { stopId: 44, stopName: 'SSAFY 광주', lat: SSAFY.lat, lng: SSAFY.lng, sequence: 4, isTerminal: true },
    ],
    polyline: [
      { lat: 35.2140, lng: 126.8420 },
      { lat: 35.1890, lng: 126.8140 },
      { lat: 35.1760, lng: 126.8560 },
      { lat: 35.1780, lng: 126.8780 },
      { lat: SSAFY.lat, lng: SSAFY.lng },
    ],
  },
};

export function getRoutes(_region?: string): Route[] {
  return mockRoutes;
}

export function getRoute(routeId: number): RouteDetail {
  const detail = routeDetails[routeId];
  if (!detail) throw new Error('존재하지 않는 노선입니다.');
  return detail;
}

export function getRouteStops(routeId: number) {
  return getRoute(routeId).stops;
}
