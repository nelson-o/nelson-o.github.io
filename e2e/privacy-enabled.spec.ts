import { expect, test } from "@playwright/test";
import { commands, consent, cmpScript, privacyFixture, production, settlePrivacyRoutes, testId } from "./privacy-fixture";
import { commentsUnavailableCopy, privacyCopy } from "../lib/privacy/copy";

test.skip(process.env.E2E_PRIVACY_CONFIGURED !== "1", "Run with the dedicated dummy-config export; never contacts live providers.");
test.afterEach(async ({ page }) => {
  // Drain our finite proxy handlers without waiting on a removed iframe's network lifecycle.
  await settlePrivacyRoutes(page);
  await page.unrouteAll({ behavior: "wait" });
});

test("consent gates GA, deduplicates navigation and minimizes outbound data", async ({ page, baseURL }) => {
  const requests = await privacyFixture(page, baseURL!);
  await page.goto(`${production}/en/systems/platform-surfaces/?email=private#secret`);
  await expect(page.locator("#Cookiebot")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Allow and load comments" })).toBeEnabled();
  expect(requests.some((url) => url.includes("googletagmanager"))).toBe(false);
  await consent(page, false);
  expect(await commands(page)).toEqual([]);
  await consent(page, true);
  await expect.poll(async () => (await commands(page)).filter((c) => c[1] === "page_view").length).toBe(1);
  await consent(page, true);
  expect((await commands(page)).filter((c) => c[1] === "page_view")).toHaveLength(1);
  expect(requests.filter((url) => url.includes("googletagmanager"))).toHaveLength(1);
  expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
  expect(JSON.stringify(await commands(page))).not.toMatch(/email=|#secret|private/);
  await page.locator('[data-privacy-controls] a').click();
  await expect(page).toHaveURL(`${production}/en/privacy/`);
  await expect.poll(async () => (await commands(page)).filter((c) => c[1] === "page_view").length).toBe(2);
  expect(requests.filter((url) => url.includes("consent.cookiebot.com"))).toHaveLength(1);
  await page.goBack();
  await expect.poll(async () => (await commands(page)).filter((c) => c[1] === "page_view").length).toBe(3);
  await page.evaluate(() => {
    const a = document.createElement("a");
    a.href = "https://example.org/personal?secret=yes#token";
    a.addEventListener("click", (e) => e.preventDefault());
    document.body.append(a); a.click(); a.remove();
  });
  const outbound = (await commands(page)).find((c) => c[1] === "outbound_click");
  expect(outbound?.[2]).toMatchObject({ destination_host: "example.org" });
  expect(JSON.stringify(outbound)).not.toMatch(/personal|secret|token/);
});

test("comments require a click independently, and revocation removes them", async ({ page, baseURL }) => {
  const requests = await privacyFixture(page, baseURL!);
  await page.goto(`${production}/en/systems/platform-surfaces/`);
  const load = page.getByRole("button", { name: "Allow and load comments" });
  await expect(load).toBeEnabled();
  await consent(page, true, true);
  expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
  await load.click();
  await expect(page.locator("giscus-widget")).toHaveCount(1);
  await expect(page.getByRole("link", { name: privacyCopy.en.discussion, exact: true })).toBeVisible();
  await consent(page, true, false);
  await expect(load).toBeVisible();
  await expect(page.locator("giscus-widget")).toHaveCount(0);
});

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  test(`${locale}: consent startup stays neutral and ready comments still require a click`, async ({ page, baseURL }) => {
    let release!: () => void;
    const consentGate = new Promise<void>((resolve) => { release = resolve; });
    const requests = await privacyFixture(page, baseURL!, { consentGate });
    try {
      await page.goto(`${production}/${locale}/ideas/agent-loops/`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#Cookiebot")).toHaveCount(1);
      const panel = page.locator("[data-comment-consent]"), copy = privacyCopy[locale];
      const load = panel.getByRole("button", { name: copy.load, exact: true });
      await expect(load).toBeDisabled();
      await expect(panel).toContainText(copy.comments);
      await expect(panel).not.toContainText(commentsUnavailableCopy[locale]);
      expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
      release();
      await expect(load).toBeEnabled();
      await consent(page, false, true);
      expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
      await load.click();
      await expect(page.locator("giscus-widget")).toHaveCount(1);
      await page.locator("giscus-widget").scrollIntoViewIfNeeded();
      await expect.poll(() => requests.some((url) => url.includes("giscus.app"))).toBe(true);
      const beforeWithdrawal = requests.filter((url) => url.includes("giscus.app")).length;
      await consent(page, false, false);
      await expect(page.locator("giscus-widget")).toHaveCount(0);
      await expect(load).toBeEnabled();
      await expect(panel).toContainText(copy.comments);
      await expect(panel.getByRole("link", { name: copy.discussion, exact: true })).toBeVisible();
      expect(requests.filter((url) => url.includes("giscus.app"))).toHaveLength(beforeWithdrawal);
    } finally { release(); }
  });

  test(`${locale}: failed consent provider uses the fallback and can become ready`, async ({ page, baseURL }) => {
    const requests = await privacyFixture(page, baseURL!, { failed: true });
    await page.goto(`${production}/${locale}/ideas/agent-loops/`);
    const panel = page.locator("[data-comment-consent]"), copy = privacyCopy[locale];
    await expect(panel).toContainText(commentsUnavailableCopy[locale]);
    await expect(panel.getByRole("button")).toHaveCount(0);
    await expect(panel.getByRole("link", { name: copy.discussion, exact: true })).toBeVisible();
    expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
    await page.evaluate(cmpScript);
    await expect(panel.getByRole("button", { name: copy.load, exact: true })).toBeEnabled();
    await expect(panel).toContainText(copy.comments);
    await expect(panel).not.toContainText(commentsUnavailableCopy[locale]);
    expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
  });

  test(`${locale}: blocked comments retain an accessible discussion fallback`, async ({ page, baseURL }) => {
    const requests = await privacyFixture(page, baseURL!, { blockedComments: true });
    await page.goto(`${production}/${locale}/ideas/agent-loops/`);
    const copy = privacyCopy[locale];
    const load = page.getByRole("button", { name: copy.load, exact: true });
    const discussion = page.getByRole("link", { name: copy.discussion, exact: true });
    await expect(load).toBeEnabled();
    await expect(discussion).toHaveAttribute("href", "https://github.com/nelson-o/nelson-o.github.io/discussions");
    expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
    await consent(page, false, true);
    expect(requests.some((url) => url.includes("giscus.app"))).toBe(false);
    await load.click();
    await page.locator("giscus-widget").scrollIntoViewIfNeeded();
    await expect.poll(() => requests.some((url) => url.includes("giscus.app"))).toBe(true);
    await expect(discussion).toBeVisible();
    await expect(discussion).toHaveCount(1);
    for (let step = 0; step < 8 && !await discussion.evaluate((link) => link === document.activeElement); step++) {
      await page.keyboard.press("Tab");
    }
    await expect(discussion).toBeFocused();
    await expect(discussion).toHaveCSS("outline-style", "solid");
    await page.emulateMedia({ media: "print" });
    await expect(discussion).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await consent(page, false, false);
    await expect(page.locator("giscus-widget")).toHaveCount(0);
    await expect(load).toBeVisible();
    await expect(discussion).toBeVisible();
    await expect(discussion).toHaveCount(1);
  });
}

test("withdrawal disables GA, clears cookies and survives reload", async ({ page, baseURL }) => {
  await privacyFixture(page, baseURL!);
  await page.goto(`${production}/en/privacy/`);
  await expect.poll(() => page.evaluate(() => !!window.Cookiebot)).toBe(true);
  await consent(page, true);
  await page.context().addCookies([{ name: "_ga", value: "test", domain: "nelson-o.github.io", path: "/", secure: true }]);
  await consent(page, false);
  await page.waitForLoadState("networkidle");
  await expect.poll(async () => (await page.context().cookies()).some((c) => c.name === "_ga")).toBe(false);
  expect(await page.evaluate(() => window.dataLayer ?? [])).toEqual([]);
  expect(await page.evaluate((id) => (window as unknown as Record<string, unknown>)[`ga-disable-${id}`], testId)).toBe(true);
});

test("CMP failure and unavailable storage keep services off", async ({ page, baseURL }) => {
  const requests = await privacyFixture(page, baseURL!, { failed: true });
  await page.goto(`${production}/en/privacy/`);
  await page.getByRole("button", { name: "Privacy settings" }).click();
  await expect(page.getByRole("status")).toContainText("remain off");
  expect(requests.some((url) => url.includes("googletagmanager"))).toBe(false);
});

test("expired and old-version consent is not reused", async ({ page, baseURL }) => {
  await privacyFixture(page, baseURL!);
  await page.addInitScript(() => {
    sessionStorage.setItem("test-cmp", JSON.stringify({ preferences: true, statistics: true, marketing: false }));
    localStorage.setItem("nelson-consent-version", JSON.stringify({ version: "old", at: 0, statistics: true, preferences: true }));
  });
  await page.goto(`${production}/en/privacy/`);
  await expect(page.locator("html")).toHaveAttribute("data-consent-renewed", "true");
  expect(await commands(page)).toEqual([]);
  await page.waitForLoadState("networkidle");
});

test("storage failure does not grant consent", async ({ page, baseURL }) => {
  const requests = await privacyFixture(page, baseURL!);
  await page.addInitScript(() => {
    const get = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (key === "nelson-consent-version") throw new Error("Storage blocked");
      return get.call(this, key);
    };
  });
  await page.goto(`${production}/en/systems/platform-surfaces/`);
  await expect.poll(() => page.evaluate(() => !!window.Cookiebot)).toBe(true);
  await consent(page, true, true);
  await expect(page.getByRole("button", { name: "Allow and load comments" })).toHaveCount(0);
  await expect(page.locator("[data-comment-consent]")).toContainText(commentsUnavailableCopy.en);
  expect(requests.some((url) => /googletagmanager|giscus\.app/.test(url))).toBe(false);
});
