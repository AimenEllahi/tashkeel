import sharp from "sharp";

const [input, output, widthArg] = process.argv.slice(2);
if (!input || !output || !widthArg) {
  console.error("Usage: node export-cutout.mjs input.png output.webp width");
  process.exit(2);
}

const targetWidth = Number(widthArg);
if (!Number.isInteger(targetWidth) || targetWidth < 1) {
  throw new Error("Width must be a positive integer");
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width;
let top = info.height;
let right = -1;
let bottom = -1;

for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const alpha = data[(y * info.width + x) * info.channels + 3];
    if (alpha <= 16) continue;
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }
}

if (right < left) throw new Error("No visible pixels found");
const padding = Math.round(Math.max(right - left, bottom - top) * 0.055);
left = Math.max(0, left - padding);
top = Math.max(0, top - padding);
right = Math.min(info.width - 1, right + padding);
bottom = Math.min(info.height - 1, bottom + padding);

await sharp(input)
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize({ width: targetWidth, withoutEnlargement: true })
  .webp({ quality: 84, effort: 6 })
  .toFile(output);

console.log(`${output}: crop ${left},${top} ${right - left + 1}x${bottom - top + 1}`);
