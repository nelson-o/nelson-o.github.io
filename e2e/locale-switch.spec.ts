import { test, expect } from "@playwright/test";
import { EN, ZHTW, settingsButton } from "./fixtures";

test.describe("Locale switcher", () => {
  test("switches from /en to /zh-tw", async ({ page }) => {
    await page.goto("/en");
    await settingsButton(page).click();
    await page.getByLabel(EN.languageLabel).selectOption("zh-tw");
    await expect(page).toHaveURL(/\/zh-tw\/?/);
    await expect(page.getByRole("heading", { name: ZHTW.homeHeading, level: 1 })).toBeVisible();
  });

  test("switches from /zh-tw to /en", async ({ page }) => {
    await page.goto("/zh-tw");
    await settingsButton(page).click();
    await page.locator("#language-select").selectOption("en");
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("language select reflects current locale", async ({ page }) => {
    await page.goto("/en");
    await settingsButton(page).click();
    await expect(page.getByLabel(EN.languageLabel)).toHaveValue("en");
  });
});
