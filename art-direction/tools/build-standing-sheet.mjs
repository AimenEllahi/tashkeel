import sharp from "sharp";

const directory = "art-direction/character-master/standing";
const states = [
  ["Curious", "pose-01-cutout"], ["Overwhelmed", "overwhelmed-master"],
  ["Thinking", "thinking-master"], ["Delighted", "delighted-master"], ["Relaxed", "relaxed-master"],
];
const base = await sharp(`${directory}/pose-01-cutout.png`).ensureAlpha().raw().toBuffer();
const layers = [];
for (const [index, [label, name]] of states.entries()) {
  const file = `${directory}/${name}.png`;
  const data = await sharp(file).ensureAlpha().raw().toBuffer();
  let changedOutsideFace = 0;
  for (let y = 0; y < 1536; y += 1) {
    for (let x = 0; x < 1024; x += 1) {
      if (x >= 390 && x <= 580 && y >= 65 && y <= 230) continue;
      const pixel = (y * 1024 + x) * 4;
      if (base[pixel + 3] === 0 && data[pixel + 3] === 0) continue;
      if (base.subarray(pixel, pixel + 4).compare(data.subarray(pixel, pixel + 4)) !== 0) changedOutsideFace += 1;
    }
  }
  if (changedOutsideFace) throw new Error(`${label}: ${changedOutsideFace} pixels changed outside the face`);
  layers.push({ input: await sharp(file).extract({ left: 380, top: 65, width: 205, height: 175 }).resize(328, 280).png().toBuffer(), left: index * 328, top: 0 });
  layers.push({ input: Buffer.from(`<svg width="328" height="50" xmlns="http://www.w3.org/2000/svg"><text x="164" y="31" text-anchor="middle" fill="#302b26" font-family="Georgia,serif" font-size="20">${label}</text></svg>`), left: index * 328, top: 280 });
}
await sharp({ create: { width: 1640, height: 330, channels: 4, background: "#F5F2EB" } }).composite(layers).png().toFile(`${directory}/expression-comparison.png`);
console.log("All five states preserve every visible pixel outside the face. Comparison sheet saved.");
