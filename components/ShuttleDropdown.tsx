import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Route } from '@/services/api/routes';

type Props = {
  routes: Route[];
  selectedRoute: Route | null;
  onSelect: (route: Route) => void;
};

export default function ShuttleDropdown({ routes, selectedRoute, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {selectedRoute?.routeName ?? '노선 선택'}
        </Text>
        <FontAwesome
          name={open ? 'chevron-up' : 'chevron-down'}
          size={11}
          color="#8B95A1"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {routes.map((route) => {
            const active = selectedRoute?.routeId === route.routeId;
            return (
              <TouchableOpacity
                key={route.routeId}
                style={[styles.item, active && styles.itemActive]}
                onPress={() => {
                  onSelect(route);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.itemText, active && styles.itemTextActive]}>
                  {route.routeName}
                </Text>
                {active && (
                  <FontAwesome name="check" size={13} color="#FF6F0F" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 20,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191F28',
    maxWidth: 130,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  itemActive: {
    backgroundColor: '#FFF5EF',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191F28',
  },
  itemTextActive: {
    color: '#FF6F0F',
  },
});
