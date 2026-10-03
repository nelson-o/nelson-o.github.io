import { test, expect } from "@playwright/test";
import { getDictionary, locales } from "../lib/i18n";

for (const locale of locales) {
  test(`keyboard users can bypass site navigation in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/systems/`);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: getDictionary(locale).skipToContentLabel, exact: true });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveAttribute("href", "#main-content");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/${locale}/systems/#main-content$`));
    await page.keyboard.press("Tab");
    await expect(page.locator("#main-content a").first()).toBeFocused();
  });
}
