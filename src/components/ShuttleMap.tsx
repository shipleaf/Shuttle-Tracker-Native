import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

export type ShuttleMarker = {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
};

type Props = {
  initialRegion?: Region;
  shuttles?: ShuttleMarker[];
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function ShuttleMap({ initialRegion = DEFAULT_REGION, shuttles = [] }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {shuttles.map((shuttle) => (
        <Marker
          key={shuttle.id}
          coordinate={shuttle.coordinate}
          title={shuttle.title ?? `셔틀 ${shuttle.id}`}
        />
      ))}
    </MapView>
  );
}
