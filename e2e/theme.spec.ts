import { test, expect } from "@playwright/test";
import { waitForHydration, THEME_STORAGE_KEY, EN, ZHTW, settingsButton } from "./fixtures";

const locales = [
  { path: "/en", labels: EN },
  { path: "/zh-tw", labels: ZHTW },
] as const;

const sectionAccentTokens = [
  { section: "systems", accent: "#0891b2" },
  { section: "work", accent: "#2563eb" },
  { section: "ideas", accent: "#64748b" },
  { section: "lab", accent: "#7c3aed" },
] as const;

async function cssVariable(page: import("@playwright/test").Page, selector: string, name: string) {
  return page.locator(selector).evaluate(
    (element, propertyName) => getComputedStyle(element).getPropertyValue(propertyName).trim(),
    name,
  );
}

test.describe("Theme settings", () => {
  test("html has a theme class after hydration", async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);

    const cls = await page.locator("html").getAttribute("class");
    expect(cls).toMatch(/theme-light|theme-dark/);
  });

  for (const { path, labels } of locales) {
    test(`settings panel opens and renders localized theme chips in ${path}`, async ({ page }) => {
      await page.goto(path);
      await waitForHydration(page);

      const button = page.getByRole("button", { name: labels.settingsButtonLabel });
      await expect(button).toBeVisible();

      await button.click();

      await expect(page.getByText(labels.themeLabel, { exact: true })).toBeVisible();
      await expect(page.getByText(labels.languageLabel, { exact: true })).toBeVisible();
      await expect(page.getByRole("radio", { name: labels.themeChips.system })).toBeVisible();
      await expect(page.getByRole("radio", { name: labels.themeChips.dark })).toBeVisible();
      await expect(page.getByRole("radio", { name: labels.themeChips.light })).toBeVisible();
    });

    test(`theme chips apply classes and update storage in ${path}`, async ({ page }) => {
      await page.goto(path);
      await waitForHydration(page);
      await settingsButton(page).click();

      // The radio input is inside a <label><input/><span>...</span></label>;
      // force:true bypasses the span that intercepts pointer events.
      await page.getByRole("radio", { name: labels.themeChips.dark }).check({ force: true });
      await expect(page.locator("html")).toHaveClass(/theme-dark/);
      await expect
        .poll(() => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY))
        .toBe("dark");

      await page.getByRole("radio", { name: labels.themeChips.light }).check({ force: true });
      await expect(page.locator("html")).toHaveClass(/theme-light/);
      await expect
        .poll(() => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY))
        .toBe("light");
    });
  }

  test("light and dark themes expose the engineering design token palette", async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);
    await settingsButton(page).click();

    await page.getByRole("radio", { name: EN.themeChips.light }).check({ force: true });
    await expect(page.locator("html")).toHaveClass(/theme-light/);
    await expect(cssVariable(page, "html", "--color-bg")).resolves.toBe("#fafafa");
    await expect(cssVariable(page, "html", "--color-text")).resolves.toBe("#111827");
    await expect(cssVariable(page, "html", "--color-accent")).resolves.toBe("#0891b2");
    await expect(cssVariable(page, "html", "--color-success")).resolves.toBe("#16a34a");
    await expect(cssVariable(page, "html", "--color-warning")).resolves.toBe("#d97706");
    await expect(cssVariable(page, "html", "--color-error")).resolves.toBe("#dc2626");

    await page.getByRole("radio", { name: EN.themeChips.dark }).check({ force: true });
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
    await expect(cssVariable(page, "html", "--color-bg")).resolves.toBe("#0f172a");
    await expect(cssVariable(page, "html", "--color-text")).resolves.toBe("#e5e7eb");
    await expect(cssVariable(page, "html", "--color-accent")).resolves.toBe("#22d3ee");
  });

  for (const { section, accent } of sectionAccentTokens) {
    test(`${section} section page scopes the accent token`, async ({ page }) => {
      await page.addInitScript(
        ({ key }) => localStorage.setItem(key, "light"),
        { key: THEME_STORAGE_KEY },
      );

      await page.goto(`/en/${section}`);
      await waitForHydration(page);

      await expect(page.locator("html")).toHaveClass(/theme-light/);
      await expect(page.locator(`main[data-section="${section}"]`)).toBeVisible();
      await expect(cssVariable(page, `main[data-section="${section}"]`, "--color-accent")).resolves.toBe(
        accent,
      );
    });
  }

  test("latest entry cards carry section accent namespaces", async ({ page }) => {
    await page.addInitScript(
      ({ key }) => localStorage.setItem(key, "light"),
      { key: THEME_STORAGE_KEY },
    );

    await page.goto("/en");
    await waitForHydration(page);

    await expect(cssVariable(page, 'a[data-section="lab"]', "--color-accent")).resolves.toBe("#7c3aed");
    await expect(cssVariable(page, 'a[data-section="work"]', "--color-accent")).resolves.toBe("#2563eb");
  });

  test("future locale options remain disabled placeholders", async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);
    await settingsButton(page).click();

    for (const value of ["zh-cn", "jp", "kr"]) {
      await expect(page.locator("#language-select").locator(`option[value="${value}"]`)).toBeDisabled();
    }
  });
});
