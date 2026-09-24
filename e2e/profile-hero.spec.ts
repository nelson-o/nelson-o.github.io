import { expect, test } from "@playwright/test";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

test("hero artwork follows locale switching on the exported profile", async ({ page }) => {
  await page.goto("/en/profile/2026/");
  for (const [locale, asset] of [["en", "en"], ["zh-tw", "zh"], ["zh-cn", "zh"], ["ja", "ja"]] as const) {
    await settingsButton(page).click();
    await page.locator("#language-select").selectOption(locale);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(new RegExp(`/${locale}/profile/2026/?$`));
    const hero = page.locator("#about");
    const tagline = hero.getByRole("img", { name: profile2026Copy[locale].tagline, exact: true });
    await expect(tagline).toHaveAttribute("src", `/profile/2026/hero/tagline.${asset}.webp`);
    await expect(tagline).toBeVisible();
    await expect(hero.locator("video")).toHaveCount(locale === "ja" ? 0 : 1);
    await expect(hero.locator("img:visible")).toHaveCount(2);
    await expect.poll(() => hero.locator("img").evaluateAll((images) => images.every((image) =>
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
    ))).toBe(true);
    await expect(hero.getByRole("link", { name: profile2026Copy[locale].contact })).toHaveAttribute("href", "#contact");
  }
});

for (const theme of ["light", "dark"]) {
  test(`English hero plays once and fits ${theme} layouts`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    await page.goto("/en/profile/2026/");
    const video = page.locator("#about video");
    await expect(video).toBeVisible();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
    await expect(video).toHaveJSProperty("playbackRate", 3);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.hasAttribute("playsinline") && !v.loop && !v.controls)).toBe(true);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended), { timeout: 12000 }).toBe(true);
    await expect(video).toBeVisible();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const box = await video.boundingBox();
      expect(box!.width / box!.height).toBeCloseTo(4 / 3, 1);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator("#about").screenshot({ path: testInfo.outputPath(`hero-${theme}-${width}.png`) });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(video).toBeHidden();
    await expect(page.locator('#about img[alt="Ideas to Impact"]')).toHaveCSS("opacity", "1");
  });
}

for (const scenario of ["reduced motion", "unsupported", "blocked", "error", "no JavaScript"] as const) {
  test(`English hero retains image with ${scenario}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: scenario !== "no JavaScript",
      reducedMotion: scenario === "reduced motion" ? "reduce" : "no-preference" });
    const page = await context.newPage();
    let videoRequests = 0;
    page.on("request", (request) => { if (request.url().endsWith("tagline.en.webm")) videoRequests++; });
    if (scenario === "unsupported") await page.addInitScript(() => {
      HTMLMediaElement.prototype.canPlayType = () => "";
    });
    if (scenario === "blocked") await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Blocked", "NotAllowedError"));
    });
    if (scenario === "error") await page.route("**/tagline.en.webm", (route) => route.abort());
    await page.goto("/en/profile/2026/");
    if (scenario !== "no JavaScript") await expect(page.locator("html")).toHaveClass(/theme-/);
    if (scenario === "error") await expect.poll(() => videoRequests).toBeGreaterThan(0);
    const image = page.locator('#about img[alt="Ideas to Impact"]');
    await expect(image).toBeVisible();
    await expect(image).toHaveCSS("opacity", "1");
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator("#about video")).toBeHidden();
    if (["reduced motion", "unsupported", "no JavaScript"].includes(scenario)) expect(videoRequests).toBe(0);
    await context.close();
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`hero renders the light palette without JavaScript under a ${colorScheme} system scheme`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, colorScheme, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en/profile/2026/");
    await expect(page.locator("html")).not.toHaveClass(/theme-/);
    const tagline = page.locator('#about img[alt="Ideas to Impact"]');
    await expect(page.locator("#about > div").nth(1)).toHaveCSS("background-color", "rgb(246, 250, 255)");
    await expect(page.locator('#about img[src$="portrait.light.webp"]')).toBeVisible();
    await expect(page.locator('#about img[src$="portrait.dark.webp"]')).toBeHidden();
    await expect(page.locator('#about [class*="animatedTag"]')).toHaveCSS("mix-blend-mode", "multiply");
    await expect(tagline).toHaveCSS("filter", /invert\(1\)/);
    await context.close();
  });
}
