import { test, expect } from "@playwright/test";
import { getSeries } from "../lib/mdx/content-taxonomy";
import { locales } from "../lib/i18n";
import { getArticleHeaderCopy } from "../lib/i18n-article-header";
import { getSeriesPathCopy } from "../lib/i18n-series-path";

for (const locale of locales) {
  test(`${locale} series presents numbered published entries in article order`, async ({ page }) => {
    for (const series of getSeries(locale)) {
      await page.goto(`/${locale}/series/${series.id}/`);
      const path = page.locator("[data-series-path]");
      const items = path.locator("ol > li");
      await expect(items).toHaveCount(series.count);
      const first = series.entries[0];
      await expect(path.getByRole("link", { name: getSeriesPathCopy(locale).start })).toHaveAttribute("href", `/${locale}/${first.section}/${first.slug}/`);
      for (const [index, entry] of series.entries.entries()) {
        await expect(items.nth(index)).toContainText(getArticleHeaderCopy(locale).part(index + 1, series.count));
        await expect(items.nth(index).getByRole("link", { name: entry.title, exact: true })).toHaveAttribute("href", `/${locale}/${entry.section}/${entry.slug}/`);
      }
      await expect(page.locator('[id^="archive-year-"]')).toHaveCount(0);
    }
  });
}

for (const [locale, width] of [["en", 390], ["en", 1280], ["zh-tw", 320]] as const) {
  test(`${locale} series start and next step work by keyboard without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    const series = getSeries(locale).find(({ id }) => id === "agentic-delivery")!;
    await page.goto(`/${locale}/series/agentic-delivery/`);
    const start = page.getByRole("link", { name: getSeriesPathCopy(locale).start });
    await start.focus();
    await expect(start).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-series-path] [data-entry-row]").first()).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await start.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/${series.entries[0].section}/${series.entries[0].slug}/$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(series.entries[0].title);
    await page.goBack();
    await expect(page.locator("[data-series-path]")).toBeVisible();
    await expect(start).toBeVisible();
    await context.close();
  });
}
