import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { profileLocales } from "../lib/profile-locales";
import { settingsButton } from "./fixtures";

const routes = [
  ...locales.map((locale) => `/${locale}/systems/`),
  ...profileLocales.map((locale) => `/${locale}/profile/2026/`),
];

for (const route of routes) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${route} ${colorScheme}: forced colors distinguish selection from focus`, async ({ page }) => {
      await page.emulateMedia({ forcedColors: "active", colorScheme, reducedMotion: "reduce" });
      await page.goto(`${route}?theme=${colorScheme}`);
      await page.evaluate(() => document.fonts.ready);
      const button = settingsButton(page);
      await button.focus();
      await page.keyboard.press("Enter");
      const panel = page.getByRole("dialog");
      const checked = panel.locator('input[type="radio"]:checked');
      const selectedChip = panel.locator('label:has(input[type="radio"]:checked)');
      await expect(checked).toBeFocused();
      await expect(selectedChip).toHaveCSS("border-style", "double");
      await expect(selectedChip).toHaveCSS("border-width", "3px");
      await expect(selectedChip).toHaveCSS("outline-style", "solid");

      // Selection remains visible when keyboard focus moves elsewhere in Settings.
      await page.keyboard.press("Tab");
      await expect(panel.locator("select")).toBeFocused();
      await expect(selectedChip).toHaveCSS("outline-style", "none");
      await expect(selectedChip).toHaveCSS("border-style", "double");
      for (const chip of await panel.locator('label:has(input[type="radio"]:not(:checked))').all()) {
        await expect(chip).toHaveCSS("border-style", "solid");
        await expect(chip).toHaveCSS("border-width", "1px");
      }

      for (const width of [320, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await button.scrollIntoViewIfNeeded();
        const bounds = await panel.evaluate((node) => {
          const box = node.getBoundingClientRect();
          return { left: box.left, right: box.right, overflow: document.documentElement.scrollWidth > innerWidth };
        });
        expect(bounds.left).toBeGreaterThanOrEqual(0);
        expect(bounds.right).toBeLessThanOrEqual(width);
        expect(bounds.overflow).toBe(false);
        for (const label of await panel.locator('label:has(input[type="radio"])').all()) {
          expect(await label.evaluate((node) => {
            const text = node.querySelector("span")!.getBoundingClientRect();
            const box = node.getBoundingClientRect();
            return text.left >= box.left && text.right <= box.right && text.top >= box.top && text.bottom <= box.bottom;
          }), `label fits at ${width}px`).toBe(true);
        }
      }

      await page.keyboard.press("Shift+Tab");
      for (let index = 0; index < 3; index++) {
        await page.keyboard.press("ArrowRight");
        await expect(checked).toBeFocused();
        await expect(selectedChip).toHaveCSS("border-style", "double");
        await expect(selectedChip).toHaveCSS("outline-style", "solid");
        await expect(page.locator("html")).toHaveAttribute("data-theme-preference", await checked.inputValue());
      }
      await page.keyboard.press("Escape");
      await expect(panel).not.toBeVisible();
      await expect(button).toBeFocused();
    });
  }
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`${colorScheme}: normal color mode keeps the existing chip border`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: "none", colorScheme, reducedMotion: "reduce" });
    await page.goto(`/en/?theme=${colorScheme}`);
    await settingsButton(page).click();
    await expect(page.locator('label:has(input[type="radio"]:checked)')).toHaveCSS("border-style", "solid");
    await expect(page.locator('label:has(input[type="radio"]:checked)')).toHaveCSS("border-width", "1px");
  });
}
