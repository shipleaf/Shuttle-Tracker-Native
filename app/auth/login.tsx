import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "@/services/api/auth";
import { useAuth } from "@/store/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = email.includes("@") && password.length >= 6;

  const handleLogin = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const data = await login(email, password);
      await signIn(data);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "이메일 또는 비밀번호를 확인해주세요.";
      Alert.alert("로그인 실패", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 브랜드 헤더 */}
          <View style={s.header}>
            <Image
              source={require("@/assets/images/shuttle.png")}
              style={s.logo}
              resizeMode="contain"
            />
          </View>

          {/* 폼 */}
          <View style={s.form}>
            <View style={s.field}>
              <Text style={s.label}>이메일</Text>
              <View style={s.inputRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#9CA3AF"
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>비밀번호</Text>
              <Text style={s.hint}>6자 이상, 영문·숫자 조합</Text>
              <View style={s.inputRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#9CA3AF"
                  style={s.inputIcon}
                />
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPw}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPw((v) => !v)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPw ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={s.forgotBtn}>
              <Text style={s.forgotText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          {/* 하단 액션 */}
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, !isValid && s.primaryBtnDisabled]}
              onPress={handleLogin}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>로그인</Text>
              )}
            </TouchableOpacity>

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>또는</Text>
              <View style={s.dividerLine} />
            </View>

            <View style={s.switchRow}>
              <Text style={s.switchText}>아직 계정이 없으신가요?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup/landing")}>
                <Text style={s.switchLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 0, paddingBottom: 0, alignItems: "center" },
  logo: { width: 360, height: 260, marginBottom: -40 },
  form: { paddingHorizontal: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  hint: { fontSize: 12, color: "#9CA3AF", marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  forgotBtn: { alignSelf: "flex-end", marginTop: 4, padding: 4 },
  forgotText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  footer: { padding: 20, paddingBottom: 24 },
  primaryBtn: {
    backgroundColor: "#FF6F0F",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: { backgroundColor: "#FED7B0" },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { fontSize: 12, color: "#9CA3AF" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  switchText: { fontSize: 14, color: "#374151" },
  switchLink: { fontSize: 14, color: "#FF6F0F", fontWeight: "700", padding: 4 },
});
