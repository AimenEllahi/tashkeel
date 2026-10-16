import Image from "next/image";

export type BrideState = "overwhelmed" | "curious" | "thinking" | "delighted" | "relaxed";

type CharacterImage = { src: string; key: string };
export type BrideAsset =
  | { kind: "layers"; layers: readonly [CharacterImage, ...CharacterImage[]]; alt: string }
  | { kind: "sequence"; frames: readonly [string, ...string[]]; alt: string };

export type BrideCharacterProps = {
  state: BrideState;
  assets?: Partial<Record<BrideState, BrideAsset>>;
  className?: string;
  preload?: boolean;
};

/** Static asset surface only. Sequence playback and character motion come later. */
export function BrideCharacter({ state, assets, className = "", preload = false }: BrideCharacterProps) {
  const asset = assets?.[state];
  const images = asset?.kind === "layers"
    ? asset.layers
    : asset?.kind === "sequence"
      ? [{ src: asset.frames[0], key: "poster" }]
      : [];
  const hasArtwork = images.length > 0;

  return (
    <div
      className={`bride-character ${className}`}
      data-state={state}
      data-has-artwork={hasArtwork}
      role={hasArtwork ? "img" : undefined}
      aria-label={hasArtwork ? asset?.alt : undefined}
      aria-hidden={hasArtwork ? undefined : true}
    >
      {images.map(({ src, key }, index) => (
        <Image
          key={key}
          src={src}
          alt=""
          fill
          sizes="(min-width: 900px) 550px, 100vw"
          preload={preload && index === 0}
          className="object-contain"
          data-layer={key}
        />
      ))}
    </div>
  );
}
