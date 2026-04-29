import { test, expect } from "@playwright/test";
import { EN, ZHTW, settingsButton } from "./fixtures";

test.describe("Locale switcher", () => {
  test("switches from /en to /zh-tw", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: EN.settingsButtonLabel }).click();
    await expect(page.getByText(EN.languageLabel, { exact: true })).toBeVisible();

    await page.getByLabel(EN.languageLabel).selectOption("zh-tw");

    await expect(page).toHaveURL(/\/zh-tw\/?/);
    await expect(page.getByRole("heading", { name: ZHTW.homeHeading, level: 1 })).toBeVisible();
  });

  test("switches from /zh-tw to /en", async ({ page }) => {
    await page.goto("/zh-tw");
    await page.getByRole("button", { name: ZHTW.settingsButtonLabel }).click();
    await expect(page.getByText(ZHTW.languageLabel, { exact: true })).toBeVisible();

    await page.getByLabel(ZHTW.languageLabel).selectOption("en");

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole("heading", { name: EN.homeHeading, level: 1 })).toBeVisible();
  });

  test("language select reflects current locale in each supported locale", async ({ page }) => {
    await page.goto("/zh-tw");
    await settingsButton(page).click();
    await expect(page.getByLabel(ZHTW.languageLabel)).toHaveValue("zh-tw");

    await page.goto("/en");
    await page.getByRole("button", { name: EN.settingsButtonLabel }).click();
    await expect(page.getByLabel(EN.languageLabel)).toHaveValue("en");
  });
});
