import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupLandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container}>
      <View style={s.body}>
        <Image
          source={require("@/assets/images/shuttle.png")}
          style={s.logo}
          resizeMode="contain"
        />
        <Text style={s.title}>
          {"간편 회원가입 후,\n버스 위치를 바로 확인해보세요!"}
        </Text>
        <Text style={s.subtitle}>
          Mattermost 인증만으로{"\n"}셔틀 실시간 위치를 바로 확인할 수 있어요.
        </Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={s.primaryBtnText}>회원가입 진행하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.ghostBtn} onPress={() => router.back()}>
          <Text style={s.ghostBtnText}>다음에 하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: { width: 360, height: 260, marginBottom: -40 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 28, gap: 10 },
  primaryBtn: {
    backgroundColor: "#FF6F0F",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  ghostBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
