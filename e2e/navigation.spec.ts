import { test, expect } from "@playwright/test";
import { EN } from "./fixtures";

test.describe("Primary navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("primary navigation omits the explicit Profile link", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: EN.primaryNavLabel }).getByRole("link", { name: "Profile" }),
    ).toHaveCount(0);
  });

  test("Systems link navigates to /en/systems @smoke", async ({ page }) => {
    await page.getByRole("navigation", { name: EN.primaryNavLabel }).getByRole("link", { name: "Systems" }).click();
    await expect(page).toHaveURL(/\/en\/systems\/?/);
  });

  test("site title navigates to the localized profile from a section page", async ({ page }) => {
    await page.goto("/en/systems");
    await page.getByRole("link", { name: EN.siteTitle }).click();
    await expect(page).toHaveURL(/\/en\/profile\/?/);
    // The alias serves the 2026 edition since #62.
    await expect(page.locator("#profile-headline")).toBeVisible();
  });
});
