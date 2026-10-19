/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const testPage = await page.context().newPage();
  const gardenRequests = [];
  testPage.on("request", request => {
    if (request.url().includes("garden")) gardenRequests.push(request.url());
  });
  await testPage.route("**/assets/images/garden/night-romantic.webp", async route => {
    await new Promise(resolve => setTimeout(resolve, 1600));
    await route.continue();
  });
  await testPage.route("**/assets/images/garden/evening-sculptural.webp", async route => {
    await new Promise(resolve => setTimeout(resolve, 1600));
    await route.continue();
  });

  await testPage.setViewportSize({ width: 1440, height: 900 });
  await testPage.goto("http://localhost:3002");
  await testPage.locator("#wedding-studio").scrollIntoViewIfNeeded();
  await testPage.waitForFunction(() => {
    const image = document.querySelector(".studio-scene-image");
    return image?.complete && image.naturalWidth > 0;
  });
  const initial = "/assets/images/garden/daylight-romantic.webp";
  assert(await testPage.locator(".studio-art-frame").getAttribute("data-scene") === initial, "Wrong initial garden scene");
  await testPage.getByRole("button", { name: "Night", exact: true }).click();
  assert(await testPage.locator(".studio-art").getAttribute("data-ambience") === "night", "Night control did not respond immediately");
  assert(await testPage.locator(".studio-art-frame").getAttribute("data-scene") === initial, "Current art disappeared before night loaded");
  assert(await testPage.locator(".studio-scene-image").evaluate(image => image.complete && image.naturalWidth > 0), "Garden went blank while loading night");
  assert(await testPage.locator(".studio-image-status").isVisible(), "Loading feedback missing");
  await testPage.locator(".studio-art-frame[data-scene='/assets/images/garden/night-romantic.webp']").waitFor();
  assert(await testPage.locator(".studio-scene-image").evaluate(image => image.complete && image.naturalWidth > 0), "Decoded night image was not ready when displayed");
  await testPage.locator(".studio-image-status").waitFor({ state: "detached" });

  await testPage.getByRole("button", { name: "Evening", exact: true }).click();
  await testPage.locator(".studio-art-frame[data-scene='/assets/images/garden/evening-romantic.webp']").waitFor();
  await testPage.getByRole("button", { name: "Sculptural", exact: true }).click();
  await testPage.getByRole("button", { name: "Romantic", exact: true }).click();
  await testPage.waitForTimeout(1800);
  assert(await testPage.locator(".studio-art-frame").getAttribute("data-scene") === "/assets/images/garden/evening-romantic.webp", "A stale image replaced the final choice");

  await testPage.setViewportSize({ width: 390, height: 844 });
  await testPage.getByRole("combobox", { name: "Time of day", exact: true }).selectOption("daylight");
  await testPage.locator(".studio-art-frame[data-scene='/assets/images/garden/daylight-romantic.webp']").waitFor();
  assert(await testPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile overflow after scene switches");
  assert(gardenRequests.some(url => url.includes("/assets/images/garden/")), "No direct garden artwork requests were made");
  assert(gardenRequests.every(url => !url.includes("/_next/image")), "Garden still uses the on-demand image optimizer");
  await testPage.close();
  return { passed: true, heldPreviousScene: true, latestChoiceWins: true, mobile: true, directArtworkRequests: gardenRequests.length };
}
