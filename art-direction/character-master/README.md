# Seated bride proof — earlier hero direction

The current hero uses the [standing character master](standing/README.md), following the later `bridal-moodboard-dream.png` reference. The seated pose remains here as an earlier proof and possible later-scene asset; it should not be paired with the standing pose as an expression state.

The [character sheet](character-sheet.png) records the earlier seated direction. It uses the first supplied [moodboard](../character-reference/wedding-moodboard.png) for identity and style. [`pose-01-curious.png`](pose-01-curious.png) and [`pose-01-overwhelmed.png`](pose-01-overwhelmed.png) share the same transparent body and a face-only expression change.

## Identity to preserve

- Soft 2.5D editorial illustration finish, warm brown skin, rounded face, large expressive brown eyes, softly arched brows, and a small warm rose mouth.
- Long, dense dark-brown waves around both shoulders; the face remains visible and the hairline stays consistent.
- Ivory lehenga with dense antique-gold floral embroidery, matching blouse, long edged dupatta, gold maang tikka, earrings, bangles, and rings.
- A warm, thoughtful, playful expression. The character should feel like the same person in every scene, even when her pose changes.
- Hero pose 01: seated, knees raised, chin resting on both hands, gaze slightly upward. Keep the complete dress and trailing dupatta within the transparent canvas.

The two 1536 × 1024 PNGs are the source exports for this seated pose. Their SHA-256 hashes are:

| State | SHA-256 |
| --- | --- |
| Curious | `0c2e571216f04fa7ca111a142635783066f735985346eb3fbfde2bb362772618` |
| Overwhelmed | `8f6bd0c33ab0979626717af046b0bca3eceecf40a269c9ef7908a3cc5911b4b2` |

The compressed website exports remain at `public/assets/images/characters/bride-curious.webp` and `bride-overwhelmed.webp`, but the homepage no longer references them. They are 1280 × 853 with transparent backgrounds. Do not redraw this pose independently for each emotion: use the curious body as the base and modify only a registered facial area. Keep future pose masters here, then export web assets separately.

## Animation boundary

These are aligned full-frame expression states, not a rig. GSAP may transition whole-character opacity, position, or scale and swap the state image. Do not claim independent blinking, eye tracking, hand gestures, or dupatta movement from these flattened files. To add those motions, create aligned separate layers or a clean frame sequence from this locked identity and review them against the sheet.

For every new pose, use both the supplied moodboard and this character sheet as references. Check face proportions, hairline, jewelry, dress embroidery, dupatta edge, skin tone, and art finish at desktop and mobile sizes. Reject any variant that changes identity or costume. The user does not need to supply further artwork for that process.
