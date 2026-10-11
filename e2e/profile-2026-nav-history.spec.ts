import { expect, test } from "@playwright/test";

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`profile section selection follows repeated history traversal with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/en/profile/2026/");
    await expect(page.locator("header")).toHaveAttribute("data-sticky", "");
    const current = page.locator("header nav a[aria-current]");
    for (const id of ["experience", "projects", "contact"]) {
      await page.locator(`header a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(current).toHaveAttribute("href", `#${id}`);
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.goBack();
      await expect(page).toHaveURL(/#projects$/);
      await expect(current).toHaveAttribute("href", "#projects");
      await page.goBack();
      await expect(page).toHaveURL(/#experience$/);
      await expect(current).toHaveAttribute("href", "#experience");
      await page.goForward();
      await expect(current).toHaveAttribute("href", "#projects");
      await page.goForward();
      await expect(current).toHaveAttribute("href", "#contact");
    }
  });
}

test("modified section clicks do not select a section in the current tab", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  await expect(page.locator("header")).toHaveAttribute("data-sticky", "");
  const current = page.locator("header nav a[aria-current]");
  await page.locator('header a[href="#experience"]').click();
  await expect(current).toHaveAttribute("href", "#experience");
  const popupPromise = page.context().waitForEvent("page");
  await page.locator('header a[href="#contact"]').click({ modifiers: ["ControlOrMeta"] });
  const popup = await popupPromise;
  await popup.close();
  await expect(current).toHaveAttribute("href", "#experience");
  await expect(page).toHaveURL(/#experience$/);
});

test("manual scrolling releases a selection restored by history", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  await expect(page.locator("header")).toHaveAttribute("data-sticky", "");
  await page.locator('header a[href="#contact"]').click();
  await page.locator('header a[href="#projects"]').click();
  await page.goBack();
  const contact = page.locator('header a[href="#contact"]');
  await expect(contact).toHaveAttribute("aria-current", "location");
  await page.mouse.wheel(0, -10000);
  await expect(contact).not.toHaveAttribute("aria-current");
});
