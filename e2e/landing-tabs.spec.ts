import { expect, test } from "@playwright/test";
import { locales, sections } from "../lib/i18n";
import { getLandingTabsCopy } from "../lib/i18n-landing-tabs";

for (const locale of locales) {
  for (const width of [320, 390, 1280]) {
    test(`${locale} section links work without JavaScript at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
      const page = await context.newPage();
      const copy = getLandingTabsCopy(locale);
      await page.goto(`/${locale}/`);
      const navigation = page.getByRole("navigation", { name: copy.navigation });
      await expect(navigation.getByRole("link")).toHaveCount(5);
      const current = navigation.locator('[aria-current="page"]');
      await expect(current).toHaveText(copy.latest);
      await expect(current).toHaveAttribute("href", `/${locale}/`);
      await expect(page.getByRole("tab")).toHaveCount(0);
      if (width === 320 && (locale === "en" || locale === "ja")) {
        expect(await navigation.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const section of sections) {
        const link = navigation.getByRole("link", { name: copy[section], exact: true });
        await expect(link).toHaveAttribute("href", `/${locale}/${section}/`);
        await link.focus();
        await expect(link).toBeFocused();
        await expect(link).toBeInViewport();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`/${locale}/${section}/$`));
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await page.goto(`/${locale}/`);
      }
      await context.close();
    });
  }
}

test("active underline and keyboard focus remain visible in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.goto(`/en/?theme=${theme}`);
    const nav = page.getByRole("navigation", { name: "Writing sections" });
    const active = nav.getByRole("link", { name: "Latest", exact: true });
    expect(await active.evaluate((node) => getComputedStyle(node).borderBottomStyle)).toBe("solid");
    expect(await active.evaluate((node) => getComputedStyle(node).borderBottomWidth)).toBe("3px");
    await active.focus();
    await page.keyboard.press("Tab");
    const engineering = nav.getByRole("link", { name: "Engineering", exact: true });
    await expect(engineering).toBeFocused();
    expect(await engineering.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
  }
});
