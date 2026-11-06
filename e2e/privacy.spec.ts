import { expect, test } from "@playwright/test";
import { commentsUnavailableCopy, privacyCopy } from "../lib/privacy/copy";

for (const locale of ["en", "zh-tw", "zh-cn", "ja", "ko", "th", "vi", "de"]) {
  test(`privacy notice is exported and localized in ${locale}`, async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(`/${locale}/privacy/`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main section")).toHaveCount(8);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(`a[aria-current="page"][href="/${locale}/privacy/"]`)).toBeVisible();
    expect(requests.filter((url) => new URL(url).origin !== new URL(page.url()).origin)).toEqual([]);
  });
}

test("unconfigured preview keeps optional services off and explains settings", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/en/systems/platform-surfaces/");
  await page.locator("[data-comment-consent]").scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Allow and load comments" })).toHaveCount(0);
  await page.getByRole("button", { name: "Privacy settings" }).click();
  await expect(page.getByRole("status")).toContainText("remain off");
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(requests.filter((url) => new URL(url).origin !== new URL(page.url()).origin)).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
});

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) for (const javaScriptEnabled of [true, false]) {
  test(`${locale}: unavailable comments are compact with JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 844 } });
    const external: string[] = [];
    await context.route("**/*", (route) => {
      if (new URL(route.request().url()).origin === new URL(baseURL!).origin) return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL}/${locale}/ideas/agent-loops/`);
      const panel = page.locator("[data-comment-consent]");
      await expect(panel).toContainText(commentsUnavailableCopy[locale]);
      await expect(panel.getByRole("button")).toHaveCount(0);
      await expect(panel.getByRole("link")).toHaveCount(1);
      const discussion = panel.getByRole("link", { name: privacyCopy[locale].discussion, exact: true });
      await expect(discussion).toHaveAttribute("href", "https://github.com/nelson-o/nelson-o.github.io/discussions");
      await discussion.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(discussion).toBeFocused();
      await expect(discussion).toHaveCSS("outline-style", "solid");
      await page.emulateMedia({ media: "print" });
      await expect(panel).toBeHidden();
      expect(external).toEqual([]);
    } finally { await context.close(); }
  });
}

test("legacy profile and icon-bearing article use local assets", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  await page.goto("/en/profile/2025/");
  await expect(page.locator('img[alt$=" avatar"]')).toHaveAttribute("src", "/profile/2026/legacy/avatar.jpg");
  await page.goto("/en/ideas/251203-edge-preview-environment-flow/");
  await expect(page.locator('link[href="/vendor/fontawesome/css/all.min.css"]')).toHaveCount(1);
  expect(external).toEqual([]);
});
