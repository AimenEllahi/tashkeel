# Site review — 16 October 2026

This is a review of the local production build, not a live-domain audit.

## Current experience

The page runs from the centered standing-bride hero through inspiration curation, style directions, the outdoor nikkah garden study, an interactive atelier cabinet, a services planning map, Hafsa's illustrated portrait, and an inquiry email handoff. The floating details orbit the bride's head-and-shoulder area continuously with gentle, distinct timings, and a selection visibly confirms her reaction. Seven loose moodboard details, including the invitation study and botanical sketch, settle into a composed collection as the visitor scrolls, then remain individually selectable. Style selection gives an immediate palette/floral/lighting summary without repeating the large garden image. The full garden appears in the studio, with a direct day/night invitation. The garden is an original imagined setting with a visible aisle, dining, chandeliers, and canopy. Daylight, evening, and night use registered lighting views; traditional, romantic, and sculptural flowers are available for each. Palette choices now load registered garden artwork with the linens and décor physically recoloured; the material preview identifies the table linen, accent fabric, and metal detail. The composition remains consistent.

## Checks completed

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `git diff --check` passed.
- Chromium and WebKit production-preview interaction checks passed at 320, 390, 768, 1024, and 1440 px. Checks include all five bride expression states, seven moodboard details, compact style summaries and presets, guided studio lighting, all studio controls and images, cabinet and services controls, form validation, email draft contents, mobile selectors, focus, image loading, and horizontal overflow. Dedicated navigation and link checks click every visible internal anchor at all five widths, including the desktop CTA, wordmarks, section links, footer links, and hero scroll cue; they also keyboard-activate the skip link and click both 404-page return links at mobile and desktop widths. The checks verify unique destinations and sticky-header clearance. Mail links use the confirmed recipient, and the Instagram profile URL returned HTTP 200 at review time.
- Section-entry captures at 390 and 1440 px show the style cards, garden, cabinet, and venue map within the first viewport after navigating to their sections. All three studio palette states were compared visually in Chromium and WebKit.
- All 27 palette/floral/time combinations were decoded in Chromium and WebKit; the palette selector loads different artwork with coloured décor rather than a CSS wash.
- Complete mobile interaction passes at 320 and 390 px in both browsers exercised the hero, seven board pieces, three style cards, garden selectors, six cabinet drawers, four service controls, and inquiry draft. Safari's native select controls were found to render too small and corrected to 48 px touch targets, including the inquiry form selects.
- Motion checks passed for pause, resume, offscreen suspension, reduced-motion behavior, and normal-motion responsive widths.
- A motion-enabled Chromium and WebKit check confirmed the hero photo changes vertical position continuously and the moodboard photo moves from a 34 px loose offset to its arranged position as the scroll progresses at both 390 and 1440 px. Reduced motion leaves the board settled.
- Visual captures of the hero, composed moodboard, selected direction summary, and studio at night were reviewed at mobile size, with desktop section captures reviewed as well. The founder portrait retains the supplied pose and recognizable features.
- A throttled **local** Chromium production preview at 390 × 844, DPR 2, 4× CPU, 1.6 Mbps down and 100 ms latency measured approximately 832 ms LCP, 0 CLS, 0 measured blocking time, 508 ms FCP, and 0 horizontal overflow. These numbers are diagnostics and are not field Core Web Vitals or a deployment score.

## Content and launch handoff

- Hafsa's personal biography is still needed for a more personal founder story. The current public text uses only confirmed brand facts.
- The inquiry is a real prefilled email draft to `tashkeelatelier@gmail.com`; the visitor must send it through their mail app. A delivery service or backend is required before the site can claim direct form submission.
- The generated garden is labeled an imagined styling study and is never represented as a completed client event. Hafsa should review the illustrated likeness before public launch.
- Production domain, hosting, and domain-specific metadata must be set for deployment. `NEXT_PUBLIC_SITE_URL` or Vercel's production URL environment variable supplies the canonical origin.
- The bride uses registered face frames for emotional reactions. Independent blinking, head/arm/dupatta movement and a Rive-style rig require additional separated artwork; the current implementation does not claim those capabilities.

## Studio image latency follow-up — 18 October 2026

On the deployed URL before this fix, the Sculptural control changed in about 67 ms, while its new garden image completed about 1.5 seconds later through Vercel's on-demand `/_next/image` route. Direct static WebP requests measured roughly 0.7–1.0 seconds from the review browser. The studio now serves the already optimized WebP exports directly, predecodes nearby choices only when the studio approaches the viewport, and retains the visible scene until the requested one is ready. Prefetching skips Save-Data connections and starts in pairs after the current scene has loaded. A status appears for uncached switches. This change has passed the local production build, all 27 combinations in Chromium and WebKit, and simulated 1.6-second delayed-request checks covering no blank frame, rapid-choice ordering, and mobile selection. The public URL still needs a new deployment before the improvement can be measured there.
