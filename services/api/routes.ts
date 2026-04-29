import { MOCK } from '@/config/mock';
import * as routesMock from '@/mocks/routes';
import { apiClient } from './client';

export type Route = {
  routeId: number;
  region: string;
  routeNumber: number;
  routeName: string;
  description?: string;
};

export type Stop = {
  stopId: number;
  stopName: string;
  lat: number;
  lng: number;
  sequence: number;
  isTerminal: boolean;
};

export type RouteDetail = {
  route: Route;
  stops: Stop[];
  polyline: { lat: number; lng: number }[];
};

export async function getRoutes(region?: string): Promise<Route[]> {
  if (MOCK.routes) return routesMock.getRoutes(region);
  const path = region ? `/routes?region=${encodeURIComponent(region)}` : '/routes';
  return apiClient.get<Route[]>(path);
}

export async function getRoute(routeId: number, token?: string): Promise<RouteDetail> {
  if (MOCK.routes) return routesMock.getRoute(routeId);
  return apiClient.get<RouteDetail>(`/routes/${routeId}`, token);
}

export async function getRouteStops(routeId: number, token?: string): Promise<Stop[]> {
  if (MOCK.routes) return routesMock.getRouteStops(routeId);
  return apiClient.get<Stop[]>(`/routes/${routeId}/stops`, token);
}
