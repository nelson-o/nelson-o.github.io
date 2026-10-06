import { expect, test, type Locator } from "@playwright/test";
import { getDictionary, locales } from "../lib/i18n";

const languages = { en: "en", "zh-tw": "zh-TW", "zh-cn": "zh-CN", ja: "ja" };
const article = "/systems/platform-surfaces/";

async function expectLanguage(element: Locator, language: string) {
  await expect(element).toBeVisible();
  await expect.poll(() => element.evaluate((node) =>
    node.closest("[lang]")?.getAttribute("lang"),
  )).toBe(language);
}

test.describe("Exported site content language", () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of locales) {
    test(`${locale}: language is available before hydration`, async ({ page }) => {
      for (const path of ["/", "/systems/", article, "/footprint/"]) {
        await page.goto(`/${locale}${path}`);
        for (const element of [
          page.getByRole("heading", { level: 1 }),
          page.getByRole("navigation"),
          page.getByRole("contentinfo"),
        ]) {
          await expectLanguage(element, languages[locale]);
        }
      }
    });
  }
});

for (const suggested of locales) {
  test.describe(`${suggested} browser preference`, () => {
    test.use({ locale: languages[suggested] });
    const dictionary = getDictionary(suggested);
    const label = dictionary.articleLanguageSuggestion;

    for (const current of locales.filter((locale) => locale !== suggested)) {
      test(`${current}: prompt overrides the article language and opens its translation`, async ({ page }) => {
        await page.goto(`/${current}${article}`);
        await expectLanguage(page.getByRole("heading", { level: 1 }), languages[current]);
        const prompt = page.getByRole("complementary", { name: label.label });
        await expectLanguage(prompt, languages[suggested]);
        await expectLanguage(prompt.getByRole("link"), languages[suggested]);
        await expectLanguage(prompt.getByRole("button"), languages[suggested]);
        await prompt.getByRole("link").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`/${suggested}${article}?$`));
        await expectLanguage(page.getByRole("heading", { level: 1 }), languages[suggested]);
        await expect(page.getByRole("complementary", { name: label.label })).toHaveCount(0);
      });
    }

    test("dismissal still persists after reload", async ({ page }) => {
      const current = suggested === "en" ? "zh-tw" : "en";
      await page.goto(`/${current}${article}`);
      const prompt = page.getByRole("complementary", { name: label.label });
      await prompt.getByRole("button", { name: label.dismiss }).focus();
      await page.keyboard.press("Enter");
      await expect(prompt).toHaveCount(0);
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(prompt).toHaveCount(0);
    });
  });
}
