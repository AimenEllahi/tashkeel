/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const results = [];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    const float = page.locator(".inspiration-object[data-object-id='inspiration-one'] [data-object-float]");
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".inspiration-object[data-object-id='inspiration-one'] [data-object-float]")).transform !== "none");
    const samples = [];
    for (let i = 0; i < 4; i++) {
      samples.push(await float.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42));
      await page.waitForTimeout(700);
    }
    const floatRange = Math.max(...samples) - Math.min(...samples);
    assert(floatRange > 3, `${width}px: hero object does not visibly float (${samples})`);

    const board = page.locator(".plan-board");
    const scrollPositions = await board.evaluate(element => {
      const top = element.getBoundingClientRect().top + scrollY;
      return { start: top - innerHeight * 0.95, end: top + element.getBoundingClientRect().height / 2 - innerHeight * 0.55 };
    });
    const photo = board.locator(".board-photo[data-board-motion]");
    await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), scrollPositions.start - 35);
    await page.waitForTimeout(1000);
    const loose = await photo.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    assert(loose < -20, `${width}px: board pieces are not loose before the scroll transition (${loose})`);
    await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), scrollPositions.end + 50);
    await page.waitForTimeout(1200);
    const settled = await photo.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    assert(Math.abs(settled) < 2, `${width}px: board pieces did not settle into place (${settled})`);
    assert(await board.locator("[data-board-motion]").count() === 8, `${width}px: not all seven details and note participate`);
    await page.getByRole("button", { name: "Explore Invitation arch study" }).click();
    assert((await page.locator(".board-caption").innerText()).includes("invitation motif"), `${width}px: settled board details are not interactive`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: horizontal overflow`);
    results.push({ width, floatRange: Math.round(floatRange * 10) / 10, boardStartX: Math.round(loose), boardEndX: Math.round(settled) });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  const reducedTransform = await page.locator(".board-photo[data-board-motion]").evaluate(element => getComputedStyle(element).transform);
  assert(reducedTransform === "none" || Math.abs(new DOMMatrixReadOnly(reducedTransform).m41) < 1, "Reduced motion did not leave the moodboard arranged");
  return { passed: true, results, reducedMotion: true };
}
