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

import { login, register } from '@/services/api/auth';
import { useAuth } from '@/store/auth';

export default function SignupCompleteScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid =
    name.length >= 2 &&
    studentNumber.length >= 7 &&
    password.length >= 6;

  const handleRegister = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await register({ email, password, name, studentNumber });
      // 가입 후 자동 로그인 (서버는 토큰 미발급이므로 별도 호출)
      const data = await login(email, password);
      await signIn(data);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '회원가입에 실패했습니다.';
      Alert.alert('가입 실패', message);
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
              <Ionicons name="person-add" size={36} color="#fff" />
            </View>
            <Text style={s.title}>{'마지막 단계예요\n정보를 입력해주세요'}</Text>
            <Text style={s.subtitle}>입력 후 바로 셔틀트래커를 사용할 수 있어요.</Text>
          </View>

          {/* 폼 */}
          <View style={s.form}>
            <Text style={s.stepLabel}>3 / 3 — 계정 정보 입력</Text>

            <View style={s.field}>
              <Text style={s.label}>이름</Text>
              <View style={s.inputRow}>
                <Ionicons name="person-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="홍길동"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>학번</Text>
              <View style={s.inputRow}>
                <Ionicons name="card-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="1234567"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={studentNumber}
                  onChangeText={setStudentNumber}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>비밀번호</Text>
              <Text style={s.hint}>6자 이상, 영문·숫자 조합</Text>
              <View style={s.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPw}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
                  <Ionicons
                    name={showPw ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 하단 */}
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, !isValid && s.primaryBtnDisabled]}
              onPress={handleRegister}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>회원가입 완료</Text>
              )}
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
  },
  primaryBtnDisabled: { backgroundColor: '#FED7B0' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
});
