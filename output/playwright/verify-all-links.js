/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const widths = [320, 390, 768, 1024, 1440];
  const results = [];
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Contemporary Romance/ }).click();
    const links = await page.locator("a[href^='#']").evaluateAll(elements => elements.map(element => ({ href: element.getAttribute("href"), label: element.getAttribute("aria-label") || element.textContent.trim() })));
    const checked = [];
    for (const [index, { href, label }] of links.entries()) {
      assert(href.length > 1, `${width}px: empty anchor on ${label}`);
      const id = href.slice(1);
      assert(await page.locator(`#${id}`).count() === 1, `${width}px: ${label} has no unique destination ${href}`);
      if (label === "Skip to content") continue;
      const link = page.locator("a[href^='#']").nth(index);
      if (!(await link.isVisible())) continue;
      await link.click();
      assert(await page.evaluate(() => location.hash) === href, `${width}px: ${label} did not navigate to ${href}`);
      const placement = await page.locator(`#${id}`).evaluate(element => ({ top: element.getBoundingClientRect().top, isScene: element.classList.contains("scene-section") }));
      const headerBottom = await page.locator(".site-header").evaluate(element => element.getBoundingClientRect().bottom);
      if (placement.isScene) assert(placement.top >= headerBottom - 3, `${width}px: header obscures ${label}`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: horizontal overflow after ${label}`);
      checked.push({ label, href });
    }
    const external = await page.locator("a[href^='mailto:'], a[href^='https://']").evaluateAll(elements => elements.map(element => ({ href: element.getAttribute("href"), target: element.getAttribute("target"), rel: element.getAttribute("rel") })));
    for (const link of external) {
      if (link.href.startsWith("mailto:")) assert(link.href === "mailto:tashkeelatelier@gmail.com", `${width}px: wrong inquiry email link`);
      if (link.href.startsWith("https://")) assert(link.target === "_blank" && link.rel.includes("noopener"), `${width}px: external link does not open safely`);
    }
    results.push({ width, anchorsClicked: checked.length, externalLinksChecked: external.length });
  }
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    const skip = page.getByRole("link", { name: "Skip to content" });
    assert(await page.locator("a").first().evaluate(element => element === document.querySelector(".skip-link")), `${width}px: skip link is not the first page link`);
    await skip.focus();
    assert(await skip.evaluate(element => element === document.activeElement), `${width}px: skip link is not keyboard focusable`);
    await page.keyboard.press("Enter");
    assert(await page.evaluate(() => location.hash) === "#main-content", `${width}px: skip link did not navigate to content`);

    await page.goto("http://localhost:3002/this-page-does-not-exist", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Return to the atelier" }).click();
    await page.waitForURL("http://localhost:3002/");
    assert(new URL(page.url()).pathname === "/", `${width}px: 404 return link failed`);

    await page.goto("http://localhost:3002/this-page-does-not-exist", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Tashkeel Atelier" }).click();
    await page.waitForURL("http://localhost:3002/");
    assert(new URL(page.url()).pathname === "/", `${width}px: 404 wordmark link failed`);
  }
  assert(!errors.length, `Browser errors: ${errors.join("; ")}`);
  return { passed: true, results, skipLink: true, notFoundLinks: true, browserErrors: errors };
}
