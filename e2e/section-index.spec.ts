import { expect, test } from "@playwright/test";
import { locales, sections } from "../lib/i18n";
import { getLandingTabsCopy } from "../lib/i18n-landing-tabs";

for (const locale of locales) for (const width of [390, 1280]) {
  test(`${locale} ${width}: section rows retain grouping and navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const section of sections) for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/${section}/?theme=${theme}`);
      const main = page.locator("main");
      await expect(main.getByRole("heading", { level: 1 })).toHaveText(getLandingTabsCopy(locale)[section]);
      await expect(page.locator("aside:not([data-privacy-controls])")).toHaveCount(0);
      const rows = main.locator("[data-entry-row]");
      expect(await rows.count()).toBeGreaterThan(0);
      await expect(main.locator('[class*="entry-card"], [class*="topic-visual"]')).toHaveCount(0);
      const years = await main.getByRole("heading", { level: 2 }).allTextContents();
      expect(years).toEqual([...new Set(years)].sort().reverse());
      for (const year of years) {
        expect(year).toMatch(/^\d{4}$/);
        const group = main.getByRole("region", { name: year, exact: true });
        const dates = await group.locator("time").allTextContents();
        expect(dates.every((date) => date.startsWith(year))).toBe(true);
      }
      await expect(rows.locator('[class*="tags"], [class*="draftBadge"]')).toHaveCount(0);
      const first = rows.first();
      await expect(first.locator("img").first()).toHaveAttribute("loading", "eager");
      await first.focus();
      await expect(first).toBeFocused();
      expect(await first.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
      const boxes = await rows.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
      for (let i = 1; i < boxes.length; i++) expect(boxes[i].y).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const href = await first.getAttribute("href");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${href?.replace(/\/$/, "")}/?$`));
      await expect(page.locator("article")).toBeVisible();
    }
  });
}
