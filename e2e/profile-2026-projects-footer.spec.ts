import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n-types";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { THEME_STORAGE_KEY } from "./fixtures";

for (const locale of locales) {
  for (const theme of ["light", "dark"]) {
    test(`${locale} ${theme} project and footer content remains accessible`, async ({ page }) => {
      await page.addInitScript(({ key, theme }) => localStorage.setItem(key, theme), { key: THEME_STORAGE_KEY, theme });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`/${locale}/profile/2026/`);
      const cards = page.locator("#projects article");
      await expect(cards).toHaveCount(3);
      const actions = await cards.locator("summary").all();
      const positions = await Promise.all(actions.map(async (action) => (await action.boundingBox())!.y));
      expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(2);
      for (const action of actions) {
        await action.focus();
        await page.keyboard.press("Enter");
        await expect(action.locator("..").locator("ul")).toBeVisible();
        await page.keyboard.press("Enter");
        await expect(action.locator("..").locator("ul")).not.toBeVisible();
      }
      const signature = page.locator("#contact img");
      await signature.scrollIntoViewIfNeeded();
      await expect(signature).toHaveAttribute("alt", profile2026Copy[locale].manifesto.join(" "));
      await expect.poll(() => signature.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      for (const name of ["GitHub", "LinkedIn"]) {
        const link = page.locator("#contact").getByRole("link", { name, exact: true });
        await expect(link).toBeVisible();
        const box = (await link.boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      for (const width of [1440, 1050, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    });
  }
}
