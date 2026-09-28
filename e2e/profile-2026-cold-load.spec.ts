import { expect, test, type Page } from "@playwright/test";
import { THEME_STORAGE_KEY } from "./fixtures";

// #129: a cold load of the 2026 profile fetches one portrait and defers decorative artwork.
function track(page: Page) {
  const urls: string[] = [];
  page.on("request", (request) => urls.push(request.url()));
  return urls;
}
const fetched = (urls: string[], part: string) => urls.some((url) => url.includes(part));
const artwork = ["approach/mountains.", "projects/waves.", "projects/developer-tools.", "projects/signals."];

for (const theme of ["light", "dark"] as const) {
  test(`a ${theme} load fetches only the ${theme} portrait and no Google Fonts`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    const urls = track(page);
    await page.goto("/en/profile/2026/");
    await expect.poll(() => page.locator("#about img[src*='portrait']").evaluateAll((images) =>
      images.some((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(fetched(urls, `portrait.${theme}.webp`)).toBe(true);
    expect(fetched(urls, `portrait.${theme === "light" ? "dark" : "light"}.webp`)).toBe(false);
    expect(fetched(urls, "fonts.googleapis.com")).toBe(false);
  });
}

// #132: a stored or ?theme= preference opposite to the system theme still fetches only its own portrait.
for (const { name, stored, query } of [
  { name: "a stored dark preference", stored: "dark", query: "" },
  { name: "?theme=dark", stored: null, query: "?theme=dark" },
]) {
  test(`${name} on a light system fetches only the dark portrait, preloaded`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    if (stored) await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: stored });
    const requests: { url: string; type: string }[] = [];
    page.on("request", (request) => requests.push({ url: request.url(), type: request.resourceType() }));
    await page.goto(`/en/profile/2026/${query}`);
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
    await expect.poll(() => page.locator("#about img[src*='portrait.dark']").evaluate((image) =>
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    expect(requests.some(({ url }) => url.includes("portrait.light.webp"))).toBe(false);
    expect(await page.locator('head link[rel="preload"][href*="portrait.dark.webp"]').count()).toBe(1);
  });
}

test("section artwork loads only once its section nears the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const urls = track(page);
  await page.goto("/en/profile/2026/");
  await page.waitForLoadState("networkidle");
  for (const part of artwork) expect(fetched(urls, part), part).toBe(false);
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toHaveAttribute("data-deferred-art", "ready");
  await expect.poll(() => fetched(urls, "projects/waves.")).toBe(true);
  await expect.poll(() => fetched(urls, "approach/mountains.")).toBe(true);
});

test("without JavaScript the artwork and light portrait still load", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "light" });
  const page = await context.newPage();
  const urls = track(page);
  await page.goto("/en/profile/2026/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect.poll(() => fetched(urls, "portrait.light.webp")).toBe(true);
  await expect.poll(() => artwork.every((part) => fetched(urls, part))).toBe(true);
  await context.close();
});

test("site pages and the 2025 profile still load Unica One", async ({ page }) => {
  for (const path of ["/en/", "/en/profile/2025/"]) {
    await page.goto(path);
    await expect(page.locator('head link[rel="stylesheet"][href="/fonts/unica-one/font.css"]')).toHaveCount(1);
  }
});
