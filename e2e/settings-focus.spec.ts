import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { profileLocales } from "../lib/profile-locales";
import { settingsButton } from "./fixtures";

const routes = [
  ...locales.map((locale) => `/${locale}/systems/`),
  ...profileLocales.map((locale) => `/${locale}/profile/2026/`),
];

for (const route of routes) {
  test(`${route}: settings dismiss when keyboard focus leaves`, async ({ page }) => {
    await page.goto(route);
    const button = settingsButton(page);
    await button.focus();
    await page.keyboard.press("Enter");
    const selected = page.locator('input[type="radio"]:checked');
    await expect(selected).toBeFocused();

    // Moving between controls inside Settings keeps the panel open.
    await page.keyboard.press("Tab");
    await expect(page.locator("#language-select")).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Shift+Tab");
    await expect(selected).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    // Leaving backward closes the panel without stealing focus from the link.
    await page.keyboard.press("Shift+Tab");
    const previous = page.locator(":focus");
    await expect(previous).toHaveJSProperty("tagName", "A");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#language-select")).not.toBeVisible();

    // Reopening and Escape still return focus to the trigger.
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(selected).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "false");

    if (!route.includes("profile")) {
      await page.keyboard.press("Enter");
      await expect(selected).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveJSProperty("tagName", "A");
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#language-select")).not.toBeVisible();
    }
  });
}
