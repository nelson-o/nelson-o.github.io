import { expect, test } from "@playwright/test";

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`non-scroll keys preserve the chosen section with ${reducedMotion} motion`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.emulateMedia({ reducedMotion });
    await page.goto("/en/profile/2026/");
    await expect(page.locator("header")).toHaveAttribute("data-sticky", "");
    const projects = page.locator('header a[href="#projects"]');
    const current = page.locator("header nav a[aria-current]");
    for (let attempt = 0; attempt < 2; attempt++) {
      await projects.click();
      await expect.poll(() => page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2)).toBe(true);
      // Keep Tab within the visible sticky navigation, so focus itself does not scroll.
      await projects.evaluate((link) => link.focus({ preventScroll: true }));
      const top = await page.evaluate(() => scrollY);
      for (const key of ["Escape", "Shift", "Tab", "Shift+Tab", "a"]) {
        await page.keyboard.press(key);
        await expect(current).toHaveAttribute("href", "#projects");
        expect(await page.evaluate(() => scrollY)).toBe(top);
      }
      await page.keyboard.press("Home");
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await expect(current).not.toHaveAttribute("href", "#projects");
    }
    await page.locator('header a[href="#contact"]').click();
    await page.goBack();
    await expect(current).toHaveAttribute("href", "#projects");
    await page.keyboard.press("Escape");
    await expect(current).toHaveAttribute("href", "#projects");
  });
}

test("Settings keyboard controls do not release the chosen section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  await expect(page.locator("header")).toHaveAttribute("data-sticky", "");
  await page.locator('header a[href="#projects"]').click();
  const current = page.locator("header nav a[aria-current]");
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole("button", { name: "Settings", exact: true }).focus();
    await page.keyboard.press("Space");
    const radio = page.getByRole("radio").first();
    await radio.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await expect(current).toHaveAttribute("href", "#projects");
    await page.getByRole("combobox").focus();
    await page.keyboard.press("Home");
    await expect(current).toHaveAttribute("href", "#projects");
    await page.keyboard.press("Escape");
    await expect(current).toHaveAttribute("href", "#projects");
  }
});
