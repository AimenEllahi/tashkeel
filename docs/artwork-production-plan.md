# Tashkeel Atelier artwork production plan

## Ownership and source of truth

The current hero source of truth is `art-direction/character-reference/bridal-moodboard-dream.png`, the later standing-bride direction. The standing production master now includes five registered expression states, independent object reactions, and small face overlays. Its current record is in `art-direction/character-master/standing/README.md`. The first-proof notes below describe the earlier seated direction and remain as production history.

Codex will produce, integrate, and animate the website's visual assets where the available tools support them. The supplied wedding moodboard is now preserved at `art-direction/character-reference/wedding-moodboard.png` and is the visual source of truth for the first bride proof. It is a flattened composition, not editable character source art. Keep it separate from optimized website exports.

## Verified capabilities in this environment

| Capability | Available method | Practical use |
| --- | --- | --- |
| Raster generation and editing | Built-in `image_gen` tool and `imagegen` skill | Reference-guided character pose, expression variants, detailed illustrated objects, and miniature environments. Transparent backgrounds are supported by request. Generated files land under Codex's generated-images area first; selected files are copied into this project. |
| SVG and CSS artwork | Project file editing tools | Deterministic line art, simple botanical accents, swatch shapes, invitation frames, and other scalable details. No code-drawn substitute bride. |
| Image export | Existing `sharp` package; `ffmpeg` is also present | Convert or resize approved assets to responsive WebP/AVIF/PNG exports and inspect pixel dimensions. These tools do not create original character design. |
| Motion | Installed `gsap`, `ScrollTrigger`, and GSAP skills | Scoped scene timelines, object float/entrance, expression swaps, and gentle whole-character transforms. Existing `gsap.context()` cleanup is usable without another React package. |
| Browser review | Installed Playwright CLI skill | Inspect desktop/mobile composition, animation behavior, reduced motion, overflow, and asset loading. |
| Rigging | No Rive integration or rigged character source is present | Produce aligned layers or expression frames as later artwork tasks. Do not assume a flattened image can blink, look around, or gesture independently. |

The built-in generator is available without an API key. Its output quality and character consistency must be reviewed; a skill installation alone does not produce artwork. Initial proofs are in `art-direction/proofs/`. Generation produced a recognizable pose and expression but left a halo and changed fine garment details between frames. An on-device Apple Vision mask produced clean cutouts; a face-only composite restored identical clothing and silhouette across the two hero states. The optimized assets are integrated into the homepage. Aligned movable eye, arm, and dupatta layers remain future artwork tasks.

## Production pipeline

1. **Reference audit:** inspect every approved character image at original resolution. Record silhouette, face, outfit, jewelry, dupatta, proportions, palette, canvas, and whether editable layers already exist.
2. **Canonical pose:** create or derive one overwhelmed pose from the approved reference. Generate against the reference, inspect it, and keep the selected version as the visual master. Do not create later states from independent text-only prompts.
3. **Expression variants:** make two expression frames by editing the canonical pose while preserving identity, clothing, framing, and transparency. Compare them at identical size and alignment. Reject variants with face or costume drift.
4. **Object assets:** produce each object separately. Use code-native SVG/CSS for simple shapes and line art; use image generation for detailed illustrations. Keep object backgrounds transparent when they must float over the ivory page. Set any required words in HTML where practical so text stays accurate and accessible.
5. **Export:** keep source and selected masters in an art-working folder; copy compressed web exports into `public/assets/images/` with descriptive names. Record dimensions and alpha. Add paths to `lib/hero-assets.ts`; use `next/image` sizing appropriate to their displayed dimensions.
6. **Animate:** begin with whole-character settle/breathing, expression-frame swaps, and independent object movement. Use separate facial/eye/dupatta layers only if they are genuinely aligned and visually clean. Scope GSAP to the hero, clean up on unmount, pause invisible loops, and respect reduced motion.
7. **Review:** inspect static artwork first, then desktop/mobile screenshots and motion. Check face clearance, visual consistency, text readability, transparency edges, loading cost, and keyboard/reduced-motion behavior before expanding to another scene.

## First proof of concept

- One approved-reference-based bride pose: overwhelmed.
- Two aligned expressions on that pose: overwhelmed and curious. A third `thinking` state can follow once the first two are consistent.
- Three independent surrounding objects: one inspiration card, one floral detail, and the “Ammi prefers red.” note. Keep each in its own element and animation layer.
- One desktop and one mobile composition, with a static reduced-motion equivalent.

The proof succeeds when the bride clearly matches the reference, expressions do not change her identity or outfit, her face remains unobscured on both layouts, and no object movement distracts from the headline. If a later pose or state drifts, revise the generation, masking, or aligned compositing workflow before integration. Do not silently replace her with unrelated art or make asset production dependent on user-supplied source files.

## Later scene groups

After the hero proof is approved, reuse the same character master and art direction to produce the style-exploration environments, styling choices, atelier cabinet, venue/service illustrations, and inquiry invitation. Develop one scene at a time so every new group is reviewed against the existing character and palette before integration.
