import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { profileLocales } from "../lib/profile-locales";
import { settingsButton } from "./fixtures";

const routes = [
  ...locales.map((locale) => `/${locale}/systems/`),
  ...profileLocales.map((locale) => `/${locale}/profile/2026/`),
];

for (const route of routes) {
  test(`${route}: Settings exposes a named non-modal dialog`, async ({ page }) => {
    await page.goto(route);
    const button = settingsButton(page);
    const name = await button.getAttribute("aria-label");
    expect(name).toBeTruthy();
    await expect(button).toHaveAttribute("aria-haspopup", "dialog");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await button.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: name!, exact: true });
    await expect(dialog).toBeVisible();
    const id = await dialog.getAttribute("id");
    expect(id).toBeTruthy();
    await expect(button).toHaveAttribute("aria-controls", id!);
    await expect(dialog).not.toHaveAttribute("aria-modal", "true");
    await expect(dialog.locator('input[type="radio"]:checked')).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("combobox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    // A non-modal dialog must allow focus to leave and preserve outside dismissal.
    await page.keyboard.press("Enter");
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(":focus")).toHaveJSProperty("tagName", "A");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });
}
