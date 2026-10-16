export type StyleChoice = "old-school" | "contemporary" | "both";
export type PaletteChoice = "ivory-blush" | "marigold-burgundy" | "olive-gold";
export type FloralChoice = "traditional" | "romantic" | "sculptural";
export type AmbienceChoice = "daylight" | "evening" | "night";

export const styleOptions = [
  { id: "old-school", title: "Old-School Pakistani Charm", image: "/assets/images/styles/old-school.webp", description: "Marigolds, gajray, brass and the warmth of a Lahore celebration." },
  { id: "contemporary", title: "Contemporary Romance", image: "/assets/images/styles/contemporary.webp", description: "Ivory, blush and sculptural details with room to breathe." },
  { id: "both", title: "A Little of Both", image: "/assets/images/styles/both.webp", description: "Heritage details, contemporary composition, completely your own." },
] as const satisfies ReadonlyArray<{ id: StyleChoice; title: string; image: string; description: string }>;

export const paletteOptions = [
  { id: "ivory-blush", label: "Ivory & blush" },
  { id: "marigold-burgundy", label: "Marigold & burgundy" },
  { id: "olive-gold", label: "Olive & antique gold" },
] as const satisfies ReadonlyArray<{ id: PaletteChoice; label: string }>;

export const paletteMaterials = {
  "ivory-blush": { linen: "Ivory", accent: "Blush", metal: "Antique brass" },
  "marigold-burgundy": { linen: "Burgundy", accent: "Marigold", metal: "Antique brass" },
  "olive-gold": { linen: "Olive", accent: "Ivory", metal: "Antique gold" },
} as const satisfies Record<PaletteChoice, { linen: string; accent: string; metal: string }>;

export const floralOptions = [
  { id: "traditional", label: "Traditional" },
  { id: "romantic", label: "Romantic" },
  { id: "sculptural", label: "Sculptural" },
] as const satisfies ReadonlyArray<{ id: FloralChoice; label: string }>;

export const ambienceOptions = [
  { id: "daylight", label: "Daylight" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Night" },
] as const satisfies ReadonlyArray<{ id: AmbienceChoice; label: string }>;

export const stylePresets = {
  "old-school": { palette: "marigold-burgundy", floral: "traditional", ambience: "evening" },
  contemporary: { palette: "ivory-blush", floral: "romantic", ambience: "daylight" },
  both: { palette: "olive-gold", floral: "sculptural", ambience: "night" },
} as const satisfies Record<StyleChoice, { palette: PaletteChoice; floral: FloralChoice; ambience: AmbienceChoice }>;
