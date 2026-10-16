# Hero artwork proof — review drafts

The supplied [wedding moodboard](../character-reference/wedding-moodboard.png) is the visual reference for the bride and the hero's mood. It is a flattened composition, so none of its typography, cards, or background should be used as a website background.

## Drafts made from the reference

- `bride-curious-draft.png`: seated pose with upward thoughtful gaze, based on the central bride in the moodboard.
- `bride-overwhelmed-draft.png`: expression edit of that pose, with raised inner brows and a slightly parted mouth.
- `blush-table-inspiration-draft.png`: conceptual table-styling artwork for one floating inspiration card. It is design inspiration, not a client event or portfolio image.
- `blush-seating-inspiration-draft.png`: a second conceptual seating and draping study.
- `floral-sprig-draft.svg`: code-native brass and ochre botanical line art, individually placeable and scalable.
- The existing HTML “Ammi prefers red.” note is the third independent object for the proof. Its words stay editable and accessible.

The three PNGs were created with the built-in image-generation tool. Their exact selected prompts are in [`prompts.md`](prompts.md). The floral asset was authored as SVG.

## Production pass and quality gate

The generated PNGs above are retained as working source drafts. The image generator left a brown halo even after a targeted extraction attempt. The on-device Apple Vision foreground mask in `art-direction/tools/segment-foreground.swift` produced `bride-curious-cutout.png` and `bride-overwhelmed-cutout.png`. The generated expression varied the skirt embroidery, so `art-direction/tools/compose-expression.mjs` put only its facial expression onto the curious master, yielding `bride-overwhelmed-aligned.png`. Both final states now share the same pose, hair, clothing, dupatta, and transparent silhouette.

Optimized WebP exports are used by the homepage from `public/assets/images/characters/` and `public/assets/images/objects/`. The character still does not have separate eye, arm, or dupatta layers, so only full-frame expression changes and whole-character transforms are valid. Independent blinking, eye movement, or gestures require aligned layers or extra clean frames. These assets establish a visual proof for review, not final approval of every character state.
