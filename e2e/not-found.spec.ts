import { test, expect } from "@playwright/test";

test.describe("404 handling", () => {
  test("unknown root path returns non-empty page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
  });

  test("unknown nested path returns non-empty page", async ({ page }) => {
    await page.goto("/en/systems/nonexistent-slug", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
  });
});
