import { test, expect } from "@playwright/test";
import { getDictionary, locales } from "../lib/i18n";

for (const locale of locales) for (const initial of ["reduce", "no-preference"] as const) {
  test(`${locale}: wordmarks remain static from ${initial} through live motion changes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: initial });
    await page.clock.install();
    await page.goto(`/${locale}/systems/`);
    const dictionary = getDictionary(locale);
    const header = page.locator("header > a").first();
    const footer = page.locator("footer").getByRole("link", { name: dictionary.site.title, exact: true });
    await expect(header).toHaveText("NELSON");
    await expect(header).toHaveAccessibleName(dictionary.site.displayTitle);
    await expect(header).toHaveAttribute("href", `/${locale}/`);
    // Wait for hydration, then cross both former animation timers under each preference.
    await page.getByRole("button", { name: dictionary.settingsPanel.buttonLabel, exact: true }).click();
    await page.keyboard.press("Escape");
    for (const reducedMotion of ["reduce", "no-preference", "reduce"] as const) {
      await page.emulateMedia({ reducedMotion });
      for (const duration of [250, 8000, 30000]) {
        await page.clock.runFor(duration);
        await expect(header).toHaveText("NELSON");
        await expect(footer).toHaveText("NELSON");
      }
    }
  });
}
