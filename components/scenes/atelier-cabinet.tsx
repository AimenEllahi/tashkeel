"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";

const drawers = [
  { id: "invitation", title: "Invitations", detail: "A first glimpse of the celebration, shaped by its colours, story and sense of occasion." },
  { id: "flowers", title: "Floral details", detail: "From gajray to sculptural arrangements, flowers can give every space its own rhythm." },
  { id: "favors", title: "Wedding favors", detail: "Small, thoughtful things for guests to take home and remember." },
  { id: "table", title: "Tablescapes", detail: "Textiles, flowers, candlelight and place settings considered together." },
  { id: "stationery", title: "Stationery", detail: "Menus, signs and little paper moments that make the whole story feel connected." },
  { id: "guests", title: "Guest experience", detail: "The flow and thoughtful touches that help everyone feel welcome." },
] as const;

function CabinetIcon({ kind }: { kind: (typeof drawers)[number]["id"] }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg viewBox="0 0 100 100" aria-hidden="true" {...shared}>
    {kind === "invitation" && <><rect x="18" y="25" width="64" height="50" rx="2" /><path d="m18 29 32 25 32-25M18 72l24-22m40 22L58 50" /><circle cx="50" cy="54" r="7" fill="var(--ochre)" stroke="none" /></>}
    {kind === "flowers" && <><path d="M50 54v31M50 75q-17-18-24-7 10 15 24 11m0-12q17-16 25-7-8 17-25 17" /><circle cx="50" cy="36" r="9" /><path d="M50 27q-15-14-20 0 2 11 13 11-16 1-11 15 10 9 18-6 8 15 18 6 5-14-11-15 11 0 13-11-5-14-20 0Z" /></>}
    {kind === "favors" && <><rect x="25" y="41" width="50" height="40" rx="3" /><path d="M20 41h60v-9H20Zm30 0v40M50 32q-26 0-22-15 12-11 22 15Zm0 0q26 0 22-15-12-11-22 15Z" /></>}
    {kind === "table" && <><path d="M15 53h70l-8 11H23Zm13 11-4 22m48-22 4 22M50 53V24m-14 7q14-25 28 0M50 24v-8" /><circle cx="50" cy="35" r="5" /><path d="M20 47h13m34 0h13" /></>}
    {kind === "stationery" && <><path d="M24 14h44l10 10v62H24Z" /><path d="M68 14v13h10M35 41h32M35 52h27M35 63h32M35 74h20" /></>}
    {kind === "guests" && <><path d="M20 74q5-21 25-21 20 0 25 21M45 52q-13 0-13-15t13-15 13 15-13 15Zm24-1q16 3 18 23H75m-7-47q14-3 14 10 0 12-13 13" /></>}
  </svg>;
}

export function AtelierCabinet() {
  const [selected, setSelected] = useState<(typeof drawers)[number]>(drawers[0]);
  return <section id="little-things" className="cabinet-section scene-section" aria-labelledby="cabinet-heading">
    <Container>
      <div className="scene-intro"><p className="scene-kicker">03 / The little things</p><h2 id="cabinet-heading" className="scene-heading">And then there are <em>the other 146 decisions.</em></h2><p>Open a drawer. The smallest choices often make the celebration feel most like you.</p></div>
      <div className="cabinet-layout">
        <div className="atelier-cabinet" role="group" aria-label="Explore atelier details">
          <div className="cabinet-crest" aria-hidden="true">T / A</div>
          <div className="cabinet-shelves">{drawers.map((drawer) => <button key={drawer.id} type="button" className="cabinet-drawer" aria-label={`Open ${drawer.title}`} aria-pressed={selected.id === drawer.id} onClick={() => setSelected(drawer)}><span className="cabinet-icon"><CabinetIcon kind={drawer.id} /></span><span className="cabinet-handle" aria-hidden="true" /><span className="cabinet-drawer-label">{drawer.title}</span></button>)}</div>
          <div className="cabinet-plinth" aria-hidden="true" />
        </div>
        <div className="cabinet-detail" aria-live="polite"><p className="scene-kicker">From the atelier</p><div className="detail-icon"><CabinetIcon kind={selected.id} /></div><h3>{selected.title}</h3><p>{selected.detail}</p><span className="detail-end" aria-hidden="true">✳</span></div>
      </div>
    </Container>
  </section>;
}
