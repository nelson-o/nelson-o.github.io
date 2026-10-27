import { expect, test, type Page } from "@playwright/test";

const diagrams = (page: Page) => page.locator("[data-mermaid-chart] svg");
const ids = (page: Page) => diagrams(page).evaluateAll((nodes) => nodes.map((node) => node.id));

async function chooseTheme(page: Page, preference: string) {
  await page.locator(".theme-toggle").click();
  await page.locator(`label:has(input[value="${preference}"])`).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute("data-theme-preference", preference);
}

for (const locale of ["en", "zh-tw"]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${locale}: unchanged ${colorScheme} colors preserve all five diagram SVGs`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(`/${locale}/ideas/agent-loops/`);
      await expect(diagrams(page)).toHaveCount(5);
      const originals = await diagrams(page).elementHandles();
      const originalIds = await ids(page);
      for (const preference of [colorScheme, "system"]) {
        await chooseTheme(page, preference);
        await expect(page.locator("html")).toHaveClass(`theme-${colorScheme}`);
        // Observe a no-op long enough for the baseline's queued Mermaid work to finish.
        await page.waitForTimeout(1000);
        expect(await ids(page)).toEqual(originalIds);
        for (const svg of originals) expect(await svg.evaluate((node) => node.isConnected)).toBe(true);
      }
      await page.evaluate(() => {
        document.documentElement.classList.add("unrelated-audit-class");
        document.documentElement.style.setProperty("--unrelated-audit-token", "1");
      });
      await page.waitForTimeout(1000);
      expect(await ids(page)).toEqual(originalIds);
      for (const svg of originals) expect(await svg.evaluate((node) => node.isConnected)).toBe(true);
    });
  }

  test(`${locale}: real OS, explicit and inline palette changes still render`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(`/${locale}/ideas/agent-loops/`);
    await expect(diagrams(page)).toHaveCount(5);
    let previous = await ids(page);
    for (const colorScheme of ["dark", "light"] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(page.locator("html")).toHaveClass(`theme-${colorScheme}`);
      await expect.poll(async () => (await ids(page)).every((id, i) => id !== previous[i])).toBe(true);
      previous = await ids(page);
    }
    for (const preference of ["dark", "light"]) {
      await chooseTheme(page, preference);
      await expect.poll(async () => (await ids(page)).every((id, i) => id !== previous[i])).toBe(true);
      previous = await ids(page);
    }
    await page.evaluate(() => document.documentElement.style.setProperty("--section-ideas", "#d83a52"));
    await expect.poll(async () => (await ids(page)).every((id, i) => id !== previous[i])).toBe(true);
    await expect(diagrams(page).first()).toContainText("#d83a52");
    await expect(page.locator("[data-mermaid-chart] pre")).toHaveCount(0);
  });
}
