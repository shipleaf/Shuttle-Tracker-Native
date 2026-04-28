import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sendMattermostCode } from '@/services/api/auth';

export default function SignupStep1Screen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = email.includes('@') && webhookUrl.startsWith('https://');

  const handleSend = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await sendMattermostCode(email, webhookUrl);
      router.push({ pathname: '/auth/signup/verify', params: { email } });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '인증 코드 발송에 실패했습니다.';
      Alert.alert('발송 실패', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={s.iconBox}>
              <Ionicons name="bus" size={40} color="#fff" />
            </View>
            <Text style={s.title}>{'계정을 만들어\n친구와 위치를 공유해요'}</Text>
            <Text style={s.subtitle}>
              친구에게 먼저 도착한 셔틀의 위치를 실시간으로 공유받아요.
            </Text>
          </View>

          {/* 폼 */}
          <View style={s.form}>
            <Text style={s.stepLabel}>1 / 3 — Mattermost 인증</Text>

            <View style={s.field}>
              <Text style={s.label}>이메일</Text>
              <View style={s.inputRow}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="example@ssafy.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Mattermost 웹훅 URL</Text>
              <Text style={s.hint}>SSAFY Mattermost → 통합 → 수신 웹훅에서 생성</Text>
              <View style={s.inputRow}>
                <Ionicons name="link-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="https://meeting.ssafy.com/hooks/..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={webhookUrl}
                  onChangeText={setWebhookUrl}
                />
              </View>
            </View>
          </View>

          {/* 하단 */}
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, !isValid && s.primaryBtnDisabled]}
              onPress={handleSend}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>인증 코드 받기</Text>
              )}
            </TouchableOpacity>

            <View style={s.switchRow}>
              <Text style={s.switchText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={s.switchLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 24, paddingTop: 16 },
  backBtn: { marginBottom: 20, alignSelf: 'flex-start', padding: 4 },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FF6F0F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF6F0F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#6B7280', lineHeight: 22, letterSpacing: -0.2 },
  form: { paddingHorizontal: 20, flex: 1 },
  stepLabel: { fontSize: 12, color: '#FF6F0F', fontWeight: '600', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  hint: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  footer: { padding: 20, paddingBottom: 24 },
  primaryBtn: {
    backgroundColor: '#FF6F0F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryBtnDisabled: { backgroundColor: '#FED7B0' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  switchText: { fontSize: 14, color: '#374151' },
  switchLink: { fontSize: 14, color: '#FF6F0F', fontWeight: '700', padding: 4 },
});
