import { expect, test } from "@playwright/test";
import { commands, consent, privacyFixture, production, testId } from "./privacy-fixture";

test.skip(process.env.E2E_PRIVACY_CONFIGURED !== "1", "Run with the dedicated dummy-config export; never contacts live providers.");

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
  await consent(page, true, false);
  await expect(load).toBeVisible();
  await expect(page.locator("giscus-widget")).toHaveCount(0);
});

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
  await expect(page.getByRole("button", { name: "Allow and load comments" })).toBeDisabled();
  expect(requests.some((url) => /googletagmanager|giscus\.app/.test(url))).toBe(false);
});
