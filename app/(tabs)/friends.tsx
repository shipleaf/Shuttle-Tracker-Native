import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as friendsApi from '@/services/api/friends';
import type { Friend, FriendRequest, SearchResult } from '@/services/api/friends';

type Tab = 'friends' | 'requests' | 'search';

const AVATAR_COLORS = ['#FF6F0F', '#3182F6', '#12B886', '#A855F7', '#F59E0B', '#0EA5E9', '#F04438'];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function Avatar({ name, userId }: { name: string; userId: number }) {
  return (
    <View style={[styles.avatar, { backgroundColor: getAvatarColor(userId) }]}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>
  );
}

export default function FriendsScreen() {
  const [tab, setTab] = useState<Tab>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [f, r] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getReceivedRequests(),
      ]);
      setFriends(f);
      setRequests(r);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAccept = async (req: FriendRequest) => {
    await friendsApi.acceptRequest(req.friendshipId);
    setRequests((prev) => prev.filter((r) => r.friendshipId !== req.friendshipId));
    Alert.alert('', `${req.user.name}님과 친구가 되었어요`);
    const updated = await friendsApi.getFriends();
    setFriends(updated);
  };

  const handleReject = async (req: FriendRequest) => {
    await friendsApi.rejectRequest(req.friendshipId);
    setRequests((prev) => prev.filter((r) => r.friendshipId !== req.friendshipId));
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'friends', label: '내 친구', count: friends.length },
    { id: 'requests', label: '요청', count: requests.length },
    { id: 'search', label: '친구 찾기' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>친구</Text>
      </View>

      {/* Segmented tabs */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tabItem, tab === t.id && styles.tabItemActive]}
              onPress={() => setTab(t.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>
                {t.label}
              </Text>
              {typeof t.count === 'number' && t.count > 0 && (
                <View style={[styles.badge, tab === t.id && styles.badgeActive]}>
                  <Text style={styles.badgeText}>{t.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FF6F0F" />
        </View>
      ) : (
        <>
          {tab === 'friends' && <FriendsList friends={friends} onRefresh={loadData} />}
          {tab === 'requests' && (
            <RequestsList requests={requests} onAccept={handleAccept} onReject={handleReject} />
          )}
          {tab === 'search' && <FriendSearch onRefresh={loadData} />}
        </>
      )}
    </SafeAreaView>
  );
}

function FriendsList({ friends, onRefresh }: { friends: Friend[]; onRefresh: () => void }) {
  const sharing = friends.filter((f) => f.isSharingLocation);
  const offline = friends.filter((f) => !f.isSharingLocation);

  if (friends.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>👥</Text>
        <Text style={styles.emptyText}>아직 친구가 없어요</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {sharing.length > 0 && (
        <>
          <SectionHeader title="위치 공유 중" count={sharing.length} accent />
          {sharing.map((f) => (
            <FriendRow key={f.userId} friend={f} onRefresh={onRefresh} />
          ))}
        </>
      )}
      {offline.length > 0 && (
        <>
          {sharing.length > 0 && <View style={styles.divider} />}
          <SectionHeader title="오프라인" count={offline.length} />
          {offline.map((f) => (
            <FriendRow key={f.userId} friend={f} onRefresh={onRefresh} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function SectionHeader({ title, count, accent }: { title: string; count: number; accent?: boolean }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, accent && styles.sectionTitleAccent]}>{title}</Text>
      {accent && <View style={styles.dot} />}
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );
}

function FriendRow({ friend, onRefresh }: { friend: Friend; onRefresh: () => void }) {
  const handleDelete = () => {
    Alert.alert('친구 삭제', `${friend.name}님을 친구 목록에서 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await friendsApi.deleteFriend(friend.userId);
          onRefresh();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.listItem} onLongPress={handleDelete} activeOpacity={0.7}>
      <View>
        <Avatar name={friend.name} userId={friend.userId} />
        {friend.isSharingLocation && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.listBody}>
        <Text style={styles.listTitle}>{friend.name}</Text>
        <Text style={styles.listSubtitle}>
          {friend.isSharingLocation
            ? `${friend.currentRouteId !== null ? `${friend.currentRouteId}호차` : '위치 공유 중'}`
            : '오프라인'}
        </Text>
      </View>
      {friend.isSharingLocation ? (
        <View style={styles.chip}>
          <FontAwesome name="map-marker" size={12} color="#FF6F0F" />
          <Text style={styles.chipText}>지도에서 보기</Text>
        </View>
      ) : (
        <FontAwesome name="chevron-right" size={16} color="#C8CDD2" />
      )}
    </TouchableOpacity>
  );
}

function RequestsList({
  requests,
  onAccept,
  onReject,
}: {
  requests: FriendRequest[];
  onAccept: (req: FriendRequest) => void;
  onReject: (req: FriendRequest) => void;
}) {
  if (requests.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>받은 요청이 없어요</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(r) => String(r.friendshipId)}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item: r }) => (
        <View style={styles.requestCard}>
          <View style={styles.requestTop}>
            <Avatar name={r.user.name} userId={r.user.userId} />
            <View style={styles.listBody}>
              <Text style={styles.listTitle}>{r.user.name}</Text>
              <Text style={styles.listSubtitle}>학번 {r.user.studentNumber}</Text>
            </View>
          </View>
          <View style={styles.requestButtons}>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => onAccept(r)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>수락</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={() => onReject(r)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>거절</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function FriendSearch({ onRefresh }: { onRefresh: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (keyword: string) => {
    if (keyword.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await friendsApi.searchFriends(keyword);
      setResults(res);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const handleRequest = async (result: SearchResult) => {
    await friendsApi.sendFriendRequest(result.studentNumber);
    Alert.alert('', `${result.name}님에게 요청을 보냈어요`);
    onRefresh();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchWrap}>
        <FontAwesome name="search" size={16} color="#8B95A1" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="이름 또는 학번으로 검색"
          placeholderTextColor="#8B95A1"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <FontAwesome name="times-circle" size={16} color="#8B95A1" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.searchHint}>이름 또는 학번으로 검색할 수 있어요</Text>

      {query.length < 2 ? (
        <View style={styles.center}>
          <View style={styles.searchPlaceholderIcon}>
            <FontAwesome name="search" size={26} color="#C8CDD2" />
          </View>
          <Text style={styles.emptyText}>이름이나 학번으로 친구를 찾아보세요</Text>
        </View>
      ) : searching ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FF6F0F" />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>검색 결과가 없어요</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => String(r.userId)}
          renderItem={({ item: r }) => (
            <View style={styles.listItem}>
              <Avatar name={r.name} userId={r.userId} />
              <View style={styles.listBody}>
                <Text style={styles.listTitle}>{r.name}</Text>
                <Text style={styles.listSubtitle}>학번 {r.studentNumber}</Text>
              </View>
              {r.friendshipStatus === 'ACCEPTED' ? (
                <Text style={styles.friendLabel}>친구</Text>
              ) : r.friendshipStatus === 'PENDING' ? (
                <Text style={styles.pendingLabel}>요청 중</Text>
              ) : (
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary, { paddingHorizontal: 14 }]}
                  onPress={() => handleRequest(r)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnPrimaryText}>요청</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#191F28', letterSpacing: -0.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: '#8B95A1' },

  tabBarWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  tabBar: {
    flexDirection: 'row', gap: 4, padding: 4,
    backgroundColor: '#F2F4F6', borderRadius: 12,
  },
  tabItem: {
    flex: 1, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4,
  },
  tabItemActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#8B95A1' },
  tabLabelActive: { color: '#191F28' },
  badge: {
    backgroundColor: '#8B95A1', borderRadius: 999,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  badgeActive: { backgroundColor: '#FF6F0F' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#4E5968', letterSpacing: -0.1 },
  sectionTitleAccent: { color: '#FF6F0F' },
  sectionCount: { fontSize: 13, color: '#8B95A1' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF6F0F' },
  divider: { height: 8, backgroundColor: '#F2F4F6', marginVertical: 4 },

  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  listBody: { flex: 1 },
  listTitle: { fontSize: 15, fontWeight: '600', color: '#191F28' },
  listSubtitle: { fontSize: 13, color: '#8B95A1', marginTop: 2 },

  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  onlineDot: {
    position: 'absolute', bottom: -1, right: -1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#12B886', borderWidth: 2, borderColor: '#fff',
  },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: '#FF6F0F', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#FF6F0F' },

  requestCard: {
    borderRadius: 12, borderWidth: 1, borderColor: '#F2F4F6',
    padding: 16, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  requestTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  requestButtons: { flexDirection: 'row', gap: 8, marginTop: 12 },

  btn: { flex: 1, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#FF6F0F' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnSecondary: { backgroundColor: '#F2F4F6' },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#4E5968' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 6,
    backgroundColor: '#F2F4F6', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchIcon: {},
  searchInput: { flex: 1, fontSize: 15, color: '#191F28' },
  searchHint: { fontSize: 12, color: '#8B95A1', marginHorizontal: 20, marginBottom: 8 },
  searchPlaceholderIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#F2F4F6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  friendLabel: { fontSize: 13, fontWeight: '600', color: '#12B886' },
  pendingLabel: { fontSize: 13, fontWeight: '600', color: '#8B95A1' },
});
