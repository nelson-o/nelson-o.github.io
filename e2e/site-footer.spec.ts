import { expect, test } from "@playwright/test";
import { getSiteFooterCopy } from "../lib/i18n-site-footer";
import { getProfile } from "../lib/profile";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  for (const width of [320, 390, 1280]) for (const javaScriptEnabled of [false, true]) {
    test(`${locale} footer at ${width}px with JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: "reduce", viewport: { width, height: 800 } });
      const destination = getProfile(locale).basics.linkedin!;
      await context.route("**/*", async (route) => {
        if (route.request().url() === destination) await route.fulfill({ contentType: "text/html", body: "<h1>Approved contact destination</h1>" });
        else if (new URL(route.request().url()).origin === new URL(baseURL!).origin) await route.continue();
        else await route.abort();
      });
      try {
        const page = await context.newPage();
        const copy = getSiteFooterCopy(locale);
        // Without JavaScript the site uses its static light-theme tokens.
        for (const theme of javaScriptEnabled ? ["light", "dark"] : ["light"]) {
          await page.emulateMedia({ colorScheme: theme as "light" | "dark" });
          await page.goto(`${baseURL}/${locale}/?theme=${theme}`);
          if (javaScriptEnabled) await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
          await expect(page.locator("html")).toHaveCSS("color-scheme", theme);
          const header = page.locator("#top > header");
          if (width < 768) await header.locator("summary").click();
          await header.locator('a[href="#contact"]:visible').click();
          const footer = page.locator("footer#contact");
          await expect(footer).toBeInViewport();
          const navigation = footer.getByRole("navigation", { name: copy.navigation });
          await expect(navigation).toBeVisible();
          const contact = navigation.getByRole("link", { name: copy.contactAction, exact: true });
          await expect(contact).toHaveAttribute("href", destination);
          await expect(footer.locator('a[href="#contact"]')).toHaveCount(0);
          await expect(footer.getByRole("link", { name: "RSS", exact: true })).toHaveAttribute("href", `/${locale}/feed.xml`);
          await expect(footer.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", destination);
          await navigation.getByRole("link", { name: copy.ideas, exact: true }).focus();
          await page.keyboard.press("Tab");
          await expect(contact).toBeFocused();
          await expect(contact).toHaveCSS("outline-style", "solid");
          expect(await contact.evaluate((node) => {
            const r = node.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && node.scrollWidth <= node.clientWidth;
          })).toBe(true);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          await footer.getByRole("link", { name: copy.top, exact: true }).click();
          await expect(page).toHaveURL(/#top$/);
          await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
          await contact.focus();
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL(destination);
          await expect(page.getByRole("heading", { name: "Approved contact destination" })).toBeVisible();
        }
      } finally { await context.close(); }
    });
  }
}
