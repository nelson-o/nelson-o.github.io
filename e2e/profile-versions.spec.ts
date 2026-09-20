import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n-types";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

for (const locale of locales) {
  test(`${locale} alias preserves the 2025 edition without redirecting @smoke`, async ({ page }) => {
    const response = await page.goto(`/${locale}/profile/`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`/${locale}/profile/$`));
    const alias = await page.locator("main").innerText();
    await page.goto(`/${locale}/profile/2025/`);
    await expect(page.locator("main")).toHaveText(alias, { useInnerText: true });
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nelson-o.github.io/${locale}/profile/`);
    await expect(page.locator("main")).toHaveCount(1);
  });

  test(`${locale} 2026 preview exports metadata, images and keyboard disclosures @smoke`, async ({ page }) => {
    const copy = profile2026Copy[locale];
    const response = await page.goto(`/${locale}/profile/2026/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByText(copy.preview, { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nelson-o.github.io/${locale}/profile/2026/`);
    await expect.poll(() => page.locator("#about img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const timeline = page.locator("#experience ol").first();
    await expect(timeline.locator(":scope > li")).toHaveCount(4);
    await expect(timeline.locator("h3")).toHaveText(["momoshop.tw", "SWAG.live", "foodpanda", "ViewSonic"]);
    const logos = timeline.locator("img");
    await expect(logos).toHaveCount(4);
    for (const logo of await logos.all()) await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logos.evaluateAll((images) => images.every((image) =>
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
    ))).toBe(true);
    await expect(timeline.locator('time[datetime="2022-03"]')).toHaveText("2022");
    const history = page.locator("#experience details");
    await history.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(history).toHaveAttribute("open", "");
    await expect(history.locator("li").first()).toBeVisible();
    const project = page.locator("#projects article details").first();
    await project.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(project.locator("ul")).toBeVisible();
    await page.reload();
    await expect(page.getByText(copy.preview, { exact: true })).toBeVisible();
  });

  for (const theme of ["light", "dark"] as const) {
    test(`${locale} ${theme} responsive profile review`, async ({ page }, testInfo) => {
      await page.addInitScript(({ key, theme }) => localStorage.setItem(key, theme), { key: THEME_STORAGE_KEY, theme });
      await page.goto(`/${locale}/profile/2026/`);
      await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
      for (const disclosure of await page.locator("main details > summary").all()) {
        await disclosure.click();
      }
      for (const width of [1280, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(page.locator("h1")).toBeVisible();
        const sizes = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
        expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
        await settingsButton(page).click();
        await expect(page.locator("#language-select")).toBeVisible();
        const panel = await page.locator("#language-select").boundingBox();
        expect(panel!.x).toBeGreaterThanOrEqual(0);
        expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
        await page.keyboard.press("Escape");
        await page.locator("#about").screenshot({ path: testInfo.outputPath(`${locale}-${theme}-${width}-hero.png`) });
        if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${locale}-${theme}-${width}.png`), fullPage: true });
      }
    });
  }
}

test("locale switching preserves explicit profile years in every direction", async ({ page }) => {
  await page.goto("/en/profile/2026/");
  for (const locale of ["zh-tw", "zh-cn", "ja", "en"]) {
    await settingsButton(page).click();
    await page.locator("#language-select").selectOption(locale);
    await expect(page).toHaveURL(new RegExp(`/${locale}/profile/2026/?$`));
    await expect(page.getByText(profile2026Copy[locale as keyof typeof profile2026Copy].preview, { exact: true })).toBeVisible();
  }
});

test("theme persists and system preference follows the OS", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await settingsButton(page).click();
  await page.locator('input[value="light"]').check({ force: true });
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  await settingsButton(page).click();
  await page.locator('input[value="system"]').check({ force: true });
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/theme-light/);
});

test("skip link and mobile navigation reach real sections", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/profile/2026/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  for (const name of ["About", "Experience", "Projects", "Talks", "Contact"]) {
    const link = page.getByRole("navigation").getByRole("link", { name, exact: true });
    await link.click();
    const target = await link.getAttribute("href");
    await expect(page.locator(target!)).toBeInViewport();
  }
});

test("unknown editions return 404 and previews stay out of sitemaps", async ({ request }) => {
  expect((await request.get("/en/profile/2024/")).status()).toBe(404);
  for (const locale of locales) {
    const sitemap = await (await request.get(`/sitemaps/${locale}.xml`)).text();
    expect(sitemap).toContain(`/${locale}/profile/`);
    expect(sitemap).not.toContain("/profile/2026");
  }
});
