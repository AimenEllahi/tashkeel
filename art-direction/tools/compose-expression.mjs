import sharp from "sharp";

const [basePath, expressionPath, outputPath] = process.argv.slice(2);
if (!basePath || !expressionPath || !outputPath) {
  console.error("Usage: node compose-expression.mjs base.png expression.png output.png");
  process.exit(2);
}

async function main() {
  const base = await sharp(basePath).metadata();
  const expression = await sharp(expressionPath).metadata();
  if (base.width !== expression.width || base.height !== expression.height) {
    throw new Error("Expression canvases must match exactly");
  }

  // The generator alters fabric between frames. Keep the canonical pose and reveal
  // only the brow, eyes, cheeks, and mouth from the expression image.
  const mask = Buffer.from(`<svg width="${base.width}" height="${base.height}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="soft"><feGaussianBlur stdDeviation="10"/></filter></defs>
    <ellipse cx="778" cy="262" rx="104" ry="100" fill="white" filter="url(#soft)"/>
  </svg>`);
  const expressionFace = await sharp(expressionPath)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(basePath)
    .composite([{ input: expressionFace }])
    .png()
    .toFile(outputPath);
  console.log(`Saved aligned expression to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
