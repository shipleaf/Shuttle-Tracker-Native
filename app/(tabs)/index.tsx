import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import ShuttleDropdown from '@/components/ShuttleDropdown';
import MapBottomSheet from '@/components/MapBottomSheet';
import { useAuth } from '@/store/auth';
import { getRoutes, getRoute } from '@/services/api/routes';
import { getArrivalTime } from '@/services/api/shuttle';
import { getRouteLocation, getSharingCount } from '@/services/api/location';
import type { Route, RouteDetail } from '@/services/api/routes';
import type { ArrivalTimeResponse } from '@/services/api/shuttle';
import type { RouteLocationResponse } from '@/services/api/location';

const INITIAL_REGION: Region = {
  latitude: 35.155,
  longitude: 126.885,
  latitudeDelta: 0.025,
  longitudeDelta: 0.018,
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
// MapBottomSheet의 SNAP 포인트와 동일하게 유지
const SHEET_SNAPS = [90, Math.round(SCREEN_HEIGHT * 0.37), SCREEN_HEIGHT - 50] as const;

const BUS_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.008 };

function getBusRegion(lat: number, lng: number, sheetLevel: 0 | 1 | 2): Region {
  // 바텀시트가 차지하는 높이만큼 지도 중심을 아래로 내려서
  // 버스가 보이는 영역의 중앙에 위치하도록 오프셋
  const sheetHeight = SHEET_SNAPS[sheetLevel];
  const latOffset = (sheetHeight / 2 / SCREEN_HEIGHT) * BUS_DELTA.latitudeDelta;
  return {
    latitude: lat - latOffset,
    longitude: lng,
    ...BUS_DELTA,
  };
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { accessToken } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapRef = useRef<MapView>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeDetail, setRouteDetail] = useState<RouteDetail | null>(null);
  const [arrivalData, setArrivalData] = useState<ArrivalTimeResponse | null>(null);
  const [busLocation, setBusLocation] = useState<RouteLocationResponse | null>(null);
  const [sharingCount, setSharingCount] = useState(0);
  const [sheetLevel, setSheetLevel] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    getRoutes('광주')
      .then((data) => {
        setRoutes(data);
        if (data.length > 0) setSelectedRoute(data[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedRoute) return;
    setRouteDetail(null);
    getRoute(selectedRoute.routeId, accessToken ?? undefined)
      .then(setRouteDetail)
      .catch(console.error);
  }, [selectedRoute]);

  useEffect(() => {
    if (!selectedRoute) return;

    const token = accessToken ?? undefined;
    const loadLive = () => {
      getArrivalTime(selectedRoute.routeId, token).then(setArrivalData).catch(console.error);
      getRouteLocation(selectedRoute.routeId, token).then(setBusLocation).catch(console.error);
      getSharingCount(selectedRoute.routeId).then(setSharingCount).catch(console.error);
    };

    loadLive();
    intervalRef.current = setInterval(loadLive, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedRoute]);

  useEffect(() => {
    if (busLocation?.state !== 'LIVE') return;
    mapRef.current?.animateToRegion(
      getBusRegion(busLocation.lat, busLocation.lng, sheetLevel),
      400,
    );
  }, [busLocation, sheetLevel]);

  const polylineCoords =
    routeDetail?.polyline.map((p) => ({ latitude: p.lat, longitude: p.lng })) ?? [];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {polylineCoords.length > 0 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#FF6F0F"
            strokeWidth={4}
            lineDashPattern={undefined}
          />
        )}

        {routeDetail?.stops.map((stop, idx) => (
          <Marker
            key={stop.stopId}
            coordinate={{ latitude: stop.lat, longitude: stop.lng }}
            title={stop.stopName}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.stopMarker, stop.isTerminal && styles.stopMarkerTerminal]}>
              <Text style={[styles.stopMarkerText, stop.isTerminal && styles.stopMarkerTextTerminal]}>
                {idx + 1}
              </Text>
            </View>
          </Marker>
        ))}

        {busLocation?.state === 'LIVE' && (
          <Marker
            coordinate={{ latitude: busLocation.lat, longitude: busLocation.lng }}
            title={selectedRoute?.routeName}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.busMarker}>
              <FontAwesome name="bus" size={15} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* 상단 오버레이 — 풀스크린 시 숨김 */}
      {sheetLevel < 2 && (
        <View style={[styles.topBar, { top: insets.top + 12 }]}>
          <ShuttleDropdown
            routes={routes}
            selectedRoute={selectedRoute}
            onSelect={(r) => {
              setSelectedRoute(r);
              setArrivalData(null);
              setBusLocation(null);
            }}
          />
          {sharingCount > 0 && (
            <View style={styles.sharingBadge}>
              <View style={styles.sharingDot} />
              <Text style={styles.sharingText}>{sharingCount}명 공유 중</Text>
            </View>
          )}
        </View>
      )}

      <MapBottomSheet
        stops={arrivalData?.stops ?? []}
        routeName={arrivalData?.routeName}
        fallback={arrivalData?.fallback}
        onSnapLevelChange={setSheetLevel}
        onBoard={() => {
          // TODO: 탑승 처리
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  sharingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(25, 31, 40, 0.88)',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  sharingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  sharingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stopMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#FF6F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopMarkerTerminal: {
    backgroundColor: '#FF6F0F',
  },
  stopMarkerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6F0F',
  },
  stopMarkerTextTerminal: {
    color: '#fff',
  },
  busMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF6F0F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6F0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
});
