/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const landings = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    for (const [id, content] of [["your-style", ".style-options"], ["wedding-studio", ".studio-invitation"], ["little-things", ".atelier-cabinet"], ["what-we-do", ".venue-map"]]) {
      await page.evaluate(target => { location.hash = `#${target}`; }, id);
      await page.waitForTimeout(120);
      const top = await page.locator(content).evaluate(element => element.getBoundingClientRect().top);
      landings.push({ width, section: id, contentTop: Math.round(top) });
      assert(top < 900, `${width}px: ${id} still lands with its interactive content below the viewport (${top}px)`);
      await page.screenshot({ path: `output/playwright/landing-${id}-${width}.png`, style: ".skip-link,nextjs-portal{visibility:hidden!important}" });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  const variations = [];
  for (const [name, palette, materials] of [["Ivory & blush", "ivory-blush", ["Ivory", "Blush", "Antique brass"]], ["Marigold & burgundy", "marigold-burgundy", ["Burgundy", "Marigold", "Antique brass"]], ["Olive & antique gold", "olive-gold", ["Olive", "Ivory", "Antique gold"]]]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert(await page.locator(".studio-art-frame").getAttribute("data-palette") === palette, `Palette ${name} did not reach the scene`);
    const materialNames = await page.locator(".palette-material strong").allInnerTexts();
    assert(materialNames.join("|") === materials.join("|"), `Palette ${name} did not update its material preview`);
    const imagePath = `/assets/images/garden/daylight-romantic${palette === "ivory-blush" ? "" : `-${palette}`}.webp`;
    const source = await page.locator(".studio-scene-image").getAttribute("src");
    assert(source.includes(encodeURIComponent(imagePath)), `${name} did not select its own garden artwork`);
    assert(await page.locator(".studio-palette-wash").count() === 0, "The old tint layer is still present");
    await page.locator(".studio-scene-image").evaluate(image => image.decode());
    await page.locator(".studio-art-frame").screenshot({ path: `output/playwright/palette-${palette}.png` });
    await page.locator(".studio-layout").screenshot({ path: `output/playwright/palette-layout-${palette}.png` });
    variations.push({ palette, source: imagePath });
  }
  assert(new Set(variations.map(variation => variation.source)).size === 3, "Palette artwork is identical");
  return { passed: true, landings, palettes: variations };
}
