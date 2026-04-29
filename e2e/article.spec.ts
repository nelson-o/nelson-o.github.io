import { test, expect } from "@playwright/test";
import { EN } from "./fixtures";

test.describe("Article page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/systems/platform-surfaces");
  });

  test("renders article h1 with content", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders body content", async ({ page }) => {
    await expect(page.locator("article")).toContainText("platform");
  });

  test("site title link navigates to /en/profile", async ({ page }) => {
    await page.getByRole("link", { name: EN.siteTitle }).click();
    await expect(page).toHaveURL(/\/en\/profile\/?/);
  });
});
