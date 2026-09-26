import { expect, test } from "@playwright/test";
import { settingsButton } from "./fixtures";

// languageStorageKey from lib/profile-language.ts
const LANGUAGE_STORAGE_KEY = "nelson-language";

// #84: ?lang= → locale path → saved language → browser → English.
test.use({ locale: "en-US" });

test("a valid ?lang= becomes the static profile path, keeping other parameters and the hash", async ({ page }) => {
  await page.goto("/en/profile/2026/?lang=ja&theme=dark#projects");
  await expect(page).toHaveURL(/\/ja\/profile\/2026\/\?theme=dark#projects$/);
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await expect(page.locator("[lang='ja']").first()).toBeAttached();
});

test("a ?lang= matching the path is consumed without a reload, and invalid values are ignored", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) requests.push(request.url()); });
  await page.goto("/de/profile/2026/?lang=de&utm=x");
  await expect(page).toHaveURL(/\/de\/profile\/2026\/\?utm=x$/);
  await page.goto("/en/profile/2026/?lang=fr");
  await expect(page).toHaveURL(/\/en\/profile\/2026\/\?lang=fr$/);
  // One document request per visit: neither case navigated again.
  expect(requests).toHaveLength(2);
});

test("a saved or browser language never overrides an explicit profile path", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "ja"), LANGUAGE_STORAGE_KEY);
  await page.goto("/de/profile/2026/");
  await expect(page).toHaveURL(/\/de\/profile\/2026\/$/);
});

test("a language chosen in the profile settings is saved and used by the root redirect", async ({ page }) => {
  await page.goto("/en/profile/2026/");
  expect(await page.evaluate((key) => localStorage.getItem(key), LANGUAGE_STORAGE_KEY)).toBeNull();
  await settingsButton(page).click();
  await page.getByLabel("Language").selectOption("zh-cn");
  await expect(page).toHaveURL(/\/zh-cn\/profile\/2026\/?$/);
  expect(await page.evaluate((key) => localStorage.getItem(key), LANGUAGE_STORAGE_KEY)).toBe("zh-cn");
  await page.goto("/");
  await expect(page).toHaveURL(/\/zh-cn\/$/);
});

test("the root redirect ignores a saved profile-only language and falls back to the browser", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "ko"), LANGUAGE_STORAGE_KEY);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
});
