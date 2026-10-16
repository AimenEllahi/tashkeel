import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "art-direction/garden");
const output = path.join(root, "public/assets/images/garden");
await mkdir(output, { recursive: true });

const width = 1100;
const lights = ["daylight", "evening", "night"];
const florals = ["romantic", "traditional", "sculptural"];
const palettes = ["marigold-burgundy", "olive-gold"];

// The floral edits share the same view. Feather only the designed flower beds,
// table arrangements, and canopy garlands so the lighting layer stays visible.
const flowerMask = Buffer.from(`<svg width="1536" height="1024" viewBox="0 0 1536 1024" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="feather" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="15" /></filter></defs>
  <g fill="white" filter="url(#feather)">
    <ellipse cx="160" cy="927" rx="240" ry="170"/><ellipse cx="1390" cy="931" rx="230" ry="175"/>
    <ellipse cx="566" cy="720" rx="125" ry="160"/><ellipse cx="966" cy="720" rx="125" ry="165"/>
    <ellipse cx="320" cy="591" rx="125" ry="90"/><ellipse cx="1220" cy="594" rx="135" ry="100"/>
    <ellipse cx="96" cy="614" rx="175" ry="155"/><ellipse cx="1440" cy="615" rx="160" ry="150"/>
    <ellipse cx="755" cy="351" rx="187" ry="90"/><ellipse cx="627" cy="440" rx="45" ry="135"/><ellipse cx="932" cy="440" rx="43" ry="138"/>
    <ellipse cx="222" cy="281" rx="255" ry="104"/><ellipse cx="1395" cy="367" rx="205" ry="105"/>
  </g>
</svg>`);

// Restrict palette edits to the designed tables and floral décor. The camera,
// architecture, sky, aisle and trees remain registered across every choice.
const paletteMask = Buffer.from(`<svg width="1536" height="1024" viewBox="0 0 1536 1024" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="feather" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="19" /></filter></defs>
  <g fill="white" filter="url(#feather)">
    <ellipse cx="160" cy="927" rx="260" ry="180"/><ellipse cx="1390" cy="931" rx="250" ry="185"/>
    <ellipse cx="566" cy="720" rx="130" ry="165"/><ellipse cx="966" cy="720" rx="130" ry="165"/>
    <ellipse cx="320" cy="591" rx="175" ry="110"/><ellipse cx="1220" cy="594" rx="180" ry="110"/>
    <ellipse cx="90" cy="664" rx="230" ry="185"/><ellipse cx="1450" cy="664" rx="230" ry="185"/>
    <ellipse cx="755" cy="351" rx="187" ry="90"/><ellipse cx="627" cy="440" rx="45" ry="135"/><ellipse cx="932" cy="440" rx="43" ry="138"/>
    <ellipse cx="222" cy="281" rx="255" ry="104"/><ellipse cx="1395" cy="367" rx="205" ry="105"/>
  </g>
</svg>`);

const loadRaw = async (file) => sharp(file).removeAlpha().raw().toBuffer();
const baseDay = await loadRaw(path.join(source, "daylight-source.png"));
const mask = await sharp(flowerMask).extractChannel(3).raw().toBuffer();
const colorMask = await sharp(paletteMask).extractChannel(3).raw().toBuffer();
const sources = {
  romantic: baseDay,
  traditional: await loadRaw(path.join(source, "traditional-source.png")),
  sculptural: await loadRaw(path.join(source, "sculptural-source.png")),
};
const paletteSources = Object.fromEntries(await Promise.all(palettes.map(async (palette) => [palette, {
  romantic: await loadRaw(path.join(source, `${palette}-source.png`)),
  traditional: await loadRaw(path.join(source, `${palette}-traditional-source.png`)),
  sculptural: await loadRaw(path.join(source, `${palette}-sculptural-source.png`)),
}])));

function applyPalette(litPixels, daylightReference, paletteEdit) {
  const pixels = Buffer.alloc(litPixels.length);
  for (let index = 0; index < litPixels.length; index += 3) {
    const opacity = colorMask[index / 3] / 255;
    for (let channel = 0; channel < 3; channel++) {
      // Transfer each edited object's color while retaining the selected
      // lighting's local shadows and highlights, including after dark.
      const ratio = Math.min(2.8, (paletteEdit[index + channel] + 6) / (daylightReference[index + channel] + 6));
      const recolored = Math.min(255, Math.round(litPixels[index + channel] * ratio));
      pixels[index + channel] = Math.round(litPixels[index + channel] * (1 - opacity) + recolored * opacity);
    }
  }
  return pixels;
}

async function saveView(pixels, filename) {
  await sharp(pixels, { raw: { width: 1536, height: 1024, channels: 3 } })
    .resize({ width })
    .webp({ quality: 77, effort: 6 })
    .toFile(path.join(output, filename));
}

for (const light of lights) {
  const litBase = light === "daylight" ? baseDay : await loadRaw(path.join(source, `${light}-source.png`));
  for (const floral of florals) {
    let pixels = litBase;
    if (floral !== "romantic") {
      const edited = sources[floral];
      pixels = Buffer.alloc(litBase.length);
      for (let index = 0; index < litBase.length; index += 3) {
        const opacity = mask[index / 3] / 255;
        for (let channel = 0; channel < 3; channel++) {
          const difference = edited[index + channel] - baseDay[index + channel];
          pixels[index + channel] = Math.max(0, Math.min(255, Math.round(litBase[index + channel] + difference * opacity)));
        }
      }
    }
    await saveView(pixels, `${light}-${floral}.webp`);
    for (const palette of palettes) {
      await saveView(applyPalette(pixels, sources[floral], paletteSources[palette][floral]), `${light}-${floral}-${palette}.webp`);
    }
  }
}

await sharp(path.join(root, "art-direction/founder/hafsa-illustration-source.png"))
  .resize({ width: 900 })
  .webp({ quality: 82, effort: 6 })
  .toFile(path.join(root, "public/assets/images/founder/hafsa-illustration.webp"));
