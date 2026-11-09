import { expect, test } from "@playwright/test";
import { getArticleTableLabel } from "../lib/i18n-article-table";

const locales = ["en", "zh-tw", "zh-cn", "ja"] as const;
for (const locale of locales) for (const width of [390, 1280]) for (const theme of ["light", "dark"]) {
  test(`${locale} ${width} ${theme}: table keyboard scrolling and complete print columns`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/ideas/agent-loops/?theme=${theme}`);
    const region = page.getByRole("region", { name: getArticleTableLabel(locale) }).first();
    await expect(region.getByRole("table")).toBeVisible();
    // The same deterministic stress content exercises narrow screens and print:
    // a long identifier plus a link that otherwise makes Chromium skip the scroller.
    await region.evaluate((el) => {
      el.querySelector("td")!.textContent = "request_" + "identifier_".repeat(30);
      const link = document.createElement("a");
      link.href = "#top";
      link.textContent = "Table link";
      el.querySelector("td:nth-child(2)")!.replaceChildren(link);
      const before = document.createElement("button");
      before.id = "before-table";
      before.textContent = "Before table";
      el.before(before);
    });
    await page.locator("#before-table").focus();
    await page.keyboard.press("Tab");
    await expect(region).toBeFocused();
    await expect(region).toHaveCSS("outline-style", "solid");
    expect(await region.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await page.keyboard.press("Tab");
    await expect(region.getByRole("link", { name: "Table link" })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await region.focus();
    await page.emulateMedia({ media: "print" });
    await expect(region).toHaveCSS("outline-style", "none");
    await expect(region).toHaveCSS("overflow-x", "visible");
    await expect(region.getByRole("table")).toHaveCSS("table-layout", "fixed");
    expect(await region.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    const bounds = await region.locator("th, td").evaluateAll((cells) => cells.map((el) => ({
      left: el.getBoundingClientRect().left,
      right: el.getBoundingClientRect().right,
      clipped: el.scrollWidth > el.clientWidth + 1,
    })));
    for (const cell of bounds) {
      expect(cell.left).toBeGreaterThanOrEqual(0);
      expect(cell.right).toBeLessThanOrEqual(width + 1);
      expect(cell.clipped).toBe(false);
    }
    await page.emulateMedia({ media: "screen" });
    await expect(region).toHaveCSS("overflow-x", "auto");
    expect(await region.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  });
}

for (const locale of locales) test(`${locale}: table semantics and keyboard access without JavaScript`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto(`/${locale}/ideas/agent-loops/`);
  const regions = page.getByRole("region", { name: getArticleTableLabel(locale) });
  expect(await regions.count()).toBeGreaterThan(1);
  await expect(regions.first().getByRole("columnheader").first()).toBeVisible();
  await regions.first().focus();
  await expect(regions.first()).toBeFocused();
  await expect(regions.first()).toHaveCSS("outline-style", "solid");
  await context.close();
});
