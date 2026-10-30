import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { getSiteSearchCopy } from "../lib/i18n-site-search";

for (const locale of locales) {
  for (const [from, to] of [[390, 1280], [1280, 390], [390, 390], [1280, 1280]]) {
    for (const close of ["Escape", "button"]) {
      test(`${locale} ${from}→${to} ${close}: search restores usable keyboard focus`, async ({ page }) => {
        await page.setViewportSize({ width: from, height: 844 });
        await page.goto(`/${locale}/`);
        const header = page.locator("#top > header");
        const menu = header.locator("details");
        const copy = getSiteSearchCopy(locale);
        const dialog = page.getByRole("dialog", { name: copy.title });
        // Establish hydration before exercising the document shortcut listener.
        await header.locator("[data-search-field]").click();
        await expect(dialog.getByRole("searchbox")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        if (from < 768) await menu.locator("summary").click();
        const opener = from < 768 ? menu.getByRole("link").first() : header.getByRole("navigation").getByRole("link").first();
        await opener.focus();
        await page.keyboard.press("/");
        await expect(dialog.getByRole("searchbox")).toBeFocused();
        await page.setViewportSize({ width: to, height: 844 });
        await expect(dialog.getByRole("searchbox")).toBeFocused();
        if (close === "Escape") await page.keyboard.press("Escape");
        else {
          await dialog.getByRole("button", { name: copy.close }).focus();
          await page.keyboard.press("Enter");
        }
        await expect(dialog).not.toBeVisible();
        const restored = from === to ? opener : header.locator("[data-search-field]");
        await expect(restored).toBeVisible();
        await expect(restored).toBeFocused();
        await expect(restored).toHaveCSS("outline-style", "solid");
        if (from !== to) {
          await expect(menu).not.toHaveAttribute("open", "");
          await page.keyboard.press("Tab");
          await expect(header.locator(".theme-toggle")).toBeFocused();
          await page.keyboard.press("Shift+Tab");
          await expect(restored).toBeFocused();
          await page.keyboard.press("Enter");
          await expect(dialog.getByRole("searchbox")).toBeFocused();
        }
      });
    }
  }
}
