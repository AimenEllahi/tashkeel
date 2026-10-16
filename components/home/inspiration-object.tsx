import Image from "next/image";
import type { CSSProperties } from "react";
import type { InspirationObjectConfig } from "@/lib/hero-assets";

type PlacementStyle = CSSProperties & Record<`--${string}`, string | number>;

/** Outer placement, entrance, and floating layers each own their transform. */
export function InspirationObject({ object, onSelect, selected }: { object: InspirationObjectConfig; onSelect: () => void; selected: boolean }) {
  const { desktop, mobile } = object;
  const style: PlacementStyle = {
    "--object-x": `${desktop.x}%`, "--object-y": `${desktop.y}%`,
    "--object-width": `${desktop.width}%`, "--object-rotation": `${desktop.rotation}deg`,
    ...(mobile ? {
      "--mobile-x": `${mobile.x}%`, "--mobile-y": `${mobile.y}%`,
      "--mobile-width": `${mobile.width}%`, "--mobile-rotation": `${mobile.rotation}deg`,
    } : {}),
  };
  return (
    <button type="button" className="inspiration-object" style={style} data-mobile={!!mobile} data-object-id={object.id} data-selected={selected} aria-label={`${object.label.replace(/[.!?]+$/, "")}. See the bride's reaction.`} aria-pressed={selected} onClick={onSelect} title="See what she thinks">
      <span data-object-enter>
        <span data-object-float data-duration={object.motion.duration} data-distance={object.motion.distance} data-drift={object.motion.drift} data-sway={object.motion.sway} data-delay={object.motion.delay}>
          <span className={`inspiration-surface inspiration-${object.kind}`} data-tone={object.tone} data-has-artwork={Boolean(object.asset)}>
            {object.asset ? (
              <Image src={object.asset.src} alt="" fill sizes="(min-width: 900px) 220px, 26vw" className={object.kind === "photograph" ? "object-cover" : "object-contain"} />
            ) : (
              <span className={object.kind === "swatch" ? "sr-only" : "object-label"}>{object.label}</span>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}
