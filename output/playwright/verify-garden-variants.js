/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });

  const palettes = [["Ivory & blush", "ivory-blush"], ["Marigold & burgundy", "marigold-burgundy"], ["Olive & antique gold", "olive-gold"]];
  const florals = [["Traditional", "traditional"], ["Romantic", "romantic"], ["Sculptural", "sculptural"]];
  const lights = [["Daylight", "daylight"], ["Evening", "evening"], ["Night", "night"]];
  const checked = [];
  for (const [paletteName, palette] of palettes) {
    await page.getByRole("button", { name: paletteName, exact: true }).click();
    for (const [floralName, floral] of florals) {
      await page.getByRole("button", { name: floralName, exact: true }).click();
      for (const [lightName, light] of lights) {
        await page.getByRole("button", { name: lightName, exact: true }).click();
        const image = page.locator(".studio-scene-image");
        const expected = `/assets/images/garden/${light}-${floral}${palette === "ivory-blush" ? "" : `-${palette}`}.webp`;
        const src = await image.getAttribute("src");
        assert(src.includes(encodeURIComponent(expected)), `Wrong scene for ${palette}/${floral}/${light}: ${src}`);
        const dimensions = await image.evaluate(async element => { await element.decode(); return [element.naturalWidth, element.naturalHeight]; });
        assert(dimensions[0] === 1100 && dimensions[1] > 0, `Broken scene for ${palette}/${floral}/${light}`);
        checked.push(`${palette}/${floral}/${light}`);
      }
    }
  }
  assert(checked.length === 27, "Not every garden combination was checked");
  assert(await page.locator(".studio-palette-wash").count() === 0, "Old tint layer still exists");
  assert(!errors.length, `Browser errors: ${errors.join("; ")}`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("combobox", { name: "Palette", exact: true }).selectOption("marigold-burgundy");
  await page.getByRole("combobox", { name: "Florals", exact: true }).selectOption("romantic");
  await page.getByRole("combobox", { name: "Time of day", exact: true }).selectOption("daylight");
  const mobileImage = page.locator(".studio-scene-image");
  assert((await mobileImage.getAttribute("src")).includes(encodeURIComponent("/assets/images/garden/daylight-romantic-marigold-burgundy.webp")), "Mobile controls did not select the palette artwork");
  await mobileImage.evaluate(element => element.decode());
  await page.locator("#wedding-studio").screenshot({ path: "output/playwright/garden-mobile-selected.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
  return { passed: true, combinations: checked.length, browserErrors: errors };
}
