/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  const positions = await page.locator(".plan-board").evaluate(element => {
    const top = element.getBoundingClientRect().top + scrollY;
    const height = element.getBoundingClientRect().height;
    return { start: top - innerHeight * 0.95, end: top + height / 2 - innerHeight * 0.55 };
  });
  await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), (positions.start + positions.end) / 2);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "output/playwright/moodboard-arranging-mobile.png", style: ".site-header{visibility:hidden!important}" });
  await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), positions.end + 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "output/playwright/moodboard-settled-mobile.png", style: ".site-header{visibility:hidden!important}" });
  return { captured: true };
}
