/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await page.locator("#wedding-studio").scrollIntoViewIfNeeded();
  const results = [];
  for (const ambience of ["Daylight", "Evening", "Night"]) {
    await page.getByRole("button", { name: ambience, exact: true }).click();
    for (const [palette, floral] of [["Ivory & blush", "Romantic"], ["Marigold & burgundy", "Traditional"], ["Olive & antique gold", "Sculptural"]]) {
      await page.getByRole("button", { name: palette, exact: true }).click();
      await page.getByRole("button", { name: floral, exact: true }).click();
      await page.waitForFunction(() => document.querySelector(".studio-art-frame")?.dataset.scene === document.querySelector(".studio-scene-image")?.getAttribute("src") && !document.querySelector(".studio-image-status"));
      const source = await page.locator(".studio-scene-image").getAttribute("src");
      await page.locator(".studio-scene-image").evaluate(image => image.decode());
      const width = await page.locator(".studio-scene-image").evaluate(image => image.naturalWidth);
      if (!width) throw new Error(`${ambience} / ${floral} image did not load`);
      await page.locator(".studio-art").screenshot({ path: `output/playwright/garden-${ambience.toLowerCase()}-${floral.toLowerCase()}.png`, style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
      results.push({ ambience, floral, source });
    }
  }
  return { passed: true, images: results.length };
}
