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

test("agentic delivery loop article renders mermaid content", async ({ page }) => {
  await page.goto("/en/ideas/250610-agentic-delivery-loop");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A delivery loop for agentic engineering",
  );
  await expect(page.locator("article")).toContainText("spec-first delivery loop");
  await expect(page.locator("[data-mermaid-chart='true']")).toBeVisible();
});

test("agentic delivery loop article renders zh-tw version", async ({ page }) => {
  await page.goto("/zh-tw/ideas/250610-agentic-delivery-loop");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("代理工程的交付迴圈");
  await expect(page.locator("article")).toContainText("規格優先");
  await expect(page.locator("[data-mermaid-chart='true']")).toBeVisible();
});
