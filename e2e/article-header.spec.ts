import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { getArticleHeaderCopy } from "../lib/i18n-article-header";
import { getLandingTabsCopy } from "../lib/i18n-landing-tabs";
import { getEntryBySlug } from "../lib/mdx/content";
import { estimateReadingMinutes, getArticleSeries } from "../lib/article-header";

for (const locale of locales) for (const width of [320, 390, 1280]) {
  test(`${locale} ${width}: article header exposes topics and series navigation`, async ({ page }) => {
    const entry = getEntryBySlug(locale, "ideas", "agent-loops")!;
    const copy = getArticleHeaderCopy(locale);
    const series = getArticleSeries(entry)!;
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/ideas/agent-loops/?theme=${theme}`);
      const header = page.locator("[data-article-header]");
      await expect(header.locator("time")).toHaveAttribute("datetime", entry.date);
      await expect(header).toContainText(copy.reading(estimateReadingMinutes(entry.content)));
      await expect(header.locator("[data-article-series]")).toContainText(copy.part(series.part, series.total));
      const cover = header.locator("img:visible");
      await expect(cover).toHaveAttribute("loading", "eager");
      expect((await cover.boundingBox())!.y).toBeGreaterThan((await header.locator("h1").boundingBox())!.y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const topic = header.getByRole("navigation", { name: copy.tags }).getByRole("link").first();
      const topicHref = await topic.getAttribute("href");
      await topic.focus();
      expect(await topic.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${topicHref!.replace(/\/$/, "")}/?$`));
      await expect(page.locator("[data-archive-content]")).toBeVisible();
      await page.goBack();
      await header.locator("[data-article-series] a").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/series/${series.id}/?$`));
      await page.goBack();
      await header.getByRole("link", { name: getLandingTabsCopy(locale).ideas, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/ideas/?$`));
    }
  });
}
