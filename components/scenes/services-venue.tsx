"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";

const areas = [
  { id: "stage", number: "01", title: "Stage & entertainment", copy: "Design the moment, then make it happen: stage styling, lighting, live music and entertainment coordination.", services: "Stage design · lighting · artist coordination" },
  { id: "dining", number: "02", title: "Dining & guests", copy: "Consider the whole guest experience, from thoughtful seating and table styling to catering coordination and comfort.", services: "Catering coordination · tablescapes · guest flow" },
  { id: "decor", number: "03", title: "Decor & production", copy: "Bring the concept into the space with florals, installations, textiles and the production details behind them.", services: "Florals · decor production · venue styling" },
  { id: "planning", number: "04", title: "The planning desk", copy: "Keep all the moving pieces in hand: vendors, timelines, logistics and calm coordination on the day.", services: "Vendor management · timelines · wedding-day coordination" },
] as const;

function VenueIllustration() {
  return <svg viewBox="0 0 780 515" className="venue-illustration" role="img" aria-label="Illustrated venue plan with stage, dining, decor, and planning areas" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="venue-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#b89758" strokeWidth=".6" opacity=".25" /></pattern></defs>
    <rect width="780" height="515" rx="16" fill="#eee7d8" />
    <rect width="780" height="515" rx="16" fill="url(#venue-grid)" />
    <path d="M68 440V99Q390-45 712 99v341Z" fill="#f8f4e9" stroke="#af905b" strokeWidth="4" />
    <path d="M90 426V115Q390-16 690 115v311Z" fill="none" stroke="#c3a978" strokeWidth="1.5" />
    <path d="M278 440V168Q390 100 502 168v272" fill="none" stroke="#d2bc91" strokeDasharray="6 9" strokeWidth="2" />
    <path d="M255 171q135-103 270 0v63H255Z" fill="#e7d3ba" stroke="#af905b" strokeWidth="3" />
    <path d="M275 174q115-77 230 0" fill="none" stroke="#c9822c" strokeWidth="8" strokeLinecap="round" strokeDasharray="7 11" />
    <path d="M294 235h192l-15 34H309Z" fill="#bf8d72" stroke="#8d6e52" strokeWidth="2" />
    <path d="M329 241v-33h122v33" fill="#f7eee2" stroke="#8d6e52" strokeWidth="2" />
    <path d="M342 223h97" stroke="#b89758" strokeWidth="2" />
    <g fill="#e8d8bb" stroke="#9f835d" strokeWidth="2"><circle cx="159" cy="300" r="48" /><circle cx="621" cy="300" r="48" /><circle cx="237" cy="388" r="43" /><circle cx="543" cy="388" r="43" /></g>
    <g fill="#faf5eb" stroke="#b89758" strokeWidth="1"><circle cx="159" cy="300" r="29" /><circle cx="621" cy="300" r="29" /><circle cx="237" cy="388" r="25" /><circle cx="543" cy="388" r="25" /></g>
    <g fill="#b89758"><circle cx="159" cy="300" r="7" /><circle cx="621" cy="300" r="7" /><circle cx="237" cy="388" r="6" /><circle cx="543" cy="388" r="6" /></g>
    <g fill="#c9822c"><circle cx="154" cy="264" r="5" /><circle cx="626" cy="264" r="5" /><circle cx="232" cy="353" r="5" /><circle cx="548" cy="353" r="5" /></g>
    <g fill="#a8a16f" stroke="#777451" strokeWidth="1.5"><circle cx="119" cy="177" r="25" /><circle cx="661" cy="177" r="25" /><circle cx="104" cy="382" r="20" /><circle cx="676" cy="382" r="20" /></g>
    <g fill="none" stroke="#b89758" strokeWidth="3"><path d="M140 154q10 26 24 44M647 154q-10 26-24 44M94 355q20 26 34 39M686 355q-20 26-34 39" /></g>
    <rect x="339" y="330" width="102" height="82" rx="5" fill="#e2caaa" stroke="#a08159" strokeWidth="2" />
    <path d="M351 346h74M351 361h48M351 376h61" stroke="#a08159" strokeWidth="2" />
    <circle cx="425" cy="379" r="5" fill="#c9822c" />
    <path d="M68 440h644" stroke="#af905b" strokeWidth="4" />
  </svg>;
}

export function ServicesVenue() {
  const [selected, setSelected] = useState<(typeof areas)[number]>(areas[0]);
  return <section id="what-we-do" className="services-section scene-section" aria-labelledby="services-heading">
    <Container>
      <div className="scene-intro"><p className="scene-kicker">04 / Making it happen</p><h2 id="services-heading" className="scene-heading">Beautiful is one thing. <em>Making it happen is another.</em></h2><p>Tashkeel looks after the vision and the many practical decisions that bring a celebration to life.</p></div>
      <div className="services-layout">
        <div className="venue-map"><VenueIllustration />{areas.map((area) => <button key={area.id} type="button" className={`venue-hotspot hotspot-${area.id}`} aria-label={`Explore ${area.title}`} aria-pressed={selected.id === area.id} onClick={() => setSelected(area)}>{area.number}</button>)}<span className="art-caption">An illustrated planning map</span></div>
        <div className="service-detail"><p className="scene-kicker">Explore the venue</p><div className="service-area-list" role="group" aria-label="Service areas">{areas.map((area) => <button key={area.id} type="button" aria-pressed={selected.id === area.id} onClick={() => setSelected(area)}><span>{area.number}</span> {area.title}</button>)}</div><div className="service-story" aria-live="polite"><h3>{selected.title}</h3><p>{selected.copy}</p><small>{selected.services}</small></div></div>
      </div>
    </Container>
  </section>;
}
