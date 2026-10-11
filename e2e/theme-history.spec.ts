import { expect, test } from "@playwright/test";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

for (const override of ["dark", "system"] as const) {
  test(`Back and Forward restore the ${override} URL theme after a settings change`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.addInitScript((key) => localStorage.setItem(key, "light"), THEME_STORAGE_KEY);
    await page.goto(`/en/profile/2026/?theme=${override}`);
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
    await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`theme=${override}#projects$`));
    await settingsButton(page).click();
    await page.getByRole("radio", { name: "Light", exact: true }).check({ force: true });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page).toHaveURL(/\/en\/profile\/2026\/#projects$/);

    for (let cycle = 0; cycle < 2; cycle++) {
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`theme=${override}$`));
      await expect(page.locator("html")).toHaveClass(/theme-dark/);
      await settingsButton(page).click();
      await expect(page.getByRole("radio", { name: override === "dark" ? "Dark" : "System", exact: true })).toBeChecked();
      await page.keyboard.press("Escape");

      if (override === "system") {
        await page.emulateMedia({ colorScheme: "light" });
        await expect(page.locator("html")).toHaveClass(/theme-light/);
        await page.emulateMedia({ colorScheme: "dark" });
        await expect(page.locator("html")).toHaveClass(/theme-dark/);
      }

      await page.goForward();
      await expect(page).toHaveURL(/\/en\/profile\/2026\/#projects$/);
      await expect(page.locator("html")).toHaveClass(/theme-light/);
      await settingsButton(page).click();
      await expect(page.getByRole("radio", { name: "Light", exact: true })).toBeChecked();
      await page.keyboard.press("Escape");
      expect(await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY)).toBe("light");
    }

    // Reverse a history traversal before interacting with Settings again.
    await page.goBack();
    await page.goForward();
    await expect(page.locator("html")).toHaveClass(/theme-light/);
    await expect(page).toHaveURL(/\/en\/profile\/2026\/#projects$/);
  });
}
