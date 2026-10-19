import { expect, test } from "@playwright/test";
import { getDictionary, locales } from "../lib/i18n";
import { getLatestEntries } from "../lib/mdx/content";
import { tags } from "../lib/taxonomy";

for (const locale of locales) for (const width of [1280, 390]) {
  test(`${locale} ${width}: landing rows preserve content, images and navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/?theme=light`);
    const entries = getLatestEntries(locale, 10);
    const rows = page.locator("[data-entry-row]");
    await expect(rows).toHaveCount(entries.length);
    const sharedAccent = await page.locator("html").evaluate((el) => getComputedStyle(el).getPropertyValue("--color-accent").trim());
    expect(await rows.evaluateAll((items) => items.map((el) => getComputedStyle(el).getPropertyValue("--color-accent").trim()))).toEqual(entries.map(() => sharedAccent));
    for (const [index, entry] of entries.entries()) {
      const row = rows.nth(index);
      await expect(row).toHaveAccessibleName(entry.title);
      await expect(row).toHaveAttribute("href", new RegExp(`^/${locale}/${entry.section}/${entry.slug}/?$`));
      await expect(row.locator("a")).toHaveCount(0);
      await expect(row.locator("time")).toHaveAttribute("datetime", entry.date);
      await expect(row.getByRole("heading", { name: entry.title, exact: true })).toBeVisible();
      await expect(row.locator("p")).toHaveText(entry.summary);
      await expect(row.locator("p")).toHaveCSS("white-space", "nowrap");
      await expect(row.locator("p")).toHaveCSS("text-overflow", "ellipsis");
      for (const tag of entry.tags ?? []) await expect(row.getByText(`#${tags[tag][locale]}`, { exact: true })).toBeVisible();
      const image = row.locator("img:visible");
      await expect(image).toHaveAttribute("loading", index === 0 ? "eager" : "lazy");
      await expect(image).toHaveAttribute("fetchpriority", index === 0 ? "high" : "auto");
      await expect(image).toHaveAttribute("width", "1200");
      await expect(image).toHaveAttribute("height", "742");
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const box = await image.boundingBox();
      expect(box?.width).toBe(width >= 640 ? 160 : 112);
      expect(Math.round(box!.height)).toBe(width >= 640 ? 99 : 69);
    }
    await rows.first().focus();
    await expect(rows.first()).toBeFocused();
    await expect(rows.first()).toHaveCSS("outline-style", "solid");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: getDictionary(locale).archives.morePosts, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/posts/$`));
  });
}
