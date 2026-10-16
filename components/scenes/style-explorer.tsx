"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { useExperience } from "@/components/experience/experience-provider";
import { ambienceOptions, floralOptions, paletteOptions, styleOptions, stylePresets } from "@/lib/experience";

export function StyleExplorer() {
  const { style, setStyle } = useExperience();
  const chosen = styleOptions.find((option) => option.id === style);
  const preview = style ? stylePresets[style] : null;
  const paletteName = preview ? paletteOptions.find((option) => option.id === preview.palette)?.label : "";
  const floralName = preview ? floralOptions.find((option) => option.id === preview.floral)?.label : "";
  const ambienceName = preview ? ambienceOptions.find((option) => option.id === preview.ambience)?.label : "";
  return (
    <section id="your-style" className="style-section scene-section" data-direction={style ?? "none"} aria-labelledby="style-heading">
      <Container>
        <div className="scene-intro">
          <p className="scene-kicker">01 / What feels like you?</p>
          <h2 id="style-heading" className="scene-heading">Forget what everyone&apos;s doing. <em>What feels like you?</em></h2>
          <p>Choose a direction, then make it your own in the garden studio below.</p>
        </div>
        <div className="style-options" role="group" aria-label="Wedding style direction">
          {styleOptions.map((option, index) => <button key={option.id} type="button" className="style-option" data-selected={style === option.id} aria-pressed={style === option.id} onClick={() => setStyle(option.id)}>
            <span className="style-image"><Image src={option.image} alt="" fill sizes="(min-width: 900px) 29vw, (min-width: 700px) 30vw, 74vw" /></span>
            <span className="style-number">0{index + 1}</span>
            <span className="style-title">{option.title}</span>
            <span className="style-description">{option.description}</span>
            {style === option.id && <span className="style-mini-recipe">{paletteName} <span aria-hidden="true">·</span> {floralName} florals <span aria-hidden="true">·</span> {ambienceName} light</span>}
            <span className="style-action">{style === option.id ? "Selected direction" : "Explore this direction"}<span aria-hidden="true">↗</span></span>
          </button>)}
        </div>
        {chosen && preview ? <div className="style-preview" id="style-preview" key={style}>
          <div className="style-palette" data-palette={preview.palette} aria-hidden="true"><i /><i /><i /></div>
          <div className="style-preview-copy"><p className="scene-kicker">Your starting direction</p><h3>{chosen.title}</h3><p>{paletteName} · {floralName} florals · {ambienceName} light</p></div>
          <a className="style-preview-link" href="#wedding-studio">Make it yours in the studio <span aria-hidden="true">↗</span></a>
        </div> : <p className="style-start-note">Pick the one you&apos;re drawn to. We&apos;ll show you where it could begin.</p>}
        <span className="sr-only" role="status">{chosen ? `${chosen.title} selected. Matching studio controls are ready.` : ""}</span>
      </Container>
    </section>
  );
}
