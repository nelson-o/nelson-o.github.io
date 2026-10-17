import { expect, test } from "@playwright/test";
import { getSiteFooterCopy } from "../lib/i18n-site-footer";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  for (const width of [320, 390, 1280]) {
    test(`${locale} footer at ${width}px works without JavaScript`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${baseURL}/${locale}/`);
      const footer = page.locator("footer#contact");
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("navigation", { name: getSiteFooterCopy(locale).navigation })).toBeVisible();
      await expect(footer.getByRole("link", { name: "RSS", exact: true })).toHaveAttribute("href", `/${locale}/feed.xml`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await footer.getByRole("link", { name: getSiteFooterCopy(locale).top, exact: true }).click();
      await expect(page).toHaveURL(/#top$/);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await context.close();
    });
  }
}
