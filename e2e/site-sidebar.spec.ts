import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { getSidebarCopy } from "../lib/i18n-sidebar";
import { getTagCounts, getSeries } from "../lib/mdx/content-taxonomy";

for (const locale of locales) for (const width of [1280, 1024, 390, 320]) {
  test(`${locale} ${width}: sidebar is static, localized and responsive`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}/`);
    const copy = getSidebarCopy(locale);
    const sidebar = page.getByRole("complementary", { name: copy.label });
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(sidebar.getByRole("heading", { level: 2 })).toHaveCount(3);
    for (const { id, count, label } of getTagCounts(locale).slice(0, 4)) {
      await expect(sidebar.getByRole("link", { name: `#${label} (${count})`, exact: true })).toHaveAttribute("href", `/${locale}/topics/${id}/`);
    }
    for (const { id } of getSeries(locale)) await expect(sidebar.locator(`a[href="/${locale}/series/${id}/"]`)).toBeVisible();
    const asideBox = (await sidebar.boundingBox())!;
    const first = (await page.locator("[data-entry-row]").first().boundingBox())!;
    const last = (await page.locator("[data-entry-row]").last().boundingBox())!;
    if (width >= 1024) {
      expect(asideBox.width).toBe(300);
      expect(Math.round(asideBox.x - first.x - first.width)).toBe(48);
    } else expect(asideBox.y).toBeGreaterThan(last.y + last.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const more = sidebar.getByRole("link", { name: copy.moreTopics, exact: true });
    await more.focus();
    await expect(more).toBeFocused();
    await expect(more).toHaveCSS("outline-style", "solid");
    await more.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/topics/$`));
    expect(errors).toEqual([]);
    await context.close();
  });
}
