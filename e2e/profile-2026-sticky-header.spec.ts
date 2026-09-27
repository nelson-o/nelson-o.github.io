import { expect, test, type Page } from "@playwright/test";
import { THEME_STORAGE_KEY } from "./fixtures";

// The 2026 header is sticky from 761px up once the nav script runs, and gains a
// full-bleed ground only when pinned. Phones and no-JS renders keep it static.
const header = (page: Page) => page.locator("header").first();
const jumpTo = (page: Page, selector: string) =>
  page.evaluate((s) => document.querySelector(s)!.scrollIntoView({ block: "start", behavior: "instant" }), selector);
const state = (page: Page) => header(page).evaluate((node) => ({
  top: Math.round(node.getBoundingClientRect().top),
  bottom: Math.round(node.getBoundingClientRect().bottom),
  pinned: node.hasAttribute("data-pinned"),
  background: getComputedStyle(node).backgroundColor,
  overflow: document.documentElement.scrollWidth > innerWidth,
}));

for (const theme of ["light", "dark"] as const) {
  for (const width of [1280, 768]) {
    test(`pins with a ground at ${width}px in ${theme}, and is transparent at the top`, async ({ page }) => {
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/en/profile/2026/");
      await expect(header(page)).toHaveAttribute("data-sticky", "");
      await expect.poll(() => state(page)).toMatchObject({ top: 0, pinned: false, background: "rgba(0, 0, 0, 0)", overflow: false });
      await jumpTo(page, "#projects");
      await expect.poll(() => state(page)).toMatchObject({ top: 0, pinned: true, overflow: false });
      expect((await state(page)).background).not.toBe("rgba(0, 0, 0, 0)");
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() => state(page)).toMatchObject({ pinned: false, background: "rgba(0, 0, 0, 0)" });
    });
  }
}

test("a section chosen from the nav stays current, even one near the page end, until the reader scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  const nav = page.getByRole("navigation");
  // At 1280x900 a jump to Projects reaches the page end, where Contact would otherwise be current.
  await nav.getByRole("link", { name: "Projects", exact: true }).click();
  await expect.poll(() => page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2)).toBe(true);
  await expect(page.locator("header nav a[aria-current]")).toHaveAttribute("href", "#projects");
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("header nav a[aria-current]")).toHaveAttribute("href", "#contact");
  // The reader's own scrolling hands the choice back to the reading position.
  await page.mouse.move(640, 500);
  await page.mouse.wheel(0, -1200);
  await expect(page.locator("header nav a[aria-current]")).not.toHaveAttribute("href", "#contact");
});

test("stays static on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/profile/2026/");
  await jumpTo(page, "#projects");
  await expect.poll(async () => (await state(page)).bottom).toBeLessThan(0);
  expect(await header(page).evaluate((node) => getComputedStyle(node).position)).not.toBe("sticky");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("keeps the static header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/profile/2026/");
    await jumpTo(page, "#projects").catch(() => {});
    await page.locator("#projects").scrollIntoViewIfNeeded();
    expect(await header(page).evaluate((node) => [node.hasAttribute("data-sticky"), getComputedStyle(node).position])).toEqual([false, "relative"]);
    expect((await header(page).boundingBox())!.y).toBeLessThan(0);
  });
});

test("pinning and unpinning shift no layout", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "layout-shift entries exist only in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  await page.evaluate(() => {
    (window as unknown as { shift: number }).shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) (window as unknown as { shift: number }).shift += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (const y of [10, 600, 0, 2000, 0]) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
  expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBeLessThan(0.01);
});
