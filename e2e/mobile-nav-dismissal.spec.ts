import { expect, test } from "@playwright/test";
import { getSiteSearchCopy } from "../lib/i18n-site-search";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  test(`${locale}: mobile navigation dismisses outside without stealing focus`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/`);
    const header = page.locator("#top > header"), menu = header.locator("details"), summary = menu.locator("summary");
    const links = menu.getByRole("link"), search = header.locator("[data-search-field]"), settings = header.locator(".theme-toggle");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    await page.keyboard.press("Tab");
    await expect(links.first()).toBeFocused();
    for (let i = 1; i < await links.count(); i++) {
      await page.keyboard.press("Tab");
      await expect(links.nth(i)).toBeFocused();
      await expect(menu).toHaveAttribute("open", "");
    }
    await page.keyboard.press("Tab");
    await expect(search).toBeFocused();
    await expect(menu).not.toHaveAttribute("open", "");

    await summary.click();
    await links.first().focus();
    await page.keyboard.press("Shift+Tab");
    await expect(summary).toBeFocused();
    await expect(menu).toHaveAttribute("open", "");
    await page.keyboard.press("Shift+Tab");
    await expect(header.getByRole("link").first()).toBeFocused();
    await expect(menu).not.toHaveAttribute("open", "");

    await summary.click();
    await links.first().focus();
    await page.keyboard.press("Escape");
    await expect(summary).toBeFocused();
    await expect(menu).not.toHaveAttribute("open", "");
    await summary.click();
    await settings.click();
    await expect(settings).toHaveAttribute("aria-expanded", "true");
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(header.locator('input[type="radio"]:checked')).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(settings).toBeFocused();

    await summary.click();
    await search.click();
    const dialog = page.getByRole("dialog", { name: getSiteSearchCopy(locale).title });
    await expect(dialog.getByRole("searchbox")).toBeFocused();
    await expect(menu).not.toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(search).toBeFocused();
    await summary.click();
    await links.first().focus();
    await page.keyboard.press("/");
    await expect(dialog.getByRole("searchbox")).toBeFocused();
    await dialog.getByRole("searchbox").click();
    await expect(menu).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(summary).toBeFocused();
    await summary.click();
    await page.mouse.click(4, 700);
    await expect(menu).not.toHaveAttribute("open", "");
  });
}

for (const locale of ["en", "zh-tw"]) test(`${locale}: crossing desktop breakpoint clears stale mobile state`, async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 900 });
  await page.goto(`/${locale}/?theme=dark`);
  const header = page.locator("#top > header"), menu = header.locator("details");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(header.getByRole("navigation")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.locator("summary").click();
  await menu.locator(`a[href="/${locale}/posts/"]`).click();
  await expect(page).toHaveURL(new RegExp(`/${locale}/posts/$`));
  await expect(menu).not.toHaveAttribute("open", "");
});

test("touching Settings closes mobile navigation before opening its panel", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 700 }, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto("/en/");
    const header = page.locator("#top > header"), menu = header.locator("details");
    await menu.locator("summary").tap();
    await expect(menu).toHaveAttribute("open", "");
    await header.locator(".theme-toggle").tap();
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(header.locator(".theme-toggle")).toHaveAttribute("aria-expanded", "true");
  } finally { await context.close(); }
});

test("desktop reset does not steal focus from an open native modal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  const menu = page.locator("#top > header details");
  await menu.locator("summary").click();
  await menu.getByRole("link").first().focus();
  await page.keyboard.press("/");
  const input = page.getByRole("searchbox");
  await expect(input).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(input).toBeFocused();
});
