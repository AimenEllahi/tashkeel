/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI consumes a function expression. */
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 100, downloadThroughput: 200000, uploadThroughput: 75000, connectionType: "cellular4g" });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__tashkeelPerf = { lcp: 0, lcpElement: "", cls: 0, blockingTime: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.__tashkeelPerf.lcp = entry.startTime; window.__tashkeelPerf.lcpElement = entry.element?.tagName || ""; } }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) { if (!entry.hadRecentInput) window.__tashkeelPerf.cls += entry.value; } }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__tashkeelPerf.blockingTime += Math.max(0, entry.duration - 50); }).observe({ type: "longtask", buffered: true });
  });
  try {
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
    await page.locator(".bride-character img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.waitForTimeout(1500);
    const results = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource");
      const byType = type => resources.filter(resource => resource.initiatorType === type).reduce((sum, resource) => sum + resource.encodedBodySize, 0);
      const navigation = performance.getEntriesByType("navigation")[0];
      return { ...window.__tashkeelPerf, fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime, htmlBytes: navigation.encodedBodySize, scriptBytes: byType("script"), imageBytes: byType("img") + resources.filter(resource => resource.initiatorType === "link" && resource.name.includes("/_next/image")).reduce((sum, resource) => sum + resource.encodedBodySize, 0), totalResourceBytes: resources.reduce((sum, resource) => sum + resource.encodedBodySize, 0), resourceCount: resources.length, externalResources: resources.filter(resource => !resource.name.startsWith(location.origin)).map(resource => resource.name), overflow: document.documentElement.scrollWidth - innerWidth };
    });
    await page.screenshot({ path: "output/playwright/production-mobile-performance.png" });
    return { test: "Local production preview; 390×844 at DPR 2; 4× CPU throttle; 1.6 Mbps down / 100 ms latency; browser cache disabled", ...results };
  } finally {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await cdp.send("Emulation.clearDeviceMetricsOverride");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await cdp.detach();
  }
}
