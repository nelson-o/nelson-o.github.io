import { expect, test } from "@playwright/test";
import { getArchive } from "../lib/archives";

for (const locale of ["en", "zh-tw"]) for (const width of [390, 1280]) {
  test(`${locale} ${width}: archives group rows and retain their sidebar`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["posts", "topics/agents", "series/agentic-delivery"]) for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/${path}/?theme=${theme}`);
      const content = page.locator("[data-archive-content]");
      const sidebar = page.locator("main aside");
      await expect(sidebar).toHaveCount(1);
      const contentBox = (await content.boundingBox())!;
      const sidebarBox = (await sidebar.boundingBox())!;
      if (width >= 1024) {
        expect(sidebarBox.x).toBeGreaterThanOrEqual(contentBox.x + contentBox.width + 47);
        expect(sidebarBox.width).toBe(300);
      } else expect(sidebarBox.y).toBeGreaterThanOrEqual(contentBox.y + contentBox.height);
      const [kind, id] = path.split("/");
      const entries = getArchive(locale as "en" | "zh-tw", kind as "posts" | "topics" | "series", id)!.entries;
      const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))];
      await expect(content.getByRole("heading", { level: 2 })).toHaveText(years);
      for (const year of years) {
        const dates = await content.getByRole("region", { name: year, exact: true }).locator("time").allTextContents();
        expect(dates).toEqual(entries.filter((entry) => entry.date.startsWith(year)).map((entry) => entry.date));
      }
      const first = content.locator("[data-entry-row]").first();
      await first.focus();
      expect(await first.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.keyboard.press("Enter");
      await expect(page.locator("article")).toBeVisible();
    }
  });
}
