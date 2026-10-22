import { expect, test } from "@playwright/test";
import { locales, sections } from "../lib/i18n";
import { getPublishedEntriesForSection, type ContentEntry } from "../lib/mdx/content";

const href = (entry: ContentEntry) => `/${entry.locale}/${entry.section}/${entry.slug}/`;
const order = (a: ContentEntry, b: ContentEntry) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug);
for (const locale of locales) for (const width of [320, 390, 1280]) for (const theme of ["light", "dark"]) {
  test(`${locale} ${width} ${theme}: article neighbors and related posts remain usable`, async ({ page }) => {
    const entries = sections.flatMap((section) => getPublishedEntriesForSection(locale, section));
    const series = entries.filter((entry) => entry.series === "agentic-delivery").sort(order);
    const cases = [series[0], series[1], series.at(-1)!, entries.find((entry) => !entry.series && entry.tags?.length)!];
    await page.setViewportSize({ width, height: 900 });
    for (const entry of cases) {
      await page.goto(`${href(entry)}?theme=${theme}`);
      const sequence = entries.filter((item) => entry.series ? item.series === entry.series : item.section === entry.section).sort(order);
      const index = sequence.findIndex((item) => item.section === entry.section && item.slug === entry.slug);
      const navigation = page.locator("[data-article-navigation]");
      for (const [rel, neighbor] of [["prev", sequence[index - 1]], ["next", sequence[index + 1]]] as const) {
        const link = navigation.locator(`a[rel="${rel}"]`);
        await expect(link).toHaveCount(neighbor ? 1 : 0);
        if (neighbor) await expect(link).toHaveAttribute("href", href(neighbor));
      }
      const related = navigation.locator("[data-entry-row]");
      const relatedHrefs = await related.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      expect(relatedHrefs.length).toBeLessThanOrEqual(3);
      expect(relatedHrefs).not.toContain(href(entry));
      for (const url of relatedHrefs) {
        const candidate = entries.find((item) => href(item) === url);
        expect(candidate).toBeTruthy();
        expect(candidate!.tags!.some((tag) => entry.tags?.includes(tag))).toBe(true);
      }
      await navigation.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const firstLink = navigation.locator("a").first();
      const target = await firstLink.getAttribute("href");
      await firstLink.focus();
      await expect(firstLink).toHaveCSS("outline-style", "solid");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator("article h1")).toHaveText(entries.find((item) => href(item) === target)!.title);
    }
  });
}

test("article continuation links work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/en/ideas/250610-agentic-delivery-loop/");
  const next = page.locator('[data-article-pager] a[rel="next"]');
  const target = await next.getAttribute("href");
  await next.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.locator("article h1")).toBeVisible();
  await context.close();
});
