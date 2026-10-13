import { expect, test } from "@playwright/test";
import { languageStorageKey } from "../lib/profile-language";
import { themeStorageKey } from "../lib/theme";

for (const savedLanguage of [null, "ja"] as const) {
  for (const theme of ["light", "dark", "system", "sepia"]) {
    test(`root preserves ${theme} theme with ${savedLanguage ? "saved" : "browser"} language`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.addInitScript(({ languageKey, themeKey, savedLanguage }) => {
        Object.defineProperty(navigator, "languages", { get: () => ["zh-TW"] });
        if (!sessionStorage.getItem("root-theme-seeded")) {
          localStorage.setItem(themeKey, "light");
          if (savedLanguage) localStorage.setItem(languageKey, savedLanguage);
          sessionStorage.setItem("root-theme-seeded", "1");
        }
      }, { languageKey: languageStorageKey, themeKey: themeStorageKey, savedLanguage });
      await page.goto(`/?theme=${theme}&unrelated=discard`);
      const suffix = theme === "sepia" ? "" : `?theme=${theme}`;
      await expect(page).toHaveURL(new RegExp(`/${savedLanguage ?? "zh-tw"}/${suffix.replace("?", "\\?")}$`));
      await expect(page.locator("html")).toHaveClass(theme === "dark" || theme === "system" ? /theme-dark/ : /theme-light/);
      expect(await page.evaluate((key) => localStorage.getItem(key), themeStorageKey)).toBe("light");
    });
  }
}

test("root preserves a valid theme when storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "languages", { get: () => ["en-US"] });
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("denied", "SecurityError"); } });
  });
  await page.goto("/?theme=dark");
  await expect(page).toHaveURL(/\/en\/\?theme=dark$/);
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
});
