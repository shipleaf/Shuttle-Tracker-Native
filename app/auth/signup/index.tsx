import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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

import StepBar from '@/components/StepBar';

export default function SignupStep1Screen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [phase, setPhase] = useState<'input' | 'verify'>('input');
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    if (phase !== 'verify') return;
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const canSend = email.length > 0 && webhookUrl.length > 0;
  const canVerify = code.length >= 4 && seconds > 0;

  const handleSend = () => {
    setPhase('verify');
    setSeconds(300);
    setCode('');
  };

  const handleVerify = () => {
    router.push({ pathname: '/auth/signup/complete', params: { email } });
  };

  return (
    <SafeAreaView style={s.container}>
      <StepBar total={2} current={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.header}>
            <Text style={s.title}>Mattermost 인증</Text>
            <Text style={s.subtitle}>
              인증 코드를 받을 이메일과 웹훅 URL을 입력해주세요.
            </Text>
          </View>

          <View style={s.form}>
            <View style={s.field}>
              <Text style={s.label}>이메일</Text>
              <View style={[s.inputRow, phase === 'verify' && s.inputRowDisabled]}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="example@ssafy.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={phase === 'input'}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Mattermost 웹훅 URL</Text>
              <Text style={s.hint}>SSAFY Mattermost → 통합 → 수신 웹훅에서 생성</Text>
              <View style={[s.inputRow, phase === 'verify' && s.inputRowDisabled]}>
                <Ionicons name="link-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="https://meeting.ssafy.com/hooks/..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={phase === 'input'}
                  value={webhookUrl}
                  onChangeText={setWebhookUrl}
                />
              </View>
            </View>

            {phase === 'verify' && (
              <View style={s.field}>
                <View style={s.codeHeader}>
                  <Text style={s.label}>인증 코드</Text>
                  <Text style={[s.timer, seconds === 0 && s.timerExpired]}>
                    {formatTime(seconds)}
                  </Text>
                </View>
                <View style={s.inputRow}>
                  <Ionicons name="key-outline" size={18} color="#9CA3AF" style={s.inputIcon} />
                  <TextInput
                    style={[s.input, s.codeInput]}
                    placeholder="12345"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={10}
                    editable={seconds > 0}
                    value={code}
                    onChangeText={setCode}
                    autoFocus
                  />
                </View>
                {seconds === 0 && (
                  <TouchableOpacity onPress={handleSend} style={s.resendBtn}>
                    <Text style={s.resendText}>코드가 만료됐어요. </Text>
                    <Text style={s.resendLink}>다시 받기</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={s.footer}>
            {phase === 'input' ? (
              <TouchableOpacity
                style={[s.primaryBtn, !canSend && s.primaryBtnDisabled]}
                onPress={handleSend}
                disabled={!canSend}
              >
                <Text style={s.primaryBtnText}>인증 코드 받기</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.primaryBtn, !canVerify && s.primaryBtnDisabled]}
                onPress={handleVerify}
                disabled={!canVerify}
              >
                <Text style={s.primaryBtnText}>인증하기</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={s.ghostBtn} onPress={() => router.back()}>
              <Text style={s.ghostBtnText}>뒤로가기</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#6B7280', lineHeight: 22, letterSpacing: -0.2 },
  form: { paddingHorizontal: 20, flex: 1 },
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
  inputRowDisabled: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeInput: { fontSize: 20, fontWeight: '700', letterSpacing: 4 },
  timer: { fontSize: 13, fontWeight: '600', color: '#FF6F0F' },
  timerExpired: { color: '#EF4444' },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: { fontSize: 13, color: '#6B7280' },
  resendLink: { fontSize: 13, color: '#FF6F0F', fontWeight: '700' },
  footer: { padding: 20, paddingBottom: 28, gap: 10 },
  primaryBtn: {
    backgroundColor: '#FF6F0F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: '#FED7B0' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  ghostBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
});
