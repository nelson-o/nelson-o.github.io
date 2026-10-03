import { test, expect } from "@playwright/test";
import { locales, sections } from "../lib/i18n";

for (const locale of locales) {
  for (const path of ["", ...sections, "footprint", "ideas/agent-loops"]) {
    test(`${locale}/${path} exposes one main landmark and preserves skip navigation`, async ({ page }) => {
      await page.goto(`/${locale}/${path}${path ? "/" : ""}`);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
      await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveCount(1);
      await page.keyboard.press("Tab");
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#main-content$/);
    });
  }
}
