"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ambienceOptions,
  floralOptions,
  paletteOptions,
  type AmbienceChoice,
  type FloralChoice,
  type PaletteChoice,
} from "@/lib/experience";

type StudioArtworkProps = {
  ambience: AmbienceChoice;
  floral: FloralChoice;
  palette: PaletteChoice;
};

type GardenScene = StudioArtworkProps & { src: string };

function gardenPath({ ambience, floral, palette }: StudioArtworkProps) {
  const paletteSuffix = palette === "ivory-blush" ? "" : `-${palette}`;
  return `/assets/images/garden/${ambience}-${floral}${paletteSuffix}.webp`;
}

// The garden files are already export-ready WebP. Decode before switching so
// the current scene stays visible until the requested one is ready to paint.
const decodedScenes = new Map<string, Promise<void>>();

function decodeScene(src: string) {
  const cached = decodedScenes.get(src);
  if (cached) return cached;
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
  const ready = image.decode().catch((error: unknown) => {
    decodedScenes.delete(src);
    throw error;
  });
  decodedScenes.set(src, ready);
  return ready;
}

function nearbyScenes(scene: StudioArtworkProps) {
  return [
    ...ambienceOptions.filter((option) => option.id !== scene.ambience).map((option) => gardenPath({ ...scene, ambience: option.id })),
    ...floralOptions.filter((option) => option.id !== scene.floral).map((option) => gardenPath({ ...scene, floral: option.id })),
    ...paletteOptions.filter((option) => option.id !== scene.palette).map((option) => gardenPath({ ...scene, palette: option.id })),
  ];
}

export function StudioArtwork({ ambience, floral, palette }: StudioArtworkProps) {
  const requestedSrc = gardenPath({ ambience, floral, palette });
  const [displayed, setDisplayed] = useState<GardenScene>(() => ({ ambience, floral, palette, src: requestedSrc }));
  const [nearViewport, setNearViewport] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        const image = frame.querySelector("img");
        if (image?.complete && image.naturalWidth > 0) setSceneReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "650px 0px" });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (requestedSrc === displayed.src) return;
    let active = true;
    void decodeScene(requestedSrc).then(() => {
      if (active) {
        setDisplayed({ ambience, floral, palette, src: requestedSrc });
        setFailedSrc(null);
      }
    }).catch(() => {
      if (active) setFailedSrc(requestedSrc);
    });
    return () => { active = false; };
  }, [requestedSrc, displayed.src, ambience, floral, palette]);

  useEffect(() => {
    if (!nearViewport || !sceneReady || displayed.src !== requestedSrc) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const sources = nearbyScenes({ ambience, floral, palette });
        for (let index = 0; index < sources.length && !cancelled; index += 2) {
          await Promise.allSettled(sources.slice(index, index + 2).map(decodeScene));
        }
      })();
    }, 150);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [nearViewport, sceneReady, displayed.src, requestedSrc, ambience, floral, palette]);

  const paletteLabel = paletteOptions.find((option) => option.id === displayed.palette)?.label ?? displayed.palette;
  const changing = displayed.src !== requestedSrc;
  const status = failedSrc === requestedSrc ? "Scene unavailable. Try another choice." : "Updating garden…";
  return <>
    <div ref={frameRef} className="studio-art-frame" data-palette={displayed.palette} data-scene={displayed.src} role="img" aria-label={`Illustrated outdoor nikkah garden with a central aisle, styled dining, chandeliers, and a canopy at the far end; ${displayed.floral} florals, ${paletteLabel} palette, ${displayed.ambience} light`}>
      <Image
        src={displayed.src}
        alt=""
        fill
        sizes="(min-width: 900px) 700px, 100vw"
        className="studio-scene-image"
        unoptimized
        onLoad={() => setSceneReady(true)}
      />
      {changing && <span className="studio-image-status" aria-hidden="true">{status}</span>}
    </div>
    <span className="sr-only" role="status">{changing ? status : ""}</span>
  </>;
}
