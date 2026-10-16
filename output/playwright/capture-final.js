/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const origin = "http://localhost:3002";
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/page-review-missing`, { waitUntil: "networkidle" });
  if (await page.getByRole("heading", { name: "Let's find your way back." }).count() !== 1) throw new Error("The branded 404 did not render");
  await page.screenshot({ path: "output/playwright/final-not-found.png" });
  const robots = await page.request.get(`${origin}/robots.txt`);
  if (robots.status() !== 200 || !(await robots.text()).includes("Allow: /")) throw new Error("robots.txt is missing");
  const social = await page.request.get(`${origin}/opengraph-image`);
  if (social.status() !== 200 || !social.headers()["content-type"].includes("image/png")) throw new Error("Social image failed to render");
  await page.goto(`${origin}/opengraph-image`);
  await page.locator("img").screenshot({ path: "output/playwright/final-social-image.png" });
  await page.goto(origin, { waitUntil: "networkidle" });
  if (!await page.locator("meta[property='og:image']").count()) throw new Error("Social image metadata is missing");
  await page.locator("img").evaluateAll(images => Promise.all(images.map(image => { image.loading = "eager"; return image.decode().catch(() => {}); })));
  await page.screenshot({ path: "output/playwright/final-home-desktop.png", fullPage: true, style: ".skip-link{visibility:hidden!important}" });
  await page.screenshot({ path: "output/playwright/final-hero-desktop.png", style: ".skip-link{visibility:hidden!important}" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "output/playwright/final-home-mobile.png", fullPage: true, style: ".skip-link{visibility:hidden!important}" });
  await page.screenshot({ path: "output/playwright/final-hero-mobile.png", style: ".skip-link{visibility:hidden!important}" });
  for (const id of ["your-style", "wedding-studio", "little-things", "what-we-do", "inquire"]) {
    await page.locator(`#${id}`).screenshot({ path: `output/playwright/final-${id}-mobile.png`, style: ".site-header,.skip-link{visibility:hidden!important}" });
  }
  return { passed: true, checked: ["branded 404", "robots.txt", "generated social image", "sharing metadata", "final desktop and mobile screenshots"] };
}
