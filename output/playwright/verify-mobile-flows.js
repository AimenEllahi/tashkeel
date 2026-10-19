/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const results = [];
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: horizontal page overflow`);

    const heroObjects = page.locator(".inspiration-object:visible");
    assert(await heroObjects.count() >= 2, `${width}px: no usable hero objects`);
    await heroObjects.first().click();
    assert(await page.locator(".inspiration-object[aria-pressed=true]").count() === 1, `${width}px: hero reaction failed`);
    for (const piece of await page.locator(".board-piece").all()) {
      await piece.click();
      assert(await piece.getAttribute("aria-pressed") === "true", `${width}px: moodboard piece did not select`);
    }
    for (const card of await page.locator(".style-option").all()) {
      await card.click();
      assert(await card.getAttribute("data-selected") === "true", `${width}px: style card did not select`);
    }

    for (const label of ["Palette", "Florals", "Time of day"]) {
      const box = await page.getByRole("combobox", { name: label, exact: true }).boundingBox();
      assert(box && box.height >= 44, `${width}px: ${label} touch target is too small (${box?.height}px)`);
    }
    for (const label of ["Event type", "What help do you need?"]) {
      const box = await page.getByLabel(label, { exact: false }).boundingBox();
      assert(box && box.height >= 44, `${width}px: ${label} form select is too small (${box?.height}px)`);
    }
    await page.getByRole("combobox", { name: "Palette", exact: true }).selectOption("olive-gold");
    await page.getByRole("combobox", { name: "Florals", exact: true }).selectOption("sculptural");
    await page.getByRole("combobox", { name: "Time of day", exact: true }).selectOption("night");
    const artwork = page.locator(".studio-scene-image");
    await page.locator(".studio-art-frame[data-scene='/assets/images/garden/night-sculptural-olive-gold.webp']").waitFor();
    assert((await artwork.getAttribute("src")) === "/assets/images/garden/night-sculptural-olive-gold.webp", `${width}px: garden controls did not compose`);
    await artwork.evaluate(element => element.decode());
    for (const name of ["Invitations", "Floral details", "Wedding favors", "Tablescapes", "Stationery", "Guest experience"]) {
      await page.getByRole("button", { name: `Open ${name}`, exact: true }).click();
      assert(await page.locator(".cabinet-detail h3").innerText() === name, `${width}px: cabinet ${name} failed`);
    }
    for (const name of ["Stage & entertainment", "Dining & guests", "Decor & production", "The planning desk"]) {
      await page.getByRole("button", { name: `Explore ${name}`, exact: true }).click();
      assert(await page.locator(".service-story h3").innerText() === name, `${width}px: service ${name} failed`);
    }

    await page.getByRole("button", { name: "Open the inquiry note" }).click();
    assert(await page.locator("input[name=name]").evaluate(element => element === document.activeElement), `${width}px: inquiry focus failed`);
    await page.getByLabel("Your name", { exact: false }).fill("Mobile check");
    await page.getByLabel("Email", { exact: true }).fill("mobile@example.com");
    await page.getByLabel("Event type", { exact: false }).selectOption("Wedding");
    await page.getByLabel("Event location", { exact: false }).fill("Lahore");
    await page.getByLabel("What help do you need?", { exact: false }).selectOption("Design and styling");
    await page.getByRole("button", { name: "Prepare my inquiry" }).click();
    const draft = page.getByRole("link", { name: "Open email draft" });
    assert(await draft.isVisible(), `${width}px: inquiry draft not prepared`);
    const body = new URLSearchParams((await draft.getAttribute("href")).split("?")[1]).get("body");
    assert(body.includes("Olive & antique gold") && body.includes("Sculptural") && body.includes("Night"), `${width}px: mobile choices missing from inquiry`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: overflow after interactions`);
    results.push({ width, heroObjects: await heroObjects.count(), moodboard: 7, styles: 3, garden: true, cabinet: 6, services: 4, inquiry: true });
  }
  assert(!errors.length, `Browser errors: ${errors.join("; ")}`);
  return { passed: true, results, browserErrors: errors };
}
