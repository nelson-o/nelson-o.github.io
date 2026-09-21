import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n-types";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

for (const locale of locales) {
  test(`${locale} light artwork and responsive mockup composition`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript((key) => localStorage.setItem(key, "light"), THEME_STORAGE_KEY);
    await page.goto(`/${locale}/profile/2026/`);
    const portrait = page.getByRole("img", { name: profile2026Copy[locale].portrait, exact: true });
    await expect(portrait).toHaveCount(1);
    await expect(portrait).toHaveAttribute("src", "/profile/2026/hero/portrait.light.webp");
    await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator("#profile-headline span")).toHaveCSS("color", "rgb(0, 105, 238)");
    await expect(page.locator("#about").getByRole("link", { name: profile2026Copy[locale].contact })).toHaveCSS("background-color", "rgb(0, 105, 238)");
    for (const width of [320, 390, 768, 937, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width === 937) {
        const cards = await page.locator("#projects article").all();
        const positions = await Promise.all(cards.map(async (card) => (await card.boundingBox())!.y));
        expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(2);
        const activity = (await page.locator("#talks").boundingBox())!;
        const lastCard = (await cards[2].boundingBox())!;
        expect(activity.x).toBeGreaterThan(lastCard.x + lastCard.width);
      }
      await page.screenshot({ path: testInfo.outputPath(`${locale}-light-${width}.png`), fullPage: true });
    }
  });
}

test("artwork follows explicit and system themes without duplicate accessible portraits", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  const portrait = page.getByRole("img", { name: profile2026Copy.en.portrait, exact: true });
  const assertTheme = async (theme: "light" | "dark") => {
    await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
    await expect(portrait).toHaveCount(1);
    await expect(portrait).toHaveAttribute("src", `/profile/2026/hero/portrait.${theme}.webp`);
    await expect.poll(() => page.locator("#projects article").first().evaluate((node) => getComputedStyle(node).backgroundImage)).toContain(`waves.${theme}.webp`);
    const scene = page.getByRole("complementary", { name: profile2026Copy.en.approach, exact: true }).locator(":scope > div");
    await expect.poll(() => scene.evaluate((node) => getComputedStyle(node, "::before").backgroundImage)).toContain(`mountains.${theme}.webp`);
  };
  await assertTheme("dark");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: testInfo.outputPath("en-dark-1440.png"), fullPage: true });
  await settingsButton(page).click();
  await page.getByRole("radio", { name: "Light", exact: true }).check({ force: true });
  await page.keyboard.press("Escape");
  await assertTheme("light");
  await page.reload();
  await assertTheme("light");
  await settingsButton(page).click();
  await page.getByRole("radio", { name: "System", exact: true }).check({ force: true });
  await page.keyboard.press("Escape");
  await assertTheme("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await assertTheme("light");
});
