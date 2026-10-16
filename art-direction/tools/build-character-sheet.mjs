import sharp from "sharp";

const base = "art-direction/character-master/";
const width = 1600;
const height = 900;
const characterWidth = 770;

const [curious, overwhelmed] = await Promise.all([
  sharp(`${base}pose-01-curious.png`).resize({ width: characterWidth }).png().toBuffer(),
  sharp(`${base}pose-01-overwhelmed.png`).resize({ width: characterWidth }).png().toBuffer(),
]);

const labels = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <text x="76" y="72" font-family="Georgia, serif" font-size="39" fill="#302B26">Tashkeel Atelier</text>
  <text x="77" y="105" font-family="Arial, sans-serif" font-size="14" letter-spacing="3" fill="#8E6F42">CHARACTER MASTER · HERO POSE 01</text>
  <line x1="800" y1="145" x2="800" y2="825" stroke="#D5C7AA"/>
  <text x="400" y="178" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#302B26">Curious</text>
  <text x="1200" y="178" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#302B26">Overwhelmed</text>
  <text x="800" y="860" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#66584A">One seated pose · one outfit and silhouette · expression changes confined to the face</text>
</svg>`);

await sharp({ create: { width, height, channels: 4, background: "#F5F2EB" } })
  .composite([
    { input: curious, left: 15, top: 210 },
    { input: overwhelmed, left: 815, top: 210 },
    { input: labels, left: 0, top: 0 },
  ])
  .png()
  .toFile(`${base}character-sheet.png`);

console.log(`Saved ${base}character-sheet.png`);
