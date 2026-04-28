import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import { verifyMattermostCode } from '@/services/api/auth';

export default function SignupVerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = code.length >= 4;

  const handleVerify = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await verifyMattermostCode(email, code);
      router.push({ pathname: '/auth/signup/complete', params: { email } });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '인증 코드를 확인해주세요.';
      Alert.alert('인증 실패', message);
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
              <Ionicons name="chatbubble-ellipses" size={36} color="#fff" />
            </View>
            <Text style={s.title}>{'Mattermost로\n코드를 확인해주세요'}</Text>
            <Text style={s.subtitle}>
              <Text style={s.emailHighlight}>{email}</Text>
              {'\n'}으로 연결된 Mattermost에 인증 코드를 보냈어요.
            </Text>
          </View>

          {/* 폼 */}
          <View style={s.form}>
            <Text style={s.stepLabel}>2 / 3 — 인증 코드 확인</Text>

            <View style={s.field}>
              <Text style={s.label}>인증 코드</Text>
              <View style={s.inputRow}>
                <Ionicons name="key-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={[s.input, s.codeInput]}
                  placeholder="12345"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={code}
                  onChangeText={setCode}
                />
              </View>
            </View>
          </View>

          {/* 하단 */}
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, !isValid && s.primaryBtnDisabled]}
              onPress={handleVerify}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>인증 완료</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={s.resendBtn}>
              <Text style={s.resendText}>코드를 받지 못하셨나요? </Text>
              <Text style={s.resendLink}>다시 보내기</Text>
            </TouchableOpacity>
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
  emailHighlight: { color: '#FF6F0F', fontWeight: '600' },
  form: { paddingHorizontal: 20, flex: 1 },
  stepLabel: { fontSize: 12, color: '#FF6F0F', fontWeight: '600', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
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
  codeInput: { fontSize: 20, fontWeight: '700', letterSpacing: 4 },
  footer: { padding: 20, paddingBottom: 24 },
  primaryBtn: {
    backgroundColor: '#FF6F0F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryBtnDisabled: { backgroundColor: '#FED7B0' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  resendBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  resendText: { fontSize: 14, color: '#6B7280' },
  resendLink: { fontSize: 14, color: '#FF6F0F', fontWeight: '700' },
});
