"use client";

import { useState } from "react";
import { BrideCharacter } from "@/components/characters/bride-character";
import type { BrideState } from "@/components/characters/bride-character";
import { useExperience } from "@/components/experience/experience-provider";
import { InspirationObject } from "@/components/home/inspiration-object";
import { brideAssets, inspirationObjects } from "@/lib/hero-assets";
import type { StyleChoice } from "@/lib/experience";

export function AtelierScene() {
  const { style } = useExperience();
  const [selection, setSelection] = useState<{ id: string | null; state: BrideState; style: StyleChoice | null }>({ id: null, state: "overwhelmed", style: null });
  const state = style !== selection.style ? "relaxed" : selection.state;
  const selectedObject = style === selection.style ? inspirationObjects.find((object) => object.id === selection.id) : undefined;
  return (
    <div className="hero-play-area">
      <div className="atelier-scene" data-atelier-scene>
        <div className="character-stage" data-empty={!brideAssets[state]}>
          <BrideCharacter state={state} assets={brideAssets} preload />
        </div>
        {inspirationObjects.map((object) => <InspirationObject key={object.id} object={object} selected={selectedObject?.id === object.id} onSelect={() => setSelection({ id: object.id, state: object.reaction ?? "curious", style })} />)}
      </div>
      <p className="hero-reaction" aria-hidden="true" data-active={Boolean(selectedObject)}>{selectedObject && <><span>On her mind</span><strong>{selectedObject.label}</strong></>}</p>
      <span className="sr-only" role="status">{selectedObject ? `The bride is ${state} as she considers “${selectedObject.label}”.` : ""}</span>
    </div>
  );
}
