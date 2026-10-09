import { expect, test } from "@playwright/test";
import { settingsButton } from "./fixtures";

for (const route of ["/en/systems/", "/ja/profile/2026/"]) {
  for (const theme of ["light", "dark"]) {
    test(`${route} ${theme}: reduced-motion Settings stays still and usable`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${route}?theme=${theme}`);
      const button = settingsButton(page);
      await button.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      const radio = dialog.locator('input:checked');
      const chip = radio.locator("..");
      await expect(dialog).toBeVisible();
      await expect(radio).toBeFocused();
      await chip.hover();

      for (const locator of [button, button.locator("svg"), dialog, chip]) {
        await expect(locator).toHaveCSS("transition-duration", "0s");
        await expect(locator).toHaveCSS("transform", "none");
      }
      await page.keyboard.press("ArrowRight");
      await expect(dialog.locator('input:checked')).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("combobox")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(button).toBeFocused();
      await expect(dialog).not.toBeVisible();
    });
  }
}

test("Settings retains decorative motion without a reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/systems/");
  const button = settingsButton(page);
  await button.click();
  await expect(button).toHaveCSS("transition-duration", /0\.16s/);
  await expect(button).not.toHaveCSS("transform", "none");
  await expect(page.getByRole("dialog")).toHaveCSS("transition-duration", /0\.16s/);
});
