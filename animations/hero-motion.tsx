"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Progressive enhancement: server-rendered content remains visible without JS. */
export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const syncMotion = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          gsap.from("[data-hero-enter]", {
            y: 18,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
          gsap.to("[data-scroll-cue]", {
            y: -8,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom center",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        }, root);
        return () => context.revert();
      });
      media.add({
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 900px)",
        mobile: "(max-width: 899px)",
      }, (match) => {
        if (!match.conditions?.motion) return;
        const scope = root.current;
        if (!scope) return;
        const context = gsap.context(() => {
          const objects = Array.from(scope.querySelectorAll<HTMLElement>(".inspiration-object"))
            .filter((element) => getComputedStyle(element).display !== "none");
          const entrance = gsap.from(objects.map((object) => object.querySelector("[data-object-enter]")), {
            y: 10, opacity: 0, duration: 0.8, stagger: 0.09,
            ease: "power2.out", clearProps: "transform,opacity", paused: true,
          });
          const floats = objects.map((object) => {
            const layer = object.querySelector<HTMLElement>("[data-object-float]")!;
            return gsap.to(layer, {
              y: -Number(layer.dataset.distance), duration: Number(layer.dataset.duration),
              x: Number(layer.dataset.drift), rotation: Number(layer.dataset.sway),
              delay: Number(layer.dataset.delay), repeat: -1, yoyo: true,
              ease: "sine.inOut", paused: true,
            });
          });
          // Suspend continuous work when the scene or browser tab is not visible.
          const sync = () => {
            const scene = scope.querySelector("[data-atelier-scene]")!;
            const bounds = scene.getBoundingClientRect();
            const active = bounds.bottom > 0 && bounds.top < window.innerHeight && !document.hidden;
            if (active) entrance.play();
            floats.forEach((tween) => tween.paused(!active || pausedRef.current));
          };
          syncMotion.current = sync;
          ScrollTrigger.create({
            trigger: scope.querySelector("[data-atelier-scene]"),
            start: "top bottom", end: "bottom top", onToggle: () => sync(),
          });
          document.addEventListener("visibilitychange", sync);
          sync();
          return () => { document.removeEventListener("visibilitychange", sync); syncMotion.current = null; };
        }, scope);
        return () => context.revert();
      });
      cleanup = () => media.revert();
    }

    // Motion failure should never prevent reading or navigating the page.
    void setup().catch(() => {});
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  function toggleMotion() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncMotion.current?.();
  }

  return <div ref={root} className="hero-motion-root">{children}<button type="button" className="motion-toggle" aria-pressed={paused} onClick={toggleMotion}>{paused ? "Resume floating motion" : "Pause floating motion"}</button></div>;
}
