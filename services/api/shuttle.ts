import { MOCK } from '@/config/mock';
import * as shuttleMock from '@/mocks/shuttle';
import { apiClient } from './client';

export type StopEta = {
  stopId: number;
  stopName: string;
  sequence: number;
  etaSeconds: number;
  distanceMeters?: number;
  expectedArrival: string;
  status: 'UPCOMING' | 'PASSED' | 'CURRENT';
};

export type ArrivalTimeResponse = {
  routeName: string;
  stops: StopEta[];
  fallback: boolean;
};

export async function getArrivalTime(routeId: number, token?: string): Promise<ArrivalTimeResponse> {
  if (MOCK.shuttle) return shuttleMock.getArrivalTime(routeId);
  return apiClient.post<ArrivalTimeResponse>('/shuttle/arrival-time', { routeId }, token);
}
