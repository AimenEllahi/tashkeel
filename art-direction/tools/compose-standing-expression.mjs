import sharp from "sharp";

const [sourcePath, faceOutput, masterOutput] = process.argv.slice(2);
if (!sourcePath || !faceOutput || !masterOutput) {
  throw new Error("Usage: node compose-standing-expression.mjs expression.png face.webp master.png");
}
const basePath = "art-direction/character-master/standing/pose-01-cutout.png";
const metadata = await sharp(sourcePath).metadata();
if (metadata.width !== 1024 || metadata.height !== 1536) {
  throw new Error("Expression must use the canonical 1024 × 1536 standing canvas");
}
// The feathered inner-face mask excludes the hair, jewelry, chin hand, and outfit.
// The full canonical pose remains untouched beneath this tiny transparent overlay.
const mask = Buffer.from(`<svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="feather"><feGaussianBlur stdDeviation="4"/></filter></defs>
  <path d="M439 93Q484 77 529 95L551 119Q561 154 540 185Q518 212 480 210Q443 206 425 180Q408 155 417 124Z" fill="white" filter="url(#feather)"/>
</svg>`);
const face = await sharp(sourcePath).composite([{ input: mask, blend: "dest-in" }]).ensureAlpha().raw().toBuffer();
const base = await sharp(basePath).ensureAlpha().raw().toBuffer();
// Blend only inside the registered face area. A full-image compositor can round
// semitransparent hair-edge pixels even where the overlay is entirely empty.
for (let y = 0; y < 1536; y += 1) {
  for (let x = 0; x < 1024; x += 1) {
    const pixel = (y * 1024 + x) * 4;
    if (x < 390 || x > 580 || y < 65 || y > 230) {
      face.fill(0, pixel, pixel + 4);
      continue;
    }
    const faceAlpha = face[pixel + 3] / 255;
    if (!faceAlpha) continue;
    const baseAlpha = base[pixel + 3] / 255;
    const alpha = faceAlpha + baseAlpha * (1 - faceAlpha);
    for (let channel = 0; channel < 3; channel += 1) {
      base[pixel + channel] = Math.round((face[pixel + channel] * faceAlpha + base[pixel + channel] * baseAlpha * (1 - faceAlpha)) / alpha);
    }
    base[pixel + 3] = Math.round(alpha * 255);
  }
}
const raw = { width: 1024, height: 1536, channels: 4 };
await sharp(face, { raw }).resize({ width: 900 }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(faceOutput);
await sharp(base, { raw }).png().toFile(masterOutput);
console.log(`Saved aligned face overlay ${faceOutput} and full master ${masterOutput}`);
