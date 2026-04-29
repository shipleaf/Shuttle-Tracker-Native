import type { ArrivalTimeResponse } from '@/services/api/shuttle';

const addMinutes = (m: number) =>
  new Date(Date.now() + m * 60_000).toISOString();

const mockData: Record<number, ArrivalTimeResponse> = {
  1: {
    routeName: '광주 1호차',
    stops: [
      { stopId: 11, stopName: '효덕초 후문 앞', sequence: 1, etaSeconds: 720, distanceMeters: 420, expectedArrival: addMinutes(12), status: 'UPCOMING' },
      { stopId: 12, stopName: '광천터미널', sequence: 2, etaSeconds: 1080, distanceMeters: 2800, expectedArrival: addMinutes(18), status: 'UPCOMING' },
      { stopId: 13, stopName: '상무사거리', sequence: 3, etaSeconds: 1440, distanceMeters: 5100, expectedArrival: addMinutes(24), status: 'UPCOMING' },
      { stopId: 14, stopName: 'SSAFY 광주', sequence: 4, etaSeconds: 1800, distanceMeters: 8500, expectedArrival: addMinutes(30), status: 'UPCOMING' },
    ],
    fallback: false,
  },
  2: {
    routeName: '광주 2호차',
    stops: [
      { stopId: 21, stopName: '학동', sequence: 1, etaSeconds: 480, distanceMeters: 310, expectedArrival: addMinutes(8), status: 'UPCOMING' },
      { stopId: 22, stopName: '조선대 후문', sequence: 2, etaSeconds: 840, distanceMeters: 2100, expectedArrival: addMinutes(14), status: 'UPCOMING' },
      { stopId: 23, stopName: '충장로', sequence: 3, etaSeconds: 1200, distanceMeters: 4200, expectedArrival: addMinutes(20), status: 'UPCOMING' },
      { stopId: 24, stopName: 'SSAFY 광주', sequence: 4, etaSeconds: 1560, distanceMeters: 7100, expectedArrival: addMinutes(26), status: 'UPCOMING' },
    ],
    fallback: false,
  },
  3: {
    routeName: '광주 3호차',
    stops: [
      { stopId: 31, stopName: '쌍촌역', sequence: 1, etaSeconds: 960, distanceMeters: 650, expectedArrival: addMinutes(16), status: 'UPCOMING' },
      { stopId: 32, stopName: '풍암지구', sequence: 2, etaSeconds: 1320, distanceMeters: 3300, expectedArrival: addMinutes(22), status: 'UPCOMING' },
      { stopId: 33, stopName: '서광주역', sequence: 3, etaSeconds: 1680, distanceMeters: 6200, expectedArrival: addMinutes(28), status: 'UPCOMING' },
      { stopId: 34, stopName: 'SSAFY 광주', sequence: 4, etaSeconds: 2040, distanceMeters: 9800, expectedArrival: addMinutes(34), status: 'UPCOMING' },
    ],
    fallback: false,
  },
  4: {
    routeName: '광주 4호차',
    stops: [
      { stopId: 41, stopName: '첨단지구', sequence: 1, etaSeconds: 1200, distanceMeters: 820, expectedArrival: addMinutes(20), status: 'UPCOMING' },
      { stopId: 42, stopName: '수완지구', sequence: 2, etaSeconds: 1680, distanceMeters: 4500, expectedArrival: addMinutes(28), status: 'UPCOMING' },
      { stopId: 43, stopName: '유덕고', sequence: 3, etaSeconds: 2040, distanceMeters: 7200, expectedArrival: addMinutes(34), status: 'UPCOMING' },
      { stopId: 44, stopName: 'SSAFY 광주', sequence: 4, etaSeconds: 2400, distanceMeters: 11000, expectedArrival: addMinutes(40), status: 'UPCOMING' },
    ],
    fallback: false,
  },
};

export function getArrivalTime(routeId: number): ArrivalTimeResponse {
  const data = mockData[routeId];
  if (!data) throw new Error('현재 운행 중인 셔틀이 없습니다.');
  return data;
}
