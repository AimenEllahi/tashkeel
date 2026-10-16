/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-object-float]")).transform !== "none");
  const transform = () => page.locator("[data-object-float]").first().evaluate(element => getComputedStyle(element).transform);
  await page.getByRole("button", { name: "Pause floating motion" }).click();
  const paused = await transform();
  await page.waitForTimeout(400);
  assert(await transform() === paused, "The pause control did not stop floating motion");
  await page.getByRole("button", { name: "Resume floating motion" }).click();
  await page.waitForTimeout(500);
  assert(await transform() !== paused, "Floating motion did not resume");
  await page.getByRole("link", { name: "Inquire", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("[data-atelier-scene]").getBoundingClientRect().bottom < 0);
  await page.waitForTimeout(300);
  const offscreen = await transform();
  await page.waitForTimeout(400);
  assert(await transform() === offscreen, "Offscreen floating animation should pause");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-object-float]")).transform === "none");
  assert(!await page.getByRole("button", { name: "Pause floating motion" }).isVisible(), "Motion control should hide when reduced motion is active");
  assert(await page.locator(".hero-heading").evaluate(element => getComputedStyle(element).opacity) === "1", "Reduced motion hides hero content");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Motion-enabled horizontal overflow at ${width}px`);
  }
  return { passed: true, checked: ["pause", "resume", "offscreen suspension", "reduced-motion cleanup", "visible static content", "motion-enabled responsive widths"] };
}
