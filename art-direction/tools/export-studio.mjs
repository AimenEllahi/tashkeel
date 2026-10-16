import sharp from "sharp";

const width = 1000;
await sharp("art-direction/studio/romantic-source.png").resize({ width }).webp({ quality: 84, effort: 6 }).toFile("public/assets/images/studio/romantic-base.webp");
const mask = Buffer.from(`<svg width="1536" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><filter id="soft"><feGaussianBlur stdDeviation="10"/></filter></defs><g fill="white" filter="url(#soft)"><rect x="80" y="355" width="450" height="500" rx="40"/><rect x="1006" y="355" width="450" height="500" rx="40"/></g></svg>`);
for (const floral of ["traditional", "sculptural"]) {
  const layer = await sharp(`art-direction/studio/${floral}-source.png`).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  await sharp(layer).resize({ width }).webp({ quality: 84, alphaQuality: 100, effort: 6 }).toFile(`public/assets/images/studio/${floral}-layer.webp`);
}
console.log("Exported one base and two registered floral-region overlays at 1000 px width.");
