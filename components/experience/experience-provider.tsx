"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { stylePresets, type AmbienceChoice, type FloralChoice, type PaletteChoice, type StyleChoice } from "@/lib/experience";

type Experience = {
  style: StyleChoice | null;
  palette: PaletteChoice;
  floral: FloralChoice;
  ambience: AmbienceChoice;
  hasCustomized: boolean;
  setStyle: (value: StyleChoice) => void;
  setPalette: (value: PaletteChoice) => void;
  setFloral: (value: FloralChoice) => void;
  setAmbience: (value: AmbienceChoice) => void;
};

const ExperienceContext = createContext<Experience | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [style, setStyleValue] = useState<StyleChoice | null>(null);
  const [palette, setPaletteValue] = useState<PaletteChoice>("ivory-blush");
  const [floral, setFloralValue] = useState<FloralChoice>("romantic");
  const [ambience, setAmbienceValue] = useState<AmbienceChoice>("daylight");
  const [hasCustomized, setHasCustomized] = useState(false);
  const setStyle = useCallback((value: StyleChoice) => {
    const preset = stylePresets[value];
    setStyleValue(value);
    setPaletteValue(preset.palette);
    setFloralValue(preset.floral);
    setAmbienceValue(preset.ambience);
    setHasCustomized(true);
  }, []);
  const setPalette = useCallback((value: PaletteChoice) => { setPaletteValue(value); setHasCustomized(true); }, []);
  const setFloral = useCallback((value: FloralChoice) => { setFloralValue(value); setHasCustomized(true); }, []);
  const setAmbience = useCallback((value: AmbienceChoice) => { setAmbienceValue(value); setHasCustomized(true); }, []);
  const value = useMemo(() => ({ style, palette, floral, ambience, hasCustomized, setStyle, setPalette, setFloral, setAmbience }), [style, palette, floral, ambience, hasCustomized, setStyle, setPalette, setFloral, setAmbience]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error("ExperienceProvider is missing");
  return value;
}
