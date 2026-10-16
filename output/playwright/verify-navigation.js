/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const widths = [320, 390, 768, 1024, 1440];
  const links = [
    ["Explore", "atelier-stage"],
    ["What We Do", "what-we-do"],
    ["The Atelier", "the-atelier"],
    ["Inquire", "inquire"],
  ];
  const results = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    assert(await nav.isVisible(), `${width}px: main navigation is hidden`);
    for (const [label, id] of links) {
      const link = nav.getByRole("link", { name: label, exact: true });
      const box = await link.boundingBox();
      assert(box && box.width > 30 && box.height >= 44 && box.x >= 0 && box.x + box.width <= width + 1, `${width}px: ${label} is clipped or too small`);
      await link.click();
      await page.waitForTimeout(100);
      const metrics = await page.evaluate((targetId) => ({
        hash: location.hash,
        targetTop: document.getElementById(targetId).getBoundingClientRect().top,
        headerBottom: document.querySelector(".site-header").getBoundingClientRect().bottom,
        horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      }), id);
      assert(metrics.hash === `#${id}`, `${width}px: ${label} opens the wrong destination`);
      assert(metrics.targetTop >= metrics.headerBottom - 3, `${width}px: sticky header covers ${label} (${JSON.stringify(metrics)})`);
      assert(metrics.horizontalOverflow <= 0, `${width}px: horizontal overflow after ${label}`);
    }
    if (width >= 900) {
      await page.getByRole("link", { name: "Let's Plan" }).click();
      assert(await page.evaluate(() => location.hash) === "#inquire", `${width}px: Let's Plan does not reach inquiry`);
    }
    await page.getByRole("link", { name: "Tashkeel Atelier home" }).click();
    assert(await page.evaluate(() => scrollY) < 2, `${width}px: wordmark does not return to top`);
    await page.getByRole("link", { name: "Explore the Atelier" }).click();
    assert(await page.evaluate(() => location.hash) === "#atelier-stage", `${width}px: hero scroll cue does not reach the moodboard`);
    results.push({ width, links: links.length + (width >= 900 ? 1 : 0), headerClearance: true });
  }
  return { passed: true, results };
}
