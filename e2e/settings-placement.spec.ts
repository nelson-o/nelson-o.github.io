import { expect, test, type Locator } from "@playwright/test";
import { locales } from "../lib/i18n";
import { profileLocales } from "../lib/profile-locales";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

async function settledPanel(panel: Locator) {
  await expect(panel).toBeVisible();
  // Reduced motion opens the panel without decorative movement.
  await panel.evaluate(async (node) => {
    await Promise.all(node.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
  await expect(panel).toHaveCSS("opacity", "1");
  await expect(panel).toHaveCSS("transform", "none");
}

const routes = [
  ...locales.map((locale) => ({ locale, path: `/${locale}/systems/`, profile: false })),
  ...profileLocales.map((locale) => ({ locale, path: `/${locale}/profile/2026/`, profile: true })),
];

for (const { locale, path, profile } of routes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${path} ${theme}: Settings fits across widths and preserves interaction`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
        key: THEME_STORAGE_KEY, value: theme,
      });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const button = settingsButton(page);
      const panel = page.locator(`[data-placement="${profile ? "above" : "below"}"]`);

      // Keep it open through mobile, breakpoint and desktop resizes.
      await button.click();
      for (const width of [320, 390, 480, 481, 1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await button.scrollIntoViewIfNeeded();
        await settledPanel(panel);
        const bounds = await panel.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const trigger = node.parentElement!.getBoundingClientRect();
          const actions = document.querySelector("header nav")?.parentElement?.getBoundingClientRect();
          return {
            left: box.left, right: box.right, top: box.top, bottom: box.bottom,
            triggerTop: trigger.top, triggerBottom: trigger.bottom, triggerRight: trigger.right,
            actionsBottom: actions?.bottom, actionsRight: actions?.right,
            viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
          };
        });
        expect(bounds.left, `${width}px left`).toBeGreaterThanOrEqual(0);
        expect(bounds.right, `${width}px right`).toBeLessThanOrEqual(width);
        expect(bounds.documentWidth, `${width}px overflow`).toBeLessThanOrEqual(width);
        if (profile) {
          expect(bounds.bottom).toBeLessThanOrEqual(bounds.triggerTop);
          expect(Math.abs(bounds.right - bounds.triggerRight)).toBeLessThan(1);
        } else if (width <= 480) {
          expect(bounds.top).toBeGreaterThanOrEqual(bounds.actionsBottom!);
          expect(Math.abs(bounds.right - bounds.actionsRight!)).toBeLessThan(1);
        } else {
          expect(bounds.top).toBeGreaterThanOrEqual(bounds.triggerBottom);
          expect(Math.abs(bounds.right - bounds.triggerRight)).toBeLessThan(1);
        }
      }

      await page.keyboard.press("Escape");
      await expect(button).toBeFocused();
      await expect(panel).not.toBeVisible();
      await page.keyboard.press("Enter");
      await settledPanel(panel);
      await expect(page.locator('input[type="radio"]:checked')).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(panel).not.toBeVisible();
      await expect(page.locator(":focus")).toHaveJSProperty("tagName", "A");
      await button.focus();
      await page.keyboard.press("Enter");
      await settledPanel(panel);
      const nextLocale = locale === "en" ? "zh-tw" : "en";
      await page.locator("#language-select").selectOption(nextLocale);
      await expect(page).toHaveURL(new RegExp(`/${nextLocale}/${profile ? "profile/2026" : "systems"}/?$`));
      await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
      await button.click();
      await settledPanel(panel);
      const box = await panel.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    });
  }
}
