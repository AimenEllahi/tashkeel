# Animations

`hero-motion.tsx` lazy-loads GSAP and ScrollTrigger. Typography enters gently; surrounding objects enter with a stagger and drift by 6–9px with small horizontal and rotational offsets at independent timings. A selected object lifts through CSS on its own inner layer. The character is never targeted.

MatchMedia scopes effects to motion preferences and rebuilds object selection at the 900px breakpoint. Context cleanup reverts transforms, kills tweens and triggers, and removes visibility listeners. Floating pauses outside the scene viewport and in hidden tabs. Reduced-motion visitors see the complete static composition. No cursor tracking, pinned scrolling, or scroll hijacking is used.
