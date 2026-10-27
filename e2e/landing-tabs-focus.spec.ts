import { expect, test, type Locator } from "@playwright/test";
import { locales } from "../lib/i18n";

async function expectVisibleFocus(link: Locator) {
  await expect(link).toBeFocused();
  await expect.poll(() => link.evaluate((node) => {
    const link = node.getBoundingClientRect();
    const panel = node.parentElement!.getBoundingClientRect();
    return link.left >= panel.left - 1 && link.right <= panel.right + 1;
  })).toBe(true);
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("outline-width", "2px");
}

for (const locale of locales) {
  for (const theme of ["light", "dark"] as const) {
    test(`${locale} ${theme}: landing navigation reveals each keyboard target`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      for (const width of [320, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/?theme=${theme}`);
        await page.evaluate(() => document.fonts.ready);
        const tabs = page.locator('nav[class*="landing-tabs"]');
        const links = tabs.getByRole("link");
        await expect(links).toHaveCount(5);
        await expect(links.first()).toHaveAttribute("aria-current", "page");
        await links.first().focus();
        // Enter keyboard modality without changing the initial target.
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        const top = await tabs.evaluate((node) => node.getBoundingClientRect().top);
        for (let index = 0; index < 5; index++) {
          if (index) await page.keyboard.press("Tab");
          await expectVisibleFocus(links.nth(index));
          expect(Math.abs(await tabs.evaluate((node) => node.getBoundingClientRect().top) - top)).toBeLessThan(1);
        }
        for (let index = 3; index >= 0; index--) {
          await page.keyboard.press("Shift+Tab");
          await expectVisibleFocus(links.nth(index));
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`/${locale}/systems/`));
      }
    });
  }
}

test("landing navigation remains keyboard usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto("/en/");
  const links = page.locator('nav[class*="landing-tabs"] a');
  await links.first().focus();
  for (let index = 1; index < 5; index++) {
    await page.keyboard.press("Tab");
    await expectVisibleFocus(links.nth(index));
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/digests\//);
  await context.close();
});
