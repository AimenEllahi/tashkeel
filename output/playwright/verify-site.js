/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  const origin = "http://localhost:3002";
  const browser = page.context().browser()?.browserType().name() || "browser";
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(origin, { waitUntil: "networkidle" });
  assert(await page.locator("h1").count() === 1, "The page needs exactly one primary heading");
  const brokenAnchors = await page.locator("a[href^='#']").evaluateAll(links => links.map(link => link.getAttribute("href")).filter(href => href && href.length > 1 && !document.getElementById(href.slice(1))));
  assert(!brokenAnchors.length, `Broken anchor destinations: ${brokenAnchors}`);
  assert(await page.locator(".bride-character").getAttribute("data-state") === "overwhelmed", "Hero should start with the overwhelmed expression");
  for (const [label, state] of [["Blush table styling study", "curious"], ["Blush or burgundy?", "thinking"], ["Bridal ring box", "delighted"], ["Ammi prefers red.", "overwhelmed"]]) {
    await page.getByRole("button", { name: `${label.replace(/[.!?]+$/, "")}. See the bride's reaction.`, exact: true }).click();
    assert(await page.locator(".bride-character").getAttribute("data-state") === state, `Bride did not react to ${label}`);
    assert(await page.locator(".inspiration-object[aria-pressed=true]").count() === 1, `Selected object is not visually identified for ${label}`);
    assert((await page.locator(".hero-reaction").innerText()).includes(label), `The hero did not confirm ${label}`);
    await page.locator(".bride-character img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  }

  await page.locator(".plan-board").scrollIntoViewIfNeeded();
  assert(await page.locator(".board-piece").count() === 7, "Moodboard should contain the seven composed details");
  await page.getByRole("button", { name: "Explore Blush table styling concept" }).click();
  assert((await page.locator(".board-caption").innerText()).includes("tablescape direction"), "Moodboard detail did not connect inspiration to a decision");
  await page.getByRole("button", { name: "Explore Blush table styling concept" }).click();
  await page.getByRole("button", { name: "Explore Invitation arch study" }).click();
  assert((await page.locator(".board-caption").innerText()).includes("invitation motif"), "New invitation detail does not respond");

  const presets = [
    ["Old-School Pakistani Charm", "marigold-burgundy", "traditional", "evening"],
    ["Contemporary Romance", "ivory-blush", "romantic", "daylight"],
    ["A Little of Both", "olive-gold", "sculptural", "night"],
  ];
  for (const [title, palette, floral, ambience] of presets) {
    await page.getByRole("button", { name: new RegExp(title) }).click();
    const art = page.locator(".studio-art");
    assert(await art.getAttribute("data-palette") === palette, `${title}: palette preset missing`);
    assert(await art.getAttribute("data-floral") === floral, `${title}: floral preset missing`);
    assert(await art.getAttribute("data-ambience") === ambience, `${title}: ambience preset missing`);
    assert(await page.locator(".bride-character").getAttribute("data-state") === "relaxed", "Bride did not settle after a style was chosen");
    assert(await page.locator("#style-preview h3").innerText() === title, `${title}: style preview did not open`);
    assert(await page.locator("#style-preview .studio-scene-image").count() === 0, `${title}: garden artwork repeats in style selection`);
    assert(await page.locator(`.style-palette[data-palette='${palette}']`).count() === 1, `${title}: palette summary does not match`);
    assert((await page.locator(".style-option[data-selected=true] .style-mini-recipe").innerText()).includes("florals"), `${title}: selected card does not reveal its recipe`);
  }
  await page.getByRole("button", { name: "Bring back daylight" }).click();
  assert(await page.locator(".studio-art").getAttribute("data-ambience") === "daylight", "Studio's guided lighting control did not reveal daylight");
  await page.getByRole("button", { name: "See it after dark" }).click();
  assert(await page.locator(".studio-art").getAttribute("data-ambience") === "night", "Studio's guided lighting control did not reveal night");
  const palettes = [["Ivory & blush", "ivory-blush"], ["Marigold & burgundy", "marigold-burgundy"], ["Olive & antique gold", "olive-gold"]];
  const florals = [["Traditional", "traditional"], ["Romantic", "romantic"], ["Sculptural", "sculptural"]];
  const ambiences = [["Daylight", "daylight"], ["Evening", "evening"], ["Night", "night"]];
  for (const [attribute, options] of [["palette", palettes], ["floral", florals], ["ambience", ambiences]]) {
    for (const [label, value] of options) {
      await page.getByRole("button", { name: label, exact: true }).click();
      assert(await page.locator(".studio-art").getAttribute(`data-${attribute}`) === value, `${attribute} did not update`);
      if (attribute === "palette") assert(await page.locator(`.studio-art-frame[data-palette='${value}']`).count() === 1, "Palette scene did not update");
      const selectedPalette = await page.locator(".studio-art").getAttribute("data-palette");
      const paletteSuffix = selectedPalette === "ivory-blush" ? "" : `-${selectedPalette}`;
      const scenePath = `/assets/images/garden/${await page.locator(".studio-art").getAttribute("data-ambience")}-${await page.locator(".studio-art").getAttribute("data-floral")}${paletteSuffix}.webp`;
      assert((await page.locator(".studio-art .studio-scene-image").getAttribute("src")).includes(encodeURIComponent(scenePath)), `Garden image did not update to ${scenePath}`);
    }
  }
  for (const title of ["Invitations", "Floral details", "Wedding favors", "Tablescapes", "Stationery", "Guest experience"]) {
    await page.getByRole("button", { name: `Open ${title}`, exact: true }).click();
    assert(await page.locator(".cabinet-detail h3").innerText() === title, `Cabinet ${title} did not open`);
  }
  for (const title of ["Stage & entertainment", "Dining & guests", "Decor & production", "The planning desk"]) {
    await page.getByRole("button", { name: `Explore ${title}`, exact: true }).click();
    assert(await page.locator(".service-story h3").innerText() === title, `Service ${title} did not open`);
  }

  await page.getByRole("button", { name: "Open the inquiry note" }).click();
  assert(await page.locator("input[name=name]").evaluate(element => element === document.activeElement), "Envelope does not focus the inquiry form");
  await page.getByLabel("Your name", { exact: false }).fill("Browser check");
  await page.getByLabel("Event type", { exact: false }).selectOption("Wedding");
  await page.getByLabel("Event location", { exact: false }).fill("Lahore");
  await page.getByLabel("What help do you need?", { exact: false }).selectOption("Design and styling");
  await page.getByRole("button", { name: "Prepare my inquiry" }).click();
  assert(await page.locator("#inquiry-error").isVisible(), "Missing-contact feedback did not appear");
  assert(await page.locator("input[name=email]").evaluate(element => element === document.activeElement), "Focus did not move to missing contact");
  await page.getByLabel("WhatsApp", { exact: true }).fill("+92 300 0000000");
  await page.getByRole("button", { name: "Prepare my inquiry" }).click();
  const draftLink = page.getByRole("link", { name: "Open email draft" });
  assert(await draftLink.isVisible(), "WhatsApp-only inquiry draft was not prepared");
  const href = await draftLink.getAttribute("href");
  const body = new URLSearchParams(href.split("?")[1]).get("body");
  assert(href.startsWith("mailto:tashkeelatelier@gmail.com?"), "Inquiry recipient is incorrect");
  assert(body.includes("WhatsApp: +92 300 0000000"), "Contact details are missing from inquiry");
  assert(body.includes("A Little of Both") && body.includes("Olive & antique gold") && body.includes("Night"), "Design choices were not carried into inquiry");
  assert(!body.includes("undefined"), "Undefined data was included in inquiry");
  await page.getByLabel("What are you imagining?").fill("An intimate courtyard celebration.");
  assert(await draftLink.count() === 0, "Editing the form should invalidate the old draft");
  await page.getByLabel("Email", { exact: true }).fill("browser-check@example.com");
  await page.locator(".optional-details summary").click();
  await page.getByLabel("Expected date", { exact: true }).fill("2027-02-14");
  await page.getByLabel("Approximate guests", { exact: true }).fill("250");
  await page.getByRole("button", { name: "Prepare my inquiry" }).click();
  assert(await draftLink.isVisible(), "Email inquiry draft was not prepared");
  assert(decodeURIComponent(await draftLink.getAttribute("href")).includes("Approximate guests: 250"), "Optional inquiry details were not included");
  await page.getByRole("button", { name: "Ivory & blush", exact: true }).click();
  assert(await draftLink.count() === 0, "Changing design choices should invalidate the old draft");

  const sectionIds = ["atelier-stage", "your-style", "wedding-studio", "little-things", "what-we-do", "the-atelier", "inquire"];
  const widths = [320, 390, 768, 1024, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal page overflow at ${width}px`);
    const clearance = await page.evaluate(() => ({ cue: document.querySelector(".scroll-cue").getBoundingClientRect().top, bride: document.querySelector(".character-stage").getBoundingClientRect().bottom }));
    assert(clearance.cue > clearance.bride, `Scroll cue overlaps the bride at ${width}px`);
    if (width === 390 || width === 1440) {
      if (width === 390) {
        await page.getByRole("combobox", { name: "Palette", exact: true }).selectOption("marigold-burgundy");
        await page.getByRole("combobox", { name: "Florals", exact: true }).selectOption("traditional");
        await page.getByRole("combobox", { name: "Time of day", exact: true }).selectOption("daylight");
        assert(await page.locator(".studio-art").getAttribute("data-palette") === "marigold-burgundy", "Mobile palette selector failed");
        assert(await page.locator(".studio-art").getAttribute("data-floral") === "traditional", "Mobile floral selector failed");
        assert(await page.locator(".studio-art").getAttribute("data-ambience") === "daylight", "Mobile ambience selector failed");
      }
      for (const id of sectionIds) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        await section.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))));
        await section.screenshot({ path: `output/playwright/review-${id}-${width}-${browser}.png`, style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
      }
    }
  }
  await page.getByRole("link", { name: "Inquire", exact: true }).click();
  const anchorClearance = await page.evaluate(() => ({ header: document.querySelector(".site-header").getBoundingClientRect().bottom, target: document.querySelector("#inquire").getBoundingClientRect().top }));
  assert(anchorClearance.target >= anchorClearance.header, "Sticky navigation covers the inquiry anchor");
  const brokenImages = await page.locator("img").evaluateAll(images => images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.src));
  assert(!brokenImages.length, `Images failed to load: ${brokenImages}`);
  assert(!errors.length, `Browser errors: ${errors.join("; ")}`);
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.keyboard.press(browser === "webkit" ? "Alt+Tab" : "Tab");
  assert(await page.getByRole("link", { name: "Skip to content" }).evaluate(element => element === document.activeElement), "Skip link is not first in keyboard order");
  await page.keyboard.press("Enter");
  assert(await page.locator("main").evaluate(element => element === document.activeElement), "Skip link does not focus main content");
  return { passed: true, browser, widths, checked: ["navigation anchors", "hero reactions", "composed interactive moodboard", "compact style summaries and presets", "guided studio lighting", "all studio choices and garden images", "mobile dropdowns", "all cabinet drawers", "all service hotspots", "envelope-to-form focus", "contact validation", "email draft and choice handoff", "stale draft invalidation", "scroll cue clearance", "sticky navigation", "image loading", "skip link"], browserErrors: errors };
}
