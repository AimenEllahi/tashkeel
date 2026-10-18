"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";

const pieces = [
  { id: "table", src: "/assets/images/objects/blush-table.webp", alt: "Blush table styling concept", decision: "A saved photo becomes a tablescape direction.", className: "board-photo", motion: { x: -34, y: 22, rotation: -8 } },
  { id: "blush", src: "/assets/images/objects/blush-swatch.webp", alt: "Blush fabric swatch", decision: "A blush swatch becomes a palette decision.", className: "board-blush", motion: { x: 20, y: -27, rotation: 8 } },
  { id: "ring-box", src: "/assets/images/objects/ring-box.webp", alt: "Burgundy ring box", decision: "The ring box becomes a personal detail to design around.", className: "board-ring-box", motion: { x: 31, y: -16, rotation: 7 } },
  { id: "invitation", src: "/assets/images/objects/invitation-study.svg", alt: "Invitation arch study", decision: "An invitation motif can carry through the celebration.", className: "board-invitation", motion: { x: -10, y: 35, rotation: -6 } },
  { id: "burgundy", src: "/assets/images/objects/burgundy-swatch.webp", alt: "Burgundy fabric swatch", decision: "A burgundy swatch becomes a palette decision.", className: "board-burgundy", motion: { x: 36, y: 22, rotation: -9 } },
  { id: "rings", src: "/assets/images/objects/rings.webp", alt: "Gold rings", decision: "The rings become a cue for the finishing details.", className: "board-rings", motion: { x: 27, y: 22, rotation: 7 } },
  { id: "floral", src: "/assets/images/objects/floral-sprig.svg", alt: "Botanical sketch", decision: "A floral detail can become a thread through the design.", className: "board-floral", motion: { x: -17, y: 22, rotation: -9 } },
] as const;

export function IdeasToPlan() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const selected = pieces.find((piece) => piece.id === selectedIdea);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !boardRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const board = boardRef.current;
        if (!board) return;
        const context = gsap.context(() => {
          const timeline = gsap.timeline({ scrollTrigger: {
            trigger: board,
            start: "top 95%",
            end: "center 55%",
            scrub: 0.75,
            invalidateOnRefresh: true,
          } });
          board.querySelectorAll<HTMLElement>("[data-board-motion]").forEach((layer) => {
            timeline.fromTo(layer, {
              x: Number(layer.dataset.startX),
              y: Number(layer.dataset.startY),
              rotation: Number(layer.dataset.startRotation),
            }, { x: 0, y: 0, rotation: 0, ease: "none", duration: 1 }, 0);
          });
        }, board);
        return () => context.revert();
      });
      cleanup = () => media.revert();
    }

    void setup().catch(() => {});
    return () => { disposed = true; cleanup?.(); };
  }, []);

  useEffect(() => {
    if (!selectedIdea) return;
    const note = boardRef.current?.querySelector<HTMLElement>(".board-piece-feedback");
    if (!note) return;
    const frame = requestAnimationFrame(() => {
      const bounds = note.getBoundingClientRect();
      if (bounds.top >= 88 && bounds.bottom <= window.innerHeight - 16) return;
      note.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedIdea]);

  return (
    <section id="atelier-stage" className="ideas-section scene-section" aria-labelledby="ideas-heading">
      <Container className="ideas-layout">
        <div className="scene-copy">
          <p className="scene-kicker">From inspiration to intention</p>
          <h2 id="ideas-heading" className="scene-heading">You bring the ideas. <em>We bring them together.</em></h2>
          <p>Bring the saved photos, the family opinions, and the ideas you can’t quite put into words. We make sense of what matters to you, then give it a considered direction.</p>
          <a className="text-link" href="#your-style">Find your direction <span aria-hidden="true">↗</span></a>
        </div>
        <div className="plan-board-shell">
          <p className="board-instruction">Select an object on the board</p>
          <div ref={boardRef} className="plan-board" role="group" aria-label="Explore the wedding inspiration moodboard">
            <div className="plan-board-inner">
              {pieces.map((piece) => <button key={piece.id} type="button" className={`board-piece ${piece.className}`} data-board-motion data-start-x={piece.motion.x} data-start-y={piece.motion.y} data-start-rotation={piece.motion.rotation} data-picked={selectedIdea === piece.id} aria-label={`Explore ${piece.alt}`} aria-pressed={selectedIdea === piece.id} onClick={() => setSelectedIdea((current) => current === piece.id ? null : piece.id)}>
                <span className="board-piece-surface">
                  <Image src={piece.src} alt="" fill sizes="(min-width: 900px) 180px, 28vw" className="object-contain" />
                </span>
                {selectedIdea === piece.id && <span className="board-piece-feedback" aria-hidden="true">{piece.decision}</span>}
              </button>)}
              <div className="board-note"><span data-board-motion data-start-x="-14" data-start-y="19" data-start-rotation="-6">A clearer picture<br /><small>of your celebration</small></span></div>
              <div className="board-stamp" aria-hidden="true">T / A</div>
            </div>
          </div>
          <p className="board-caption sr-only" aria-live="polite">{selected?.decision ?? "Each detail is a starting point."}</p>
        </div>
      </Container>
    </section>
  );
}
