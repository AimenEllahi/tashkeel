/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const results = [];

  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    assert(await page.getByText("Explore a detail").count() === 0, `${width}px: false link cue remains`);
    assert(await page.locator(".board-instruction").innerText() === "Select an object on the board", `${width}px: board instruction missing`);

    const pieces = page.locator(".plan-board .board-piece");
    assert(await pieces.count() === 7, `${width}px: expected seven board objects`);
    for (let index = 0; index < 7; index++) {
      await pieces.nth(index).click();
      await page.waitForFunction(() => {
        const note = document.querySelector(".board-piece-feedback");
        if (!note) return false;
        const rect = note.getBoundingClientRect();
        return rect.top >= 75 && rect.bottom <= innerHeight - 12;
      });
      assert(await pieces.nth(index).getAttribute("aria-pressed") === "true", `${width}px: object ${index} did not select`);
      assert(await page.locator(".board-piece-feedback").count() === 1, `${width}px: object ${index} lacks one visible response`);
      assert(await page.locator(".board-caption").innerText() === await page.locator(".board-piece-feedback").innerText(), `${width}px: live announcement differs from visible response`);
      const contained = await page.locator(".board-piece-feedback").evaluate(element => {
        const note = element.getBoundingClientRect();
        const board = element.closest(".plan-board").getBoundingClientRect();
        return note.left >= board.left && note.right <= board.right && note.top >= board.top && note.bottom <= board.bottom;
      });
      assert(contained, `${width}px: object ${index} response is clipped by the board`);
    }

    if (width !== 320) await page.screenshot({ path: `output/playwright/board-interaction-${width}.png` });
    await pieces.last().click();
    assert(await page.locator(".board-piece-feedback").count() === 0, `${width}px: repeated click did not clear the response`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: horizontal overflow`);
    results.push({ width, objects: 7, responsesVisible: true, toggle: true });
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.locator(".plan-board .board-piece").first().click();
  assert(await page.locator(".board-piece-feedback").count() === 1, "Reduced motion hid the response");
  return { passed: true, results, reducedMotion: true };
}
