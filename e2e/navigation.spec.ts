import { test, expect } from "@playwright/test";
import { EN } from "./fixtures";

test.describe("Primary navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("primary navigation includes the approved About link", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: EN.primaryNavLabel }).getByRole("link", { name: "About" }),
    ).toHaveCount(1);
  });

  test("Engineering link navigates to /en/systems @smoke", async ({ page }) => {
    await page.getByRole("navigation", { name: EN.primaryNavLabel }).getByRole("link", { name: "Engineering" }).click();
    await expect(page).toHaveURL(/\/en\/systems\/?/);
  });

  test("site title navigates to the localized home from a section page", async ({ page }) => {
    await page.goto("/en/systems");
    await page.locator("header").getByRole("link", { name: EN.siteTitle }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(EN.homeHeading);
  });
});

for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) for (const width of [320, 390, 768, 1280]) {
  test(`${locale} ${width}: header links, mobile disclosure and settings remain reachable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/?theme=${theme}`);
      const header = page.locator("header").first();
      const menu = header.locator("details");
      if (width < 768) {
        await expect(header.locator("nav:visible")).toHaveCount(0);
        await menu.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(menu).toHaveAttribute("open", "");
        await page.keyboard.press("Tab");
        await expect(header.locator("nav:visible a").first()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(menu).not.toHaveAttribute("open", "");
        await expect(menu.locator("summary")).toBeFocused();
        await menu.locator("summary").click();
      }
      const links = header.locator("nav:visible a");
      expect(await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))))
        .toEqual([`/${locale}/profile/`, `/${locale}/systems/`, `/${locale}/work/`, `/${locale}/posts/`, `/${locale}/ideas/`, "#contact"]);
      await links.last().click();
      if (width < 768) await expect(menu).not.toHaveAttribute("open", "");
      await page.locator("#top").scrollIntoViewIfNeeded();
      await header.locator("button.theme-toggle").click();
      await expect(header.getByRole("dialog")).toBeVisible();
      await expect(header.locator("select")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("mobile navigation remains usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("/en/");
  await page.locator("header summary").click();
  await page.locator('header nav:visible a[href="/en/posts/"]').click();
  await expect(page).toHaveURL(/\/en\/posts\/?$/);
  await context.close();
});
