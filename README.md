# Tashkeel Atelier

A character-led wedding design and planning experience for a Lahore-based atelier. Built with Next.js App Router, React, TypeScript, Tailwind CSS v4, and GSAP. No Three.js, external font requests, stock photography, or animation runtime beyond GSAP.

## Run locally

Run commands from this `tashkeel-atelier/` directory:

```sh
npm install
npm run dev
npm run lint
npm run build
npm start
```

Development uses webpack and Tailwind's PostCSS adapter. The normal local URL is `http://localhost:3000`. To inspect an independent production preview after building:

```sh
npm start -- --port 3002
```

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin before deploying. This enables a canonical URL and correctly resolves the generated social-sharing image. Vercel's production-domain environment variable is also supported; local development falls back to `http://localhost:3000`.

## Page experience

- **The chaos:** standing bride with independently floating wedding details clustered around her head and shoulders. Choosing an object lifts it, keeps it marked, and changes her registered expression. Floating motion can be paused, stops offscreen, and respects reduced motion.
- **From inspiration to intention:** seven loose details settle into a composed moodboard as the visitor scrolls. Each stays individually selectable and reveals a possible design decision; the invitation and botanical sketch add depth without an extra arrange/scatter step.
- **Style exploration:** three illustrated directions reveal their coordinated palette, floral, and time-of-day starting point. The garden image appears only in the studio, where visitors can customize it.
- **Wedding studio:** a complete imagined outdoor nikkah garden, with aisle, dining, chandeliers and canopy. Three palettes, three floral treatments, and daylight/evening/night lighting produce 27 scene views. Palette choices change the colours of the actual linens and décor in the garden artwork and carry into the inquiry draft. Mobile uses compact native selects.
- **The little things:** an interactive cabinet reveals invitations, florals, favors, tablescapes, stationery, and guest details.
- **Making it happen:** a venue planning map explains design, production, entertainment, dining, vendors, logistics, and coordination.
- **Meet the atelier:** Hafsa's name, a portrait illustration based on her supplied photograph, and the supplied brand introduction. Her personal biography has not been invented.
- **Inquiry:** validates the visitor's details and creates a prefilled email addressed to `tashkeelatelier@gmail.com`. It carries chosen design preferences and supports copying the draft. Nothing is sent automatically and no successful submission is claimed.

## Architecture

```text
app/                         Page, metadata, social image, robots, global CSS
components/layout/           Container, navigation, footer
components/home/             Hero scene and floating object controls
components/characters/       Reusable layered BrideCharacter surface
components/experience/       Small shared state provider for design choices
components/scenes/           Style, studio, cabinet, venue, founder, inquiry
animations/                  Scoped GSAP effects and cleanup
lib/                         Typed asset, placement, and choice configurations
public/assets/images/        Optimized website assets only
art-direction/               References, production masters, prompts, export tools
docs/                        Asset handoff and browser-review notes
output/playwright/           Reproducible browser checks and screenshots
```

The page and static content use Server Components; interaction boundaries are client components. The state provider holds only the current visit's choices. Inquiry data is not posted to a server or saved in storage.

## Artwork and animation boundaries

The approved standing reference is `art-direction/character-reference/bridal-moodboard-dream.png`. It is art direction, never a flattened page background. The canonical bride is `public/assets/images/characters/bride-standing-v2.webp`. Four approximately 10 KB face overlays add overwhelmed, thinking, delighted, and relaxed states to the curious base.

All layers share the same 900 × 1350 transparent canvas. Their source masters and exact generation prompts are recorded in the [standing master](art-direction/character-master/standing/README.md). Pixel checks confirm that the full masters preserve every visible pixel outside the facial region. These are expression swaps, not a facial or body rig; no independent blinking, hand, hair, or dupatta motion is claimed.

`lib/hero-assets.ts` owns object paths, placement, reactions, and floating timings. Placement, entrance, and float transforms belong to separate wrappers. The earlier seated artwork is retained as a previous direction and is not mixed into the standing state map.

The style-explorer images and garden setting are conceptual artwork, not real client events. The garden has 27 pre-exported WebP views. The current view is displayed directly from static files; when the studio approaches the viewport, up to six adjacent choices are decoded in pairs for faster switching (skipped when Save-Data is enabled). The current image remains visible until the requested one is ready. The palette variants recolour depicted fabrics and décor while preserving the setting; they are concept art, not product-accurate fabric samples. Hafsa's source portrait is transformed into a watercolor and graphite illustration. The cabinet details and planning map are editable code-native illustrations. Raster masters and export tools are kept outside `public/`; only optimized exports ship to browsers.

## Verification

The Playwright CLI skill's wrapper runs the browser checks against the production preview on port 3002:

```sh
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh open http://localhost:3002
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-site.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-navigation.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-all-links.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-mobile-flows.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-garden-variants.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-studio-switching.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-motion.js
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh --raw run-code --filename output/playwright/verify-board-motion.js
```

The checks exercise continuous hero floating, scroll-linked moodboard settling and detail selection, style summaries, all 27 garden artwork combinations, all internal links, complete mobile interactions and touch targets, form validation, draft contents, stale-draft handling, keyboard entry, responsive widths, and image loading. No inquiry is sent. The performance check uses a throttled local Chromium production preview; it is a diagnostic rather than a field Core Web Vitals score.

## Content and launch handoff

- Hafsa's supplied portrait has been illustrated and integrated. Her personal introduction can be added when she provides it; the site currently uses only confirmed brand information.
- A visitor must send the prepared inquiry from their mail application. Connecting direct form delivery later requires a real service and credentials; never replace this with a fake success screen.
- Configure the production origin and confirm hosting before publishing. No domain or deployment has been invented or activated.
- System serif and sans-serif stacks avoid font downloads. A licensed brand font can replace the typography tokens later.

See [the review record](docs/site-review.md) for current verification and remaining content limitations.
