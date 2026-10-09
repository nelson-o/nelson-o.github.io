import { test, expect } from "@playwright/test";

const article = "/en/ideas/250610-agentic-delivery-loop/";

for (const [browserLocale, targetLocale] of [["ja-JP", "ja"], ["zh-Hans-CN", "zh-cn"]] as const) {
  test.describe(browserLocale, () => {
    test.use({ locale: browserLocale });

    test("suggests the available translation and follows its article link", async ({ page }) => {
      await page.goto(article);
      const suggestion = page.locator(`aside[lang="${targetLocale === "zh-cn" ? "zh-CN" : "ja"}"]`);
      await expect(suggestion).toBeVisible();
      await expect(suggestion.getByRole("link")).toHaveAttribute("href", article.replace("/en/", `/${targetLocale}/`).replace(/\/$/, ""));
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
