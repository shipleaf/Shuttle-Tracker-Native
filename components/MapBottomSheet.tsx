import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StopEta } from '@/services/api/shuttle';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SNAP: [number, number, number] = [
  90,
  Math.round(SCREEN_HEIGHT * 0.37),
  SCREEN_HEIGHT - 50,
];
const ITEM_HEIGHT = 68;
const ANIM = { duration: 260, easing: Easing.out(Easing.exp) };

type Props = {
  stops: StopEta[];
  routeName?: string;
  fallback?: boolean;
  onBoard?: () => void;
  onSnapLevelChange?: (level: 0 | 1 | 2) => void;
};

export default function MapBottomSheet({ stops, routeName, fallback, onBoard, onSnapLevelChange }: Props) {
  const insets = useSafeAreaInsets();
  const height = useSharedValue(SNAP[0]);
  const snapLevelRef = useRef<0 | 1 | 2>(0);
  const [snapLevel, setSnapLevel] = useState<0 | 1 | 2>(0);
  const listRef = useRef<FlatList<StopEta>>(null);

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderRelease: (_, gs) => {
        const cur = snapLevelRef.current;
        let next = cur;
        if (gs.dy < -30) next = Math.min(cur + 1, 2) as 0 | 1 | 2;
        else if (gs.dy > 30) next = Math.max(cur - 1, 0) as 0 | 1 | 2;
        if (next !== cur) {
          height.value = withTiming(SNAP[next], ANIM);
          snapLevelRef.current = next;
          setSnapLevel(next);
        }
      },
    })
  ).current;

  useEffect(() => {
    onSnapLevelChange?.(snapLevel);
  }, [snapLevel]);

  const nextStop = stops.find((s) => s.status === 'CURRENT' || s.status === 'UPCOMING') ?? null;
  const focusIdx = stops.findIndex((s) => s.status === 'CURRENT' || s.status === 'UPCOMING');

  useEffect(() => {
    if (snapLevel === 0 || focusIdx <= 0) return;
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: focusIdx, animated: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [snapLevel, focusIdx]);

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins < 1 ? '곧 도착' : `${mins}분 후`;
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  const renderStop = ({ item, index }: { item: StopEta; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === stops.length - 1;
    const isPassed = item.status === 'PASSED';
    const isCurrent = item.status === 'CURRENT';
    const isNext = index === focusIdx && !isPassed;
    const highlight = isCurrent || isNext;
    const lineColor = isPassed ? '#E5E8EB' : '#FFDCC7';

    return (
      <View style={styles.stopItem}>
        {/* 타임라인 열 */}
        <View style={styles.timeline}>
          <View style={[styles.line, { backgroundColor: isFirst ? 'transparent' : lineColor }]} />
          <View
            style={[
              styles.circle,
              isPassed ? styles.circlePassed : highlight ? styles.circleActive : styles.circleDefault,
            ]}
          >
            {highlight && <FontAwesome name="bus" size={9} color="#fff" />}
            {isPassed && <FontAwesome name="check" size={8} color="#fff" />}
          </View>
          <View style={[styles.line, { backgroundColor: isLast ? 'transparent' : lineColor }]} />
        </View>

        {/* 내용 열 */}
        <View style={[styles.stopContent, highlight && styles.stopContentHL]}>
          <Text
            style={[
              styles.stopName,
              isPassed && styles.stopNameGray,
              highlight && styles.stopNameHL,
            ]}
            numberOfLines={1}
          >
            {item.stopName}
          </Text>
          {!isPassed && (
            <Text style={[styles.stopSub, highlight && styles.stopSubHL]}>
              {formatEta(item.etaSeconds)}
              {item.distanceMeters ? `  ·  ${formatDistance(item.distanceMeters)}` : ''}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.sheet, animatedStyle]}>
      {/* 그래버 & 요약/노선명 */}
      <View
        {...panResponder.panHandlers}
        style={[styles.grabberArea, snapLevel === 2 && { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.grabber} />
        {snapLevel === 0 && nextStop ? (
          <View style={styles.collapsedPreview}>
            <FontAwesome name="bus" size={12} color="#FF6F0F" />
            <Text style={styles.collapsedStopName} numberOfLines={1}>
              {nextStop.stopName}
            </Text>
            <Text style={styles.collapsedEta}>{formatEta(nextStop.etaSeconds)}</Text>
          </View>
        ) : snapLevel > 0 && routeName ? (
          <Text style={styles.routeLabel}>{routeName}</Text>
        ) : null}
      </View>

      {/* 정류장 목록 */}
      <FlatList
        ref={listRef}
        data={stops}
        keyExtractor={(item) => String(item.stopId)}
        renderItem={renderStop}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {fallback
                ? 'ETA 계산이 불가합니다. 잠시 후 다시 시도해주세요.'
                : '현재 운행 중인 셔틀이 없습니다.'}
            </Text>
          </View>
        }
      />

      {/* 탑승 버튼 — mid/full에서만 표시 */}
      {snapLevel > 0 && stops.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.boardButton} onPress={onBoard} activeOpacity={0.85}>
            <Text style={styles.boardButtonText}>지금 탑승하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
  },
  grabberArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
  },
  grabber: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D6DB',
  },
  routeLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#191F28',
    letterSpacing: -0.3,
  },
  collapsedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
  },
  collapsedStopName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#191F28',
    letterSpacing: -0.3,
  },
  collapsedEta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6F0F',
  },
  // 정류장 아이템
  stopItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    paddingRight: 20,
  },
  timeline: {
    width: 52,
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDefault: {
    backgroundColor: '#E5E8EB',
  },
  circlePassed: {
    backgroundColor: '#C5CBD2',
  },
  circleActive: {
    backgroundColor: '#FF6F0F',
  },
  stopContent: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  stopContentHL: {
    backgroundColor: '#FFF5EF',
  },
  stopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191F28',
    letterSpacing: -0.3,
  },
  stopNameGray: {
    color: '#B0B8C1',
    fontWeight: '500',
  },
  stopNameHL: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6F0F',
  },
  stopSub: {
    fontSize: 12,
    color: '#8B95A1',
    marginTop: 3,
  },
  stopSubHL: {
    color: '#FF6F0F',
    fontWeight: '600',
  },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#8B95A1',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F6',
    marginBottom: 12,
  },
  boardButton: {
    backgroundColor: '#FF6F0F',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  boardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
