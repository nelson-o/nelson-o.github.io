import { test, expect } from "@playwright/test";
import { EN, ZHTW, waitForHydration } from "./fixtures";

test.describe("Root gateway page", () => {
  const cases = [
    { languages: ["fr-FR"], target: "en", tag: " @smoke" },
    { languages: ["zh-Hant-TW"], target: "zh-tw", tag: "" },
    { languages: ["zh-HK"], target: "zh-tw", tag: "" },
    { languages: ["ja-JP"], target: "ja", tag: "" },
    { languages: ["zh-CN"], target: "zh-cn", tag: "" },
    { languages: ["zh-Hans-SG"], target: "zh-cn", tag: "" },
  ];

  for (const { languages, target, tag } of cases) {
    test(`redirects ${languages.join(", ")} browsers to /${target}${tag}`, async ({ page }) => {
      await page.addInitScript((value) => {
        Object.defineProperty(navigator, "languages", { value, configurable: true });
        Object.defineProperty(navigator, "language", { value: value[0], configurable: true });
      }, languages);
      await page.goto("/");
      await expect(page).toHaveURL(new RegExp(`/${target}/?$`));
    });
  }

  test("keeps the English fallback link without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("link", { name: "Continue to English" }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await context.close();
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

  test("renders hero heading @smoke", async ({ page }) => {
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
  test("renders zh-tw h1 @smoke", async ({ page }) => {
    await page.goto("/zh-tw");
    await expect(page.getByRole("heading", { name: ZHTW.homeHeading, level: 1 })).toBeVisible();
  });

  test("html[lang] is zh-TW", async ({ page }) => {
    await page.goto("/zh-tw");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  });
});
