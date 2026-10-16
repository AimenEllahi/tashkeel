# Outdoor nikkah garden study

The built-in image generation tool created one imagined Lahore garden nikkah composition, four lighting/floral edits, and six palette-specific décor edits. The 1536 × 1024 masters are kept here. This is original concept artwork, not a photograph of a real venue or client event.

The base composition shows an aisle, dining on both sides, chandeliers in mature trees, and a modest ivory nikkah canopy at the far end. `daylight-source.png` is the canonical composition. `evening-source.png` and `night-source.png` edit only the light. `traditional-source.png` and `sculptural-source.png` edit only the flowers.

`art-direction/tools/export-garden.mjs` builds 27 1100-pixel WebP views: three palettes × three floral arrangements × three lighting states. It applies the floral edit within the arrangement areas and transfers the palette edit within the tables and décor areas onto each lighting master. The scene architecture and sky remain registered as the linen, accent textiles, and flowers change. Each view is around 240 KB; the browser requests only the selected view. There is no CSS colour wash.

To regenerate optimized assets from these masters:

```sh
node art-direction/tools/export-garden.mjs
```

## Generation prompts

Base: “Create one original wide editorial illustration for Tashkeel Atelier's interactive wedding styling studio. A complete outdoor nikkah garden event setting in Lahore, viewed from a slightly elevated human eye-level wide angle: central aisle in foreground leading to an intimate ivory and antique-brass nikkah canopy in the far middle distance; small round and long styled dining tables on both sides with ivory linen, blush napkins, brass candleholders, floral centerpieces and cane chairs; crystal and brass chandeliers among mature leafy trees; flower borders and warm stone. Premium painterly 2.5D editorial craft, warm ivory, antique brass, nuanced blush and olive. Clear daylight. Show the entire setting; canopy modest in scale. No people, text, logo or UI.”

Evening edit: “Preserve the exact canvas, camera and all scene geometry. Change only the time and light to golden hour / blue hour with peach-indigo sky and glowing chandeliers and candles. Keep aisle and dining readable. No new props or layout changes.”

Night edit: “Preserve the exact canvas, camera and all scene geometry. Change only the environment to clear sophisticated moonlit night, ink-blue sky, lit chandeliers, table candles and aisle lanterns. Keep full setting visible and detailed, no neon or black crushed shadows. No new props or layout changes.”

Traditional floral edit: “Preserve the exact scene and daylight. Change only the arrangements lining the aisle, dining centerpieces and canopy trim to refined golden marigold and ivory jasmine/gajra with olive greenery. No orange overload or extra props.”

Sculptural floral edit: “Preserve the exact scene and daylight. Change only the arrangements lining the aisle, dining centerpieces and canopy trim to airy asymmetric ivory calla lilies, cream anthuriums, slender stems and olive leaves. No extra props.”

Palette edits: each floral daylight master was edited separately for marigold/burgundy and olive/antique gold. The brief required recolouring the physical table linens, napkins, arrangements and details while preserving the camera, aisle, architecture and floral shape. Those six source images are combined with the lighting masters by the export script. `daylight-source.png` and its floral edits are the ivory/blush direction.
