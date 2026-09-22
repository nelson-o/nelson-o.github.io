import { expect, test, type Page } from "@playwright/test";
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

// Themes may differ in colour, shadow, outline, and artwork only. Layout and
// typography are shared, so the same elements must measure the same in both.
const measuredSelectors = [
  "header", "header nav", "#profile-headline", "#about p", "#about a[href=\"#contact\"]",
  "main aside", "#experience", "#experience li", "#projects", "#projects article",
  "#projects article h3", "#projects article p", "#talks", "#talks summary", "#contact", "footer",
];

async function measureTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate(({ key, theme }) => localStorage.setItem(key, theme), { key: THEME_STORAGE_KEY, theme });
  await page.reload();
  await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
  await expect.poll(() => page.locator("#about img:visible").evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).complete))).toBe(true);
  return page.evaluate((selectors) => ({
    height: Math.round(document.documentElement.scrollHeight),
    nodes: selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((node, index) => {
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        node: `${selector}[${index}]`,
        box: [box.x, box.y, box.width, box.height].map(Math.round).join(" "),
        type: [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing].join(" "),
      };
    })),
  }), measuredSelectors);
}

test("light and dark share layout and typography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  for (const width of [390, 937, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const dark = await measureTheme(page, "dark");
    const light = await measureTheme(page, "light");
    expect(light.nodes.length).toBeGreaterThan(measuredSelectors.length);
    expect(light).toEqual(dark);
  }
});
