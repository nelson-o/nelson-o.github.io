import { test, expect } from "@playwright/test";
import { EN, ZHTW, waitForHydration } from "./fixtures";

test.describe("Root gateway page", () => {
  test("redirects unmatched browser locales to /en", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "languages", { value: ["ja-JP"], configurable: true });
      Object.defineProperty(navigator, "language", { value: "ja-JP", configurable: true });
    });
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("redirects Traditional Chinese browser locales to /zh-tw", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "languages", { value: ["zh-Hant-TW"], configurable: true });
      Object.defineProperty(navigator, "language", { value: "zh-Hant-TW", configurable: true });
    });
    await page.goto("/");
    await expect(page).toHaveURL(/\/zh-tw\/?$/);
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
