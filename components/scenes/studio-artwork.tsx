import Image from "next/image";
import { paletteOptions, type AmbienceChoice, type FloralChoice, type PaletteChoice } from "@/lib/experience";

type StudioArtworkProps = {
  ambience: AmbienceChoice;
  floral: FloralChoice;
  palette: PaletteChoice;
};

export function StudioArtwork({ ambience, floral, palette }: StudioArtworkProps) {
  const paletteLabel = paletteOptions.find((option) => option.id === palette)?.label ?? palette;
  const variant = palette === "ivory-blush" ? "" : `-${palette}`;
  return <div className="studio-art-frame" data-palette={palette} role="img" aria-label={`Illustrated outdoor nikkah garden with a central aisle, styled dining, chandeliers, and a canopy at the far end; ${floral} florals, ${paletteLabel} palette, ${ambience} light`}>
    <Image
      src={`/assets/images/garden/${ambience}-${floral}${variant}.webp`}
      alt=""
      fill
      sizes="(min-width: 900px) 700px, 100vw"
      className="studio-scene-image"
    />
  </div>;
}
