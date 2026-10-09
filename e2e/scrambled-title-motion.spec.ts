import { test, expect } from "@playwright/test";
import { getDictionary } from "../lib/i18n";

for (const locale of ["en", "zh-tw"] as const) {
  for (const stopAfter of [250, 8000]) {
    test(`${locale}: live reduced motion stops ${stopAfter === 250 ? "active scrambling" : "queued scrambling"}`, async ({ page }) => {
      await page.addInitScript(() => { Math.random = () => 0.5; });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.clock.install();
      await page.goto(`/${locale}/systems/`);
      const header = page.locator("header a[aria-label] span").first();
      const footer = page.locator("footer span").first();
      const dictionary = getDictionary(locale);
      await expect(header).toHaveText(dictionary.site.displayTitle);
      await expect(footer).toHaveText(dictionary.footerCandidates[0]);
      // Hydration must finish before the preference is changed.
      await page.getByRole("button", { name: dictionary.settingsPanel.buttonLabel, exact: true }).click();
      await page.keyboard.press("Escape");
      await page.clock.runFor(30000);
      await expect(header).toHaveText(dictionary.site.displayTitle);
      await expect(footer).toHaveText(dictionary.footerCandidates[0]);

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.clock.runFor(stopAfter);
      await expect(header).not.toHaveText(dictionary.site.displayTitle);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.clock.runFor(100);
      await expect(header).toHaveText(dictionary.site.displayTitle);
      await expect(footer).toHaveText(dictionary.footerCandidates[0]);
      // Exceeds the maximum random delay: cancelled callbacks must not restart.
      await page.clock.runFor(30000);
      await expect(header).toHaveText(dictionary.site.displayTitle);
      await expect(footer).toHaveText(dictionary.footerCandidates[0]);

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.clock.runFor(250);
      await expect(header).not.toHaveText(dictionary.site.displayTitle);
    });
  }
}

for (const stopAfter of [250, 8000]) {
  test(`already running title honors reduced motion after ${stopAfter} ms`, async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => 0.5; });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.clock.install();
    await page.goto("/en/systems/");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.keyboard.press("Escape");
    await page.clock.runFor(stopAfter);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.runFor(100);
    const header = page.locator("header a[aria-label] span").first();
    const footer = page.locator("footer span").first();
    await expect(header).toHaveText(getDictionary("en").site.displayTitle);
    await expect(footer).toHaveText(getDictionary("en").footerCandidates[0]);
    await page.clock.runFor(30000);
    await expect(header).toHaveText(getDictionary("en").site.displayTitle);
    await expect(footer).toHaveText(getDictionary("en").footerCandidates[0]);
  });
}
