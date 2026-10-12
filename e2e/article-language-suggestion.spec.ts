import { test, expect } from "@playwright/test";

const article = "/en/ideas/250610-agentic-delivery-loop/";

for (const [browserLocale, targetLocale] of [["ja-JP", "ja"], ["zh-Hans-CN", "zh-cn"]] as const) {
  test.describe(browserLocale, () => {
    test.use({ locale: browserLocale });

    test("suggests the available translation and follows its article link", async ({ page }) => {
      await page.goto(article);
      const suggestion = page.locator(`aside[lang="${targetLocale === "zh-cn" ? "zh-CN" : "ja"}"]`);
      await expect(suggestion).toBeVisible();
      await expect(suggestion.getByRole("link")).toHaveAttribute("href", article.replace("/en/", `/${targetLocale}/`));
      await suggestion.getByRole("link").click();
      await expect(page).toHaveURL(new RegExp(`/${targetLocale}/ideas/250610-agentic-delivery-loop/?$`));
      await expect(page.locator("aside[lang]")).toHaveCount(0);
    });

    test("remembers dismissal for the locale pair", async ({ page }) => {
      await page.goto(article);
      const suggestion = page.locator("aside[lang]");
      await expect(suggestion).toBeVisible();
      await suggestion.getByRole("button").click();
      await expect(suggestion).toHaveCount(0);
      expect(await page.evaluate((locale) => localStorage.getItem(`nelson-language-suggestion:en:${locale}`), targetLocale)).toBe("dismissed");
      await page.reload();
      await expect(page.locator("article h1")).toBeVisible();
      await expect(suggestion).toHaveCount(0);
    });
  });
}

test.describe("keyboard dismissal", () => {
  test.use({ locale: "ja-JP" });

  test("returns focus to the article heading without scrolling", async ({ page }) => {
    await page.goto(article, { waitUntil: "domcontentloaded" });
    const suggestion = page.locator("aside[lang]");
    await expect(suggestion).toBeVisible();
    await suggestion.getByRole("button").focus();
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    await expect(suggestion).toHaveCount(0);
    await expect(page.locator("article h1")).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).not.toBeFocused();
  });

  test("does not move focus when dismissal did not hold it", async ({ page }) => {
    await page.goto(article, { waitUntil: "domcontentloaded" });
    const suggestion = page.locator("aside[lang]");
    await expect(suggestion).toBeVisible();
    const link = page.locator("header a").first();
    await link.focus();
    await suggestion.getByRole("button").evaluate((button) => (button as HTMLButtonElement).click());
    await expect(suggestion).toHaveCount(0);
    await expect(link).toBeFocused();
  });

  test("still restores focus when persistent storage is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
    });
    await page.goto(article, { waitUntil: "domcontentloaded" });
    await page.locator("aside[lang] button").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("aside[lang]")).toHaveCount(0);
    await expect(page.locator("article h1")).toBeFocused();
  });
});
