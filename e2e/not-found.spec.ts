import { test, expect } from "@playwright/test";
import { getNotFoundCopy } from "../lib/i18n-not-found";
import { getLocaleHrefLang, locales } from "../lib/i18n";

for (const locale of locales) for (const theme of ["light", "dark"] as const) {
  test(`${locale} ${theme}: direct nested static 404 preserves language and keyboard recovery @smoke`, async ({ page, request }) => {
    const copy = getNotFoundCopy(locale);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const path = `/${locale}/systems/does-not-exist/?theme=${theme}`;
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    expect(new URL(page.url()).pathname).toBe(`/${locale}/systems/does-not-exist/`);
    await expect(page.locator("html")).toHaveAttribute("lang", getLocaleHrefLang(locale));
    await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(copy.title);
    await expect(page.getByText(copy.description, { exact: true })).toBeVisible();
    const home = page.getByRole("link", { name: copy.home, exact: true });
    const systems = page.getByRole("link", { name: copy.systems, exact: true });
    await expect(home).toHaveAttribute("href", `/${locale}/`);
    await expect(systems).toHaveAttribute("href", `/${locale}/systems/`);
    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(systems).toBeFocused();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    for (const link of await page.getByRole("main").getByRole("link").all()) {
      const href = await link.getAttribute("href");
      expect((await request.get(href!)).status()).toBe(200);
    }
    expect(errors).toEqual([]);
    await home.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/$`));
  });
}

for (const path of ["/missing/", "/ko/nested/missing/", "/zh-tw-extra/missing/", "/missing/?lang=ja"]) {
  test(`${path}: unsupported or absent prefixes use English without a redirect`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(getNotFoundCopy("en").title);
    await expect(page.getByRole("link", { name: "Go back home" })).toHaveAttribute("href", "/en/");
    expect(new URL(page.url()).pathname).toBe(path.split("?")[0]);
  });
}

for (const locale of [...locales, "ko"]) {
  test(`${locale}: shared no-JavaScript 404 offers every exported language homepage`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const response = await page.goto(`${baseURL}/${locale}/systems/missing/`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("main")).toHaveCount(1);
    const navigation = page.getByRole("navigation", { name: "Choose a reading language" });
    for (const option of locales) {
      await expect(navigation.locator(`a[href="/${option}/"]`)).toBeVisible();
      await expect(navigation.locator(`a[href="/${option}/"]`)).toHaveAttribute("lang", getLocaleHrefLang(option));
    }
    await navigation.locator('a[href="/zh-tw/"]').click();
    await expect(page).toHaveURL(/\/zh-tw\/$/);
    await context.close();
  });
}
