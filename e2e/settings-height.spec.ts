import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { profileLocales } from "../lib/profile-locales";
import { settingsButton } from "./fixtures";

const routes = [
  ...locales.map((locale) => ({ path: `/${locale}/systems/`, profile: false })),
  ...profileLocales.map((locale) => ({ path: `/${locale}/profile/2026/`, profile: true })),
];
for (const { path, profile } of routes) for (const theme of ["light", "dark"]) {
  test(`${path} ${theme}: short Settings viewport retains all controls`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 240 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${path}?theme=${theme}`);
    const trigger = settingsButton(page);
    await trigger.click();
    const panel = page.getByRole("dialog");
    await expect(page.locator('input[name="theme-preference"]:checked')).toBeFocused();
    // Keep the panel open across short, landscape and normal-height resizes.
    for (const size of [{ width: 390, height: 240 }, { width: 1280, height: 180 }, { width: 667, height: 320 }]) {
      await page.setViewportSize(size);
      const bounds = await panel.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(size.width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height);
      await page.locator('input[name="theme-preference"]:checked').focus();
      await page.keyboard.press("Tab");
      const language = page.locator("#language-select");
      await expect(language).toBeFocused();
      const selectBounds = await language.boundingBox();
      expect(selectBounds!.y).toBeGreaterThanOrEqual(0);
      expect(selectBounds!.y + selectBounds!.height).toBeLessThanOrEqual(size.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    // Theme changes and keyboard dismissal still work inside the bounded panel.
    await page.locator('input[value="light"]').focus();
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveClass(/theme-light/);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(panel).not.toBeVisible();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    await page.locator("#language-select").selectOption(path.startsWith("/en/") ? "zh-tw" : "en");
    await expect(page).toHaveURL(new RegExp(profile ? "/profile/2026/" : "/systems/"));
    await trigger.click();
    await expect(panel).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    await trigger.scrollIntoViewIfNeeded();
    await expect(panel).toHaveCSS("position", "absolute");
    await expect(panel).toHaveCSS("max-height", "none");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });
}
