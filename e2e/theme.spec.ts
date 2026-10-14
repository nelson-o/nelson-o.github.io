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
  { section: "digests", accent: "#7c3aed" },
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
    test(`settings panel opens and renders localized theme chips in ${path} @smoke`, async ({ page }) => {
      await page.goto(path);
      await waitForHydration(page);

      const button = page.getByRole("button", { name: labels.settingsButtonLabel, exact: true });
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
    await expect(cssVariable(page, "html", "--color-bg")).resolves.toBe("#fbfcfe");
    await expect(cssVariable(page, "html", "--color-text")).resolves.toBe("#0f172a");
    await expect(cssVariable(page, "html", "--color-accent")).resolves.toBe("#1f5fe0");
    await expect(cssVariable(page, "html", "--color-success")).resolves.toBe("#16a34a");
    await expect(cssVariable(page, "html", "--color-warning")).resolves.toBe("#d97706");
    await expect(cssVariable(page, "html", "--color-error")).resolves.toBe("#dc2626");

    await page.getByRole("radio", { name: EN.themeChips.dark }).check({ force: true });
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
    await expect(cssVariable(page, "html", "--color-bg")).resolves.toBe("#0b1220");
    await expect(cssVariable(page, "html", "--color-text")).resolves.toBe("#e6ebf5");
    await expect(cssVariable(page, "html", "--color-accent")).resolves.toBe("#5b9dff");
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
      await expect(page.locator(`#main-content > [data-section="${section}"]`)).toBeVisible();
      await expect(cssVariable(page, `#main-content > [data-section="${section}"]`, "--color-accent")).resolves.toBe(
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

    const latestCards = page.locator("a[data-section]");
    await expect(latestCards).not.toHaveCount(0);

    const accentsBySection = new Map<string, string>(
      sectionAccentTokens.map(({ section, accent }) => [section, accent]),
    );
    const accents = await latestCards.evaluateAll((cards) =>
      cards.map((card) => ({
        section: card.getAttribute("data-section"),
        accent: getComputedStyle(card).getPropertyValue("--color-accent").trim(),
      })),
    );

    for (const { section, accent } of accents) {
      expect(accent).toBe(accentsBySection.get(section ?? ""));
    }
  });

  test("supported locale options are enabled and unsupported placeholders stay disabled", async ({ page }) => {
    await page.goto("/en");
    await waitForHydration(page);
    await settingsButton(page).click();

    const languageSelect = page.locator("#language-select");

    await expect(languageSelect.locator('option[value="zh-cn"]')).toBeEnabled();
    await languageSelect.selectOption("zh-cn");
    await expect(page).toHaveURL(/\/zh-cn\/?$/);

    await settingsButton(page).click();
    await expect(languageSelect.locator('option[value="kr"]')).toBeDisabled();

    if (await languageSelect.locator('option[value="jp"]').count()) {
      await expect(languageSelect.locator('option[value="jp"]')).toBeDisabled();
    }
  });
});


for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) {
  for (const theme of ["light", "dark"]) {
    test(`${locale} ${theme}: site typography and isolated profile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}/?theme=${theme}`);
      await expect(page.locator("html")).toHaveClass(theme === "dark" ? /theme-dark/ : /theme-light/);
      const site = await page.locator("body").evaluate((element) => {
        const style = getComputedStyle(element);
        return { font: style.fontFamily, line: style.lineHeight, size: style.fontSize,
          accent: style.getPropertyValue("--color-accent").trim(), hero: style.getPropertyValue("--font-size-5xl").trim() };
      });
      expect(site.accent).toBe(theme === "light" ? "#1f5fe0" : "#5b9dff");
      expect(site.size).toBe("14px");
      expect(site.line).toBe(locale === "en" ? "22.4px" : "24.5px");
      expect(site.hero).toBe("30px");
      if (locale !== "en") expect(site.font).toContain(locale === "ja" ? "Hiragino Sans" : locale === "zh-tw" ? "PingFang TC" : "PingFang SC");
      await page.goto(`/${locale}/profile/?theme=${theme}`);
      const profile = page.locator("[class*='page_page']").first();
      await expect(profile).toHaveCSS("font-size", "14px");
      await expect(profile).toHaveCSS("line-height", "22.4px");
      await expect(profile).toHaveCSS("background-color", theme === "light" ? "rgb(255, 255, 255)" : "rgb(11, 17, 21)");
      await expect(page.locator("body")).toHaveCSS("line-height", "22.4px");
      await expect(cssVariable(page, "html", "--color-bg")).resolves.toBe(theme === "light" ? "#fafafa" : "#0f172a");
      expect(await profile.evaluate((element) => getComputedStyle(element).fontFamily)).not.toMatch(/PingFang|Hiragino/);
    });
  }
}
