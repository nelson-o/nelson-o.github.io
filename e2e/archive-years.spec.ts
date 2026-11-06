import { expect, test } from "@playwright/test";
import { getArchive } from "../lib/archives";
import { getArchiveYearsCopy } from "../lib/i18n-archive-years";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  for (const javaScriptEnabled of [true, false]) {
    test.describe(`${locale} JavaScript ${javaScriptEnabled}`, () => {
      test.use({ javaScriptEnabled });
      for (const width of [320, 390, 1280]) test(`${width}: native year navigation and history`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`/${locale}/posts/?theme=dark`);
        const nav = page.getByRole("navigation", { name: getArchiveYearsCopy(locale) });
        const entries = getArchive(locale, "posts")!.entries;
        const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))];
        await expect(nav.getByRole("link")).toHaveText(years);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const oldest = years.at(-1)!;
        const link = nav.getByRole("link", { name: oldest, exact: true });
        await link.focus();
        expect(await link.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
        await page.keyboard.press("Enter");
        const heading = page.locator(`#archive-year-${oldest}`);
        await expect(heading).toBeFocused();
        expect(await heading.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
        const top = (await heading.boundingBox())!.y;
        expect(top).toBeGreaterThanOrEqual(0);
        expect(top + (await heading.boundingBox())!.height).toBeLessThanOrEqual(900);
        await page.keyboard.press("Tab");
        await expect(heading.locator("..").locator("[data-entry-row]").first()).toBeFocused();
        await page.goBack();
        await expect(page).not.toHaveURL(/#archive-year/);
        await page.goForward();
        await expect(page).toHaveURL(new RegExp(`#archive-year-${oldest}$`));
        await page.goto(`/${locale}/topics/`);
        await page.goto(`/${locale}/posts/#archive-year-${oldest}`);
        await expect(heading).toBeFocused();
        expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(0);
        expect((await heading.boundingBox())!.y + (await heading.boundingBox())!.height).toBeLessThanOrEqual(900);
        for (const route of ["topics/agents", "series/agentic-delivery"]) {
          await page.goto(`/${locale}/${route}/`);
          await expect(page.locator("[data-archive-years]")).toHaveCount(0);
        }
      });
    });
  }
}
