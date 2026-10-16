import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Tashkeel Atelier. You have 47 Pinterest boards. We have a plan.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bride = await readFile(join(process.cwd(), "public/assets/images/characters/bride-share.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#F5F2EB", color: "#302B26", padding: "56px 68px", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 660, height: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 30 }}>Tashkeel Atelier</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 62, letterSpacing: -2, lineHeight: 1.1 }}><span>You have 47</span><span>Pinterest boards.</span><span style={{ color: "#926B31", marginTop: 16 }}>We have a plan.</span></div>
        <div style={{ display: "flex", fontSize: 17, color: "#786247" }}>Wedding design & planning · Lahore, Pakistan</div>
      </div>
      {/* ImageResponse requires a native image element. */}
      <img src={`data:image/png;base64,${bride.toString("base64")}`} width={360} height={540} alt="" style={{ objectFit: "contain" }} />
    </div>, size,
  );
}
