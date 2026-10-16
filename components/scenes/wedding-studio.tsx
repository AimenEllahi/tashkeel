"use client";

import { Container } from "@/components/layout/container";
import { useExperience } from "@/components/experience/experience-provider";
import { StudioArtwork } from "@/components/scenes/studio-artwork";
import { ambienceOptions, floralOptions, paletteMaterials, paletteOptions, styleOptions } from "@/lib/experience";

export function WeddingStudio() {
  const { style, palette, floral, ambience, setPalette, setFloral, setAmbience } = useExperience();
  const paletteLabel = paletteOptions.find((option) => option.id === palette)?.label;
  const materials = paletteMaterials[palette];
  const floralLabel = floralOptions.find((option) => option.id === floral)?.label;
  const ambienceLabel = ambienceOptions.find((option) => option.id === ambience)?.label;
  return <section id="wedding-studio" className="studio-section scene-section" aria-labelledby="studio-heading">
    <Container>
      <div className="scene-intro"><p className="scene-kicker">02 / A setting of your own</p><h2 id="studio-heading" className="scene-heading">Blush or burgundy? <em>Let&apos;s see.</em></h2><p>Choose a colour direction for the garden, then try different flowers and light.</p></div>
      <div className="studio-invitation"><div>{style && <p className="studio-direction">Starting with {styleOptions.find((option) => option.id === style)?.title}.</p>}<p>Same garden. A completely different feeling after dark.</p></div><button type="button" className="studio-try-button" onClick={() => setAmbience(ambience === "night" ? "daylight" : "night")}>{ambience === "night" ? "Bring back daylight" : "See it after dark"}<span aria-hidden="true">↗</span></button></div>
      <div className="studio-layout">
        <div className="studio-art" data-palette={palette} data-floral={floral} data-ambience={ambience}><StudioArtwork ambience={ambience} floral={floral} palette={palette} /><span className="art-caption">An imagined nikkah garden · Styling study</span></div>
        <div className="studio-controls">
          <fieldset><legend>01 &nbsp; Colour palette</legend><p className="palette-help">Compare colours for the table linen, accent fabric and metal details.</p><div className="choice-list">{paletteOptions.map((option) => <button type="button" key={option.id} className="palette-choice" data-palette={option.id} aria-pressed={palette === option.id} onClick={() => setPalette(option.id)}><span className="palette-choice-swatch" aria-hidden="true" />{option.label}</button>)}</div><select className="mobile-choice" aria-label="Palette" value={palette} onChange={(event) => setPalette(event.target.value as typeof palette)}>{paletteOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select>
            <div className="palette-materials" data-palette={palette} aria-live="polite" aria-label={`${paletteLabel} styling details`}>
              <div className="palette-material"><span className="palette-material-sample palette-material-linen" aria-hidden="true" /><span><small>Table linen</small><strong>{materials.linen}</strong></span></div>
              <div className="palette-material"><span className="palette-material-sample palette-material-accent" aria-hidden="true" /><span><small>Accent fabric</small><strong>{materials.accent}</strong></span></div>
              <div className="palette-material"><span className="palette-material-sample palette-material-metal" aria-hidden="true" /><span><small>Metal detail</small><strong>{materials.metal}</strong></span></div>
            </div>
          </fieldset>
          <fieldset><legend>02 &nbsp; Florals</legend><div className="choice-list">{floralOptions.map((option) => <button type="button" key={option.id} aria-pressed={floral === option.id} onClick={() => setFloral(option.id)}>{option.label}</button>)}</div><select className="mobile-choice" aria-label="Florals" value={floral} onChange={(event) => setFloral(event.target.value as typeof floral)}>{floralOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></fieldset>
          <fieldset><legend>03 &nbsp; Time of day</legend><div className="choice-list">{ambienceOptions.map((option) => <button type="button" key={option.id} aria-pressed={ambience === option.id} onClick={() => setAmbience(option.id)}>{option.label}</button>)}</div><select className="mobile-choice" aria-label="Time of day" value={ambience} onChange={(event) => setAmbience(event.target.value as typeof ambience)}>{ambienceOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></fieldset>
          <p className="studio-summary" aria-live="polite">{paletteLabel} · {floralLabel?.toLowerCase()} florals · {ambienceLabel?.toLowerCase()}</p>
          <p className="studio-choice-note">These choices will appear in your inquiry draft.</p>
        </div>
      </div>
    </Container>
  </section>;
}
