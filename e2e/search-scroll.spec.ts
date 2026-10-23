import { chromium, expect, test, type Page } from "@playwright/test";
import { getSiteSearchCopy } from "../lib/i18n-site-search";

async function settleWheel(page: Page, x: number, y: number, delta = 700) {
  await page.mouse.move(x, y);
  await page.mouse.wheel(0, delta);
  // Wheel scrolls on the compositor after dispatch; observe its settled position.
  await page.waitForTimeout(250);
}

for (const locale of ["en", "zh-tw"] as const) for (const width of [390, 1280]) {
  test(`${locale} ${width}: search keeps reading position and releases scroll on close`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.goto(`/${locale}/ideas/agent-loops/`);
    const copy = getSiteSearchCopy(locale);
    const dialog = page.getByRole("dialog", { name: copy.title });
    await page.getByRole("button", { name: copy.title, exact: true }).click();
    await expect(dialog.getByRole("searchbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 900); });
    await page.evaluate(() => { document.documentElement.style.setProperty("--scroll-test", "preserved"); document.body.style.isolation = "isolate"; });
    const position = await page.evaluate(() => scrollY);
    const bodyWidth = await page.evaluate(() => document.body.getBoundingClientRect().width);
    const styles = await page.evaluate(() => [document.documentElement.getAttribute("style"), document.body.getAttribute("style")]);
    await page.keyboard.press("/");
    await dialog.getByRole("searchbox").fill(locale === "en" ? "agent" : "工程");
    expect(await page.evaluate(() => document.body.getBoundingClientRect().width)).toBe(bodyWidth);
    await expect(dialog.getByRole("listitem").first()).toBeVisible();
    await settleWheel(page, 2, 300);
    expect(await page.evaluate(() => scrollY)).toBe(position);
    const box = (await dialog.boundingBox())!;
    await settleWheel(page, box.x + box.width / 2, box.y + box.height / 2);
    expect(await dialog.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await dialog.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    await settleWheel(page, box.x + box.width / 2, box.y + box.height / 2);
    expect(await page.evaluate(() => scrollY)).toBe(position);
    await page.keyboard.press("Escape");
    // Chromium first clears a populated native search field on Escape.
    if (await dialog.isVisible()) await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(position);
    await page.keyboard.press("/");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: copy.close }).click();
    expect(await page.evaluate(() => [document.documentElement.getAttribute("style"), document.body.getAttribute("style")])).toEqual(styles);
    expect(await page.evaluate(() => document.body.getBoundingClientRect().width)).toBe(bodyWidth);
    await settleWheel(page, width / 2, 300);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(position);
  });
}

test("touch scrolling stays inside search and navigation releases the lock", async ({ browser, browserName, baseURL }) => {
  test.skip(browserName !== "chromium", "Uses Chromium touch input protocol");
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 600 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/en/");
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Search posts" });
  await dialog.getByRole("searchbox").fill("agent");
  await expect(dialog.getByRole("listitem").first()).toBeVisible();
  const session = await context.newCDPSession(page);
  async function swipe(x: number) {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: 450 }] });
    for (const y of [400, 350, 300, 250, 200]) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(300);
  }
  await swipe(2);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await swipe(195);
  expect(await dialog.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await dialog.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await swipe(195);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await dialog.getByRole("link").first().click();
  await expect(dialog).not.toBeVisible();
  await swipe(195);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await context.close();
});

test("loading and failure keep the lock; rapid close and reopen releases it", async ({ page }) => {
  await page.goto("/en/");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/en/search-index.json", async (route) => { await gate; await route.fulfill({ status: 503, body: "unavailable" }); });
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Search posts" });
  await expect(dialog.getByRole("searchbox")).toBeFocused();
  await settleWheel(page, 2, 300);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  release();
  await expect(dialog.getByRole("status")).toHaveText("Search could not load.");
  await settleWheel(page, 2, 300);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.keyboard.press("Escape");
  await page.keyboard.press("/");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await settleWheel(page, 400, 300);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

for (const width of [390, 1280]) test(`${width}: classic scrollbars retain page width`, async ({ baseURL, browserName }) => {
  test.skip(browserName !== "chromium", "Uses Chromium classic-scrollbar launch flags");
  const browser = await chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"], args: ["--disable-features=OverlayScrollbar"] });
  try {
    const page = await browser.newPage({ baseURL, viewport: { width, height: 600 } });
    await page.goto("/en/ideas/agent-loops/");
    await page.evaluate(() => document.fonts.ready);
    const bodyWidth = await page.evaluate(() => document.body.getBoundingClientRect().width);
    expect(bodyWidth).toBeLessThan(width);
    await page.locator("[data-search-field]").click();
    await expect(page.getByRole("searchbox")).toBeFocused();
    expect(await page.evaluate(() => document.body.getBoundingClientRect().width)).toBe(bodyWidth);
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.body.getBoundingClientRect().width)).toBe(bodyWidth);
  } finally { await browser.close(); }
});


test("queued close does not steal focus from the next control", async ({ page }) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.evaluate(() => new Promise<void>((resolve) => {
    const dialog = document.querySelector<HTMLDialogElement>("dialog[open]")!;
    dialog.addEventListener("close", () => resolve(), { once: true });
    dialog.querySelector<HTMLButtonElement>("header button")!.click();
    const editor = document.createElement("div");
    editor.contentEditable = "true"; editor.id = "next-editor";
    document.body.append(editor); editor.focus();
  }));
  await expect(page.locator("#next-editor")).toBeFocused();
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog", { name: "Search posts" })).not.toBeVisible();
});
