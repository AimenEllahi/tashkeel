/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Bridal ring box. See the bride's reaction." }).click();
  await page.locator(".bride-character img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.locator(".editorial-hero").screenshot({ path: "output/playwright/interaction-hero-selected-mobile.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });

  await page.getByRole("button", { name: "Bring the ideas together" }).click();
  await page.getByRole("button", { name: "Explore Blush table styling concept" }).click();
  await page.locator("#atelier-stage").screenshot({ path: "output/playwright/interaction-board-arranged-mobile.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });

  await page.getByRole("button", { name: /Old-School Pakistani Charm/ }).click();
  await page.locator("#style-preview img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.locator("#your-style").screenshot({ path: "output/playwright/interaction-style-preview-mobile.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });

  await page.getByRole("button", { name: "See it after dark" }).click();
  await page.locator(".studio-art img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.locator("#wedding-studio").screenshot({ path: "output/playwright/interaction-studio-night-mobile.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
  return { passed: true, captures: 4 };
}
