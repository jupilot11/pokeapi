import { COLORS } from "@/src/core/constants/app";
import { StyleSheet } from "react-native";

const IMAGE_SIZE = 150;
const IMAGE_OVERLAP = IMAGE_SIZE / 2;
const CARD_RADIUS = 40;

export const styles = StyleSheet.create({
  root: { flex: 1 },

  hero: {
    paddingHorizontal: 24,
    paddingBottom: 0,
    zIndex: 2,
    elevation: 2,
  },
  pokeball: {
    position: "absolute",
    right: -30,
    top: 60,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    opacity: 0.15,
    borderWidth: 7,
    borderColor: "rgba(255,255,255,0.9)",
  },
  pokeballTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  pokeballBand: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateY: -5 }],
  },
  pokeballCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 8,
  },
  heroName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    flexShrink: 1,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroId: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    marginLeft: 8,
  },
  typesGenusRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "space-between",
  },
  typesRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  genus: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
    fontStyle: "italic",
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  heroImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  // flex:1 gives TabView a bounded height so its scenes render correctly.
  // overflow:hidden clips scene content to the rounded top corners.
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    marginTop: -IMAGE_OVERLAP,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    overflow: "hidden",
    zIndex: 1,
    elevation: 1,
  },
  // Reserves vertical space inside the card so the tab bar clears the image.
  imageSpacer: {
    height: IMAGE_OVERLAP - 10,
  },

  // ── Tab scenes ───────────────────────────────────────────────────────────────
  tabScene: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // ── About tab ────────────────────────────────────────────────────────────────
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  measureRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  measure: { alignItems: "center", flex: 1 },
  measureIcon: { marginBottom: 4 },
  measureValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  measureLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: "500",
  },
  measureDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  abilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  abilityChip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  hiddenChip: {
    backgroundColor: "#FFF3F3",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#FFAAAA",
  },
  abilityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B4CCA",
  },
  hiddenText: { color: "#CC4444" },

  // ── Stats tab ────────────────────────────────────────────────────────────────
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    width: 64,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginLeft: 42,
  },

  // ── Moves tab ────────────────────────────────────────────────────────────────
  moveHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  moveHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  moveRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  moveRowAlt: { backgroundColor: "#F8F8F8" },
  moveCell: { fontSize: 13 },
  moveCellLvl: { width: 44, textAlign: "center" },
  moveCellName: { flex: 1 },
  moveLvlText: { fontWeight: "700", color: COLORS.textSecondary },
  moveNameText: { fontWeight: "600", color: COLORS.textPrimary },
  emptyMoves: { alignItems: "center", paddingVertical: 32 },
  emptyMovesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },

  // ── Shared ───────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
});
