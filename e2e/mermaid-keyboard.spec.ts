import { expect, test } from "@playwright/test";

for (const javaScriptEnabled of [true, false]) {
  test(`diagram can be scrolled with the keyboard (${javaScriptEnabled ? "rendered" : "source"})`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      javaScriptEnabled,
    });
    const page = await context.newPage();
    await page.goto("/en/ideas/250610-agentic-delivery-loop/");
    const figure = page.locator("[data-mermaid-chart]");
    await expect(figure.locator(javaScriptEnabled ? "svg" : "pre")).toBeVisible();
    const viewport = figure.locator(":scope > div");
    await expect(figure.locator("[tabindex='0']")).toHaveCount(1);
    expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

    // Reach the scroll container through sequential keyboard navigation.
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await page.keyboard.press("Tab");
      if (await viewport.evaluate((element) => element === document.activeElement)) break;
    }
    await expect(viewport).toBeFocused();
    await expect(viewport).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.keyboard.press("Tab");
    await expect(viewport).not.toBeFocused();
    await context.close();
  });
}

for (const keepFocus of [true, false]) {
  test(`diagram rendering ${keepFocus ? "keeps focus" : "does not steal focus back"}`, async ({ page }) => {
    let releaseScripts!: () => void;
    const scripts = new Promise<void>((resolve) => { releaseScripts = resolve; });
    await page.route("**/*.js", async (route) => {
      await scripts;
      await route.continue();
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/ideas/250610-agentic-delivery-loop/", { waitUntil: "domcontentloaded" });
    const figure = page.locator("[data-mermaid-chart]");
    const viewport = figure.locator(":scope > div");
    await expect(figure.locator("pre")).toBeVisible();
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await page.keyboard.press("Tab");
      if (await viewport.evaluate((element) => element === document.activeElement)) break;
    }
    await expect(viewport).toBeFocused();
    if (!keepFocus) await page.keyboard.press("Tab");
    const focused = await page.evaluateHandle(() => document.activeElement);
    releaseScripts();
    await expect(figure.locator("svg")).toBeVisible({ timeout: 15_000 });
    expect(await focused.evaluate((element) => element === document.activeElement)).toBe(true);
    if (!keepFocus) return;
    await expect(viewport).toBeFocused();
    await viewport.evaluate((element) => { element.scrollLeft = 0; });
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.keyboard.press("Tab");
    await expect(viewport).not.toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(viewport).toBeFocused();
  });
}
