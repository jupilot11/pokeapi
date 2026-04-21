import { COLORS, RADIUS, SPACING } from "@/src/core/constants/app";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BALL = 104;
const BALL_CENTER = 26;

export default function LoginScreen() {
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {/* ── Hero ── */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.hero}
        >
          <View style={styles.pokeballWrap}>
            <View style={styles.pokeballRing} />
            <View style={styles.pokeball}>
              <View style={styles.pokeballTop} />
              <View style={styles.pokeballDivider} />
              <View style={styles.pokeballBottom} />
              <View style={styles.pokeballCenter} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Pokédex</Text>
          <Text style={styles.heroSub}>Your ultimate Pokémon companion</Text>
        </Animated.View>

        {/* ── Card ── */}
        <Animated.View
          entering={FadeInUp.delay(180).duration(500)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Ready to explore?</Text>
          <Text style={styles.cardSub}>
            Discover, track, and collect every Pokémon in one place.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGetStarted}
            accessibilityRole="button"
            accessibilityLabel="Get started"
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flex: {
    flex: 1,
  },

  // Hero
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
  pokeballWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  pokeballRing: {
    position: "absolute",
    width: BALL + 28,
    height: BALL + 28,
    borderRadius: (BALL + 28) / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  pokeball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
  },
  pokeballTop: {
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  pokeballDivider: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 7,
    marginTop: -3.5,
    backgroundColor: "rgba(255,255,255,0.35)",
    zIndex: 1,
  },
  pokeballBottom: {
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pokeballCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: BALL_CENTER,
    height: BALL_CENTER,
    marginTop: -(BALL_CENTER / 2),
    marginLeft: -(BALL_CENTER / 2),
    borderRadius: BALL_CENTER / 2,
    backgroundColor: COLORS.primary,
    borderWidth: 3.5,
    borderColor: "rgba(255,255,255,0.35)",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.2,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: SPACING.xl,
    paddingBottom: 48,
    gap: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: SPACING.md,
  },

  // Button
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
