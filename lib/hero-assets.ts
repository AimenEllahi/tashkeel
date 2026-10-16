import type { BrideAsset, BrideState } from "@/components/characters/bride-character";

export type ObjectPlacement = { x: number; y: number; width: number; rotation: number };
export type InspirationObjectConfig = {
  id: string;
  kind: "photograph" | "swatch" | "invitation" | "floral" | "note" | "ring-box" | "rings";
  label: string;
  tone?: "blush" | "burgundy";
  reaction?: BrideState;
  asset?: { src: string; alt: string };
  desktop: ObjectPlacement;
  mobile?: ObjectPlacement;
  motion: { duration: number; distance: number; drift: number; sway: number; delay: number };
};

// All expressions share the canonical pose. Small registered face overlays avoid
// downloading another full dress image for each reaction.
export const brideAssets: Partial<Record<BrideState, BrideAsset>> = {
  curious: {
    kind: "layers",
    layers: [{ src: "/assets/images/characters/bride-standing-v2.webp", key: "pose" }],
    alt: "Standing illustrated South Asian bride in an embroidered ivory and gold lehenga, thoughtfully holding inspiration papers",
  },
  overwhelmed: {
    kind: "layers",
    layers: [{ src: "/assets/images/characters/bride-standing-v2.webp", key: "pose" }, { src: "/assets/images/characters/bride-standing-overwhelmed-face.webp", key: "expression" }],
    alt: "Standing South Asian bride in an embroidered ivory and gold lehenga, looking thoughtfully overwhelmed",
  },
  delighted: {
    kind: "layers",
    layers: [{ src: "/assets/images/characters/bride-standing-v2.webp", key: "pose" }, { src: "/assets/images/characters/bride-standing-delighted-face.webp", key: "expression" }],
    alt: "Standing South Asian bride in an embroidered ivory and gold lehenga, smiling with delight",
  },
  thinking: {
    kind: "layers",
    layers: [{ src: "/assets/images/characters/bride-standing-v2.webp", key: "pose" }, { src: "/assets/images/characters/bride-standing-thinking-face.webp", key: "expression" }],
    alt: "Standing South Asian bride in an embroidered ivory and gold lehenga, considering an idea",
  },
  relaxed: {
    kind: "layers",
    layers: [{ src: "/assets/images/characters/bride-standing-v2.webp", key: "pose" }, { src: "/assets/images/characters/bride-standing-relaxed-face.webp", key: "expression" }],
    alt: "Standing South Asian bride in an embroidered ivory and gold lehenga, looking calm and reassured",
  },
};

// Positions are percentages of the scene, rotations are degrees, motion is pixels/seconds.
export const inspirationObjects: readonly InspirationObjectConfig[] = [
  { id: "inspiration-one", kind: "photograph", label: "Blush table styling study", asset: { src: "/assets/images/objects/blush-table.webp", alt: "Conceptual blush and ivory floral table styling" }, desktop: { x: 9, y: 5, width: 17, rotation: -5 }, mobile: { x: 1, y: 8, width: 25, rotation: -4 }, motion: { duration: 4, distance: 16, drift: -5, sway: -1.1, delay: 0 } },
  { id: "blush", kind: "swatch", label: "Blush fabric", tone: "blush", asset: { src: "/assets/images/objects/blush-swatch.webp", alt: "Folded blush fabric swatch with a brass pin" }, desktop: { x: 28, y: 2, width: 12, rotation: 5 }, motion: { duration: 4.5, distance: 13, drift: 5, sway: 1, delay: 0.1 } },
  { id: "ring-box", kind: "ring-box", label: "Bridal ring box", reaction: "delighted", asset: { src: "/assets/images/objects/ring-box.webp", alt: "Open burgundy velvet ring box holding two gold rings" }, desktop: { x: 78, y: 7, width: 15, rotation: 5 }, mobile: { x: 74, y: 7, width: 24, rotation: 5 }, motion: { duration: 4.9, distance: 16, drift: 5, sway: 0.9, delay: 0.2 } },
  { id: "floral", kind: "floral", label: "Floral details", asset: { src: "/assets/images/objects/floral-sprig.svg", alt: "" }, desktop: { x: 66, y: 1, width: 10, rotation: -3 }, motion: { duration: 4.2, distance: 13, drift: -4, sway: -1.2, delay: 0.3 } },
  { id: "planning", kind: "note", label: "Blush or burgundy?", reaction: "thinking", desktop: { x: 4, y: 42, width: 17, rotation: -3 }, motion: { duration: 5, distance: 14, drift: 5, sway: 1, delay: 0.4 } },
  { id: "rings", kind: "rings", label: "Gold bridal rings", reaction: "delighted", asset: { src: "/assets/images/objects/rings.webp", alt: "Two interlocked antique gold rings" }, desktop: { x: 69, y: 35, width: 12, rotation: -7 }, motion: { duration: 4.6, distance: 13, drift: -5, sway: -0.9, delay: 0.5 } },
  { id: "burgundy", kind: "swatch", label: "Burgundy fabric", tone: "burgundy", asset: { src: "/assets/images/objects/burgundy-swatch.webp", alt: "Folded burgundy fabric swatch with a brass pin" }, desktop: { x: 27, y: 38, width: 12, rotation: -5 }, motion: { duration: 4.8, distance: 14, drift: 4, sway: 1.1, delay: 0.55 } },
  { id: "ammi", kind: "note", label: "Ammi prefers red.", reaction: "overwhelmed", desktop: { x: 84, y: 43, width: 16, rotation: 3 }, mobile: { x: 70, y: 31, width: 27, rotation: 2 }, motion: { duration: 5.2, distance: 12, drift: -4, sway: -0.8, delay: 0.6 } },
];
