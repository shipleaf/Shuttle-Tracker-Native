import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupSuccessScreen() {
  const router = useRouter();

  const slideX = useRef(new Animated.Value(-120)).current;
  const bobY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideX, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobY, { toValue: -8, duration: 450, useNativeDriver: true }),
          Animated.timing(bobY, { toValue: 0, duration: 450, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.body}>
        <Animated.View
          style={{ transform: [{ translateX: slideX }, { translateY: bobY }] }}
        >
          <Image
            source={require('@/assets/images/signup-complete.png')}
            style={s.image}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={s.title}>가입을 축하해요!</Text>
        <Text style={s.subtitle}>
          이제 셔틀 위치를 실시간으로{'\n'}확인할 수 있어요.
        </Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={s.primaryBtnText}>로그인 하러 가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 28 },
  primaryBtn: {
    backgroundColor: '#FF6F0F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
