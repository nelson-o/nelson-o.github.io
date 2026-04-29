import { test, expect } from "@playwright/test";
import { waitForHydration, THEME_STORAGE_KEY, EN, settingsButton } from "./fixtures";

test.describe("Theme settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);
  });

  test("html has a theme class after hydration", async ({ page }) => {
    const cls = await page.locator("html").getAttribute("class");
    expect(cls).toMatch(/theme-light|theme-dark/);
  });

  test("settings button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: EN.settingsButtonLabel })).toBeVisible();
  });

  test("clicking dark theme radio applies theme-dark class", async ({ page }) => {
    await settingsButton(page).click();
    await page.getByRole("radio", { name: /dark/i }).check();
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
  });

  test("clicking light theme radio applies theme-light class", async ({ page }) => {
    await settingsButton(page).click();
    await page.getByRole("radio", { name: /light/i }).check();
    await expect(page.locator("html")).toHaveClass(/theme-light/);
  });

  test("localStorage is updated after theme change", async ({ page }) => {
    await settingsButton(page).click();
    await page.getByRole("radio", { name: /dark/i }).check();
    const stored = await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY);
    expect(stored).toBe("dark");
  });
});
