import { expect, test } from "@playwright/test";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

test("footer artwork follows locale switching", async ({ page }) => {
  await page.goto("/en/profile/2026/");
  for (const [locale, asset] of [["en", "en"], ["zh-tw", "zh"], ["zh-cn", "zh"], ["ja", "ja"]] as const) {
    await settingsButton(page).click();
    await page.locator("#language-select").selectOption(locale);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(new RegExp(`/${locale}/profile/2026/?$`));
    const tagline = page.locator("#contact img");
    await tagline.scrollIntoViewIfNeeded();
    await expect(tagline).toHaveAttribute("src", `/profile/2026/contact/signature.${asset}.webp`);
    await expect(page.getByRole("heading", { name: profile2026Copy[locale].manifesto.join(" "), exact: true })).toBeVisible();
    await expect.poll(() => tagline.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} project artwork loads and footer fits desktop and mobile`, async ({ page }, testInfo) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    await page.goto("/en/profile/2026/");
    await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
    const cards = page.locator("#projects article");
    for (const [index, asset] of ["waves", "developer-tools", "signals"].entries()) {
      const background = await cards.nth(index).evaluate((card) => getComputedStyle(card).backgroundImage);
      expect(background).toContain(`/profile/2026/projects/${asset}.${theme}.webp`);
      const response = await page.request.get(`/profile/2026/projects/${asset}.${theme}.webp`);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
    }
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator("#contact img").scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("#contact img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const tagline = await page.locator("#contact img").boundingBox();
      expect(tagline!.width / tagline!.height).toBeCloseTo(1120 / 373, 1);
      await page.screenshot({ path: testInfo.outputPath(`footer-${theme}-${width}.png`), fullPage: true });
    }
  });
}
