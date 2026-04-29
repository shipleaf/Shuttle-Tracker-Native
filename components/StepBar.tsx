import { StyleSheet, View } from "react-native";

type Props = {
  total: number;
  current: number;
};

export default function StepBar({ total, current }: Props) {
  return (
    <View style={s.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[s.segment, i < current ? s.active : s.inactive]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  active: { backgroundColor: "#FF6F0F" },
  inactive: { backgroundColor: "#E5E7EB" },
});
