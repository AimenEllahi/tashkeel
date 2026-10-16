# Hero asset production record

The newer [standing moodboard](../art-direction/character-reference/bridal-moodboard-dream.png) is the current hero reference. The earlier seated composition and artwork remain in the project as a prior direction. No moodboard is used as a flattened website background.

## Current hero

- A separate standing bride cutout in `public/assets/images/characters/bride-standing-v2.webp`. The [standing master](../art-direction/character-master/standing/README.md) records the source, exact built-in image-generation prompt, foreground extraction, and animation limits.
- Independently placed inspiration photograph, gold rings, burgundy ring box, blush and burgundy fabric, floral line art, and planning notes. Their paths, positions, and gentle GSAP motion live in `lib/hero-assets.ts`.
- The headline is smaller and higher so the standing bride occupies the central visual field. Mobile keeps only three surrounding objects, leaving her face clear.

## Review

- [1536 × 1024 desktop](../output/playwright/standing-hero-reference-size.png)
- [390 px mobile](../output/playwright/standing-hero-mobile.png)

The standing pose now supports five registered expression states through small face overlays. See the [expression production record](../art-direction/character-master/standing/expression-prompts.md). Whole-body rigging, independent blinking, gestures, and dupatta movement remain outside the available layers. The rest of the website is now implemented; current browser verification and content limitations are recorded in [site-review.md](site-review.md).
