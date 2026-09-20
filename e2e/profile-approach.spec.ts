import { expect, test } from "@playwright/test";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { THEME_STORAGE_KEY } from "./fixtures";

for (const theme of ["light", "dark"] as const) {
  test(`mountain panel fits all locales in ${theme} theme`, async ({ page }, testInfo) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
      await page.goto(`/${locale}/profile/2026/`);
      await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
      const panel = page.getByRole("complementary", { name: profile2026Copy[locale].approach, exact: true });
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await panel.scrollIntoViewIfNeeded();
        await expect(panel.locator("blockquote")).toBeVisible();
        await expect(panel.locator("dd")).toHaveText(["15+", "10+", "4", "∞"]);
        expect(await panel.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe("rgb(11, 17, 21)");
        expect(await panel.evaluate((node) => [node, ...node.querySelectorAll("blockquote, li, dt")].every((item) => item.scrollWidth <= item.clientWidth))).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await panel.screenshot({ path: testInfo.outputPath(`approach-${locale}-${theme}-${width}.png`) });
      }
    }
    const response = await page.request.get("/profile/2026/div-mt.webp");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
  });
}
