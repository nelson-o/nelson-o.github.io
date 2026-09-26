import { expect, test, type Page } from "@playwright/test";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

// #84: a valid ?theme= wins while it is in the URL, is never saved, and an
// explicit settings change saves the choice and removes the conflicting query.
const stored = (page: Page) => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY);

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem(key, "light");
      sessionStorage.setItem("seeded", "1");
    }
  }, THEME_STORAGE_KEY);
});

test("a URL theme beats the saved one for as long as it is in the URL", async ({ page }) => {
  await page.goto("/en/profile/2026/?theme=dark#experience");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  expect(await stored(page)).toBe("light");

  await page.goto("/en/profile/2026/");
  await expect(page.locator("html")).toHaveClass(/theme-light/);
});

test("the override works site-wide and an invalid value falls back to the saved theme", async ({ page }) => {
  await page.goto("/en/?theme=dark");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await page.goto("/en/profile/2026/?theme=sepia");
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en/profile/2026/?theme=system");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  expect(await stored(page)).toBe("light");
});

test("choosing a theme in settings saves it and removes the conflicting query", async ({ page }) => {
  await page.goto("/en/profile/2026/?theme=dark&utm=x#projects");
  await settingsButton(page).click();
  await expect(page.getByRole("radio", { name: "Dark", exact: true })).toBeChecked();
  await page.getByRole("radio", { name: "Light", exact: true }).check({ force: true });
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  expect(await stored(page)).toBe("light");
  await expect(page).toHaveURL(/\/en\/profile\/2026\/\?utm=x#projects$/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/theme-light/);
});

test("switching language keeps the URL theme", async ({ page }) => {
  await page.goto("/en/profile/2026/?theme=dark");
  await settingsButton(page).click();
  await page.getByLabel("Language").selectOption("ja");
  await expect(page).toHaveURL(/\/ja\/profile\/2026\/?\?theme=dark$/);
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  expect(await stored(page)).toBe("light");
});

test("the override and settings still work when storage is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("denied", "SecurityError"); } });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en/profile/2026/?theme=dark");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await settingsButton(page).click();
  await page.getByRole("radio", { name: "Light", exact: true }).check({ force: true });
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  await expect(page).toHaveURL(/\/en\/profile\/2026\/$/);
  expect(errors).toEqual([]);
});
