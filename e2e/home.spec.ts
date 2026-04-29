import { test, expect } from "@playwright/test";
import { EN, ZHTW, waitForHydration } from "./fixtures";

test.describe("Root gateway page", () => {
  test("renders heading and both locale links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: EN.localeGatewayHeading, level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /English/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /繁體中文/ })).toBeVisible();
  });

  test("English link routes to /en", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /English/ }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

test.describe("English home page (/en)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);
  });

  test("renders site title in header", async ({ page }) => {
    await expect(page.getByRole("link", { name: EN.siteTitle })).toBeVisible();
  });

  test("renders hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: EN.homeHeading, level: 1 })).toBeVisible();
  });

  test("renders primary section cards", async ({ page }) => {
    const cards = page.getByRole("region", { name: EN.primarySectionsLabel }).getByRole("link");
    await expect(cards).toHaveCount(4);
  });

  test("renders at least one entry in latest writing", async ({ page }) => {
    await expect(page.getByRole("main").getByRole("link").first()).toBeVisible();
  });

  test("renders footer", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});

test.describe("Traditional Chinese home page (/zh-tw)", () => {
  test("renders zh-tw h1", async ({ page }) => {
    await page.goto("/zh-tw");
    await expect(page.getByRole("heading", { name: ZHTW.homeHeading, level: 1 })).toBeVisible();
  });

  test("html[lang] is zh-TW", async ({ page }) => {
    await page.goto("/zh-tw");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  });
});
