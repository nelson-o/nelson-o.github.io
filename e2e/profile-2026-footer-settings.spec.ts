import { expect, test } from "@playwright/test";
import { settingsButton, THEME_STORAGE_KEY } from "./fixtures";

// #84: the 2026 settings sit at the footer's right edge, in document flow,
// and their panel opens upward so it stays inside the page.
for (const theme of ["light", "dark"] as const) {
  test(`settings live in the footer and open upward in the ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    await page.goto("/en/profile/2026/");
    await expect(page.locator("header .theme-toggle")).toHaveCount(0);
    await expect(settingsButton(page)).toHaveCount(1);
    await expect(page.locator("footer .theme-toggle")).toHaveCount(1);

    for (const width of [1280, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 800 });
      const button = settingsButton(page);
      await button.scrollIntoViewIfNeeded();
      const layout = await page.evaluate(() => {
        const footer = document.querySelector("footer")!.getBoundingClientRect();
        const button = document.querySelector("footer .theme-toggle")!.getBoundingClientRect();
        return {
          inFlow: getComputedStyle(document.querySelector("footer .theme-toggle")!.parentElement!).position !== "fixed",
          insideFooter: button.top >= footer.top && button.bottom <= footer.bottom,
          rightEdge: Math.round(footer.right - button.right) <= 1,
        };
      });
      expect(layout, `${width}px`).toEqual({ inFlow: true, insideFooter: true, rightEdge: true });

      await button.click();
      const panel = page.locator("footer [data-placement='above'][data-open='true']");
      await expect(panel).toBeVisible();
      const fit = await panel.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const trigger = document.querySelector("footer .theme-toggle")!.getBoundingClientRect();
        return { above: box.bottom <= trigger.top, inside: box.left >= 0 && box.right <= innerWidth, scroll: document.documentElement.scrollWidth <= innerWidth };
      });
      expect(fit, `${width}px`).toEqual({ above: true, inside: true, scroll: true });

      // The checked theme takes focus; Escape closes and returns focus to the trigger.
      await expect(page.getByRole("radio", { name: theme === "light" ? "Light" : "Dark", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator("footer [data-open='true']")).toHaveCount(0);
      await expect(button).toBeFocused();
    }
  });
}

test("the footer settings switch theme and language by keyboard", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "light"), THEME_STORAGE_KEY);
  await page.goto("/en/profile/2026/");
  const button = settingsButton(page);
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("radio", { name: "Light", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await page.getByLabel("Language").selectOption("de");
  await expect(page).toHaveURL(/\/de\/profile\/2026\/?$/);
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
});
