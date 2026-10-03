import { test, expect } from "@playwright/test";
import { getDictionary, locales, sections } from "../lib/i18n";

for (const locale of locales) {
  test(`${locale}: current section follows navigation and browser history`, async ({ page }) => {
    const nav = page.getByRole("navigation", { name: getDictionary(locale).primaryNavigationLabel });
    const current = nav.locator("a[aria-current]");
    await page.goto(`/${locale}/`);
    await expect(current).toHaveCount(0);

    for (const section of sections) {
      const link = nav.getByRole("link", { name: getDictionary(locale).navigation[section], exact: true });
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`/${locale}/${section}/?$`));
      await expect(current).toHaveCount(1);
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(link).toHaveCSS("text-decoration-line", "underline");
    }

    await page.goto(`/${locale}/ideas/agent-loops/`);
    await expect(current).toHaveAttribute("href", `/${locale}/ideas/`);
    await expect(current).toHaveAttribute("aria-current", "location");
    await page.goto(`/${locale}/footprint/`);
    await expect(current).toHaveCount(0);
    await page.goBack();
    await expect(current).toHaveAttribute("aria-current", "location");
    await page.goForward();
    await expect(current).toHaveCount(0);
  });

  test(`${locale}: static export marks the current section without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto(`/${locale}/systems/`);
    const current = page.locator("header nav a[aria-current]");
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("href", `/${locale}/systems/`);
    await expect(current).toHaveAttribute("aria-current", "page");
    await context.close();
  });
}
