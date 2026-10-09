import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw", "zh-cn", "ja", "ko", "th", "vi", "de"]) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`section jumps continue keyboard navigation in ${locale} with ${reducedMotion} motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(`/${locale}/profile/2026/`);
      await expect(page.locator("header")).toHaveAttribute("data-sticky", "");

      for (const id of ["talks", "contact"]) {
        const link = page.locator(`header a[href="#${id}"]`);
        await link.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(link).toHaveAttribute("aria-current", "location");
        await page.keyboard.press("Tab");
        await expect(page.locator(`#${id}`).locator("summary, a").first()).toBeFocused();
      }
    });
  }
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("section links retain native keyboard navigation", async ({ page }) => {
    await page.goto("/en/profile/2026/");
    await page.locator('header a[href="#talks"]').focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(page.locator("#talks summary").first()).toBeFocused();
  });
});
