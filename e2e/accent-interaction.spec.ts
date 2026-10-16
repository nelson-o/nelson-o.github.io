import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw"]) {
  for (const theme of ["light", "dark"]) {
    for (const width of [1280, 390]) {
      test(`${locale} ${theme} ${width}: shell hover and keyboard focus`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/?theme=${theme}`);
        await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
        const strong = theme === "light" ? "rgb(23, 72, 170)" : "rgb(139, 186, 255)";
        const navLink = page.locator("header nav a").first();
        const resting = await navLink.evaluate((el) => getComputedStyle(el).color);
        await navLink.hover();
        await expect(navLink).toHaveCSS("color", strong);
        expect(resting).not.toBe(strong);
        await expect(navLink).toHaveCSS("text-decoration-line", "underline");
        await page.mouse.move(0, 0);
        await expect(navLink).toHaveCSS("color", resting);

        // Tab from the site title to the first navigation link, using real keyboard input.
        await page.locator("header > div > a").first().focus();
        await page.keyboard.press("Tab");
        await expect(navLink).toBeFocused();
        await expect(navLink).toHaveCSS("color", strong);
        await expect(navLink).toHaveCSS("outline-style", "solid");
        await expect(navLink).toHaveCSS("outline-width", "2px");
        await expect(navLink).toHaveCSS("outline-color", strong);
        await expect(navLink).toHaveCSS("text-decoration-line", "underline");

        const footerLink = page.locator("footer a").first();
        await footerLink.hover();
        await expect(footerLink).toHaveCSS("color", strong);
        await page.mouse.move(0, 0);
        await footerLink.focus();
        await expect(footerLink).toBeFocused();
        await expect(footerLink).toHaveCSS("color", strong);
        await expect(footerLink).toHaveCSS("outline-style", "solid");
        await expect(footerLink).toHaveCSS("outline-color", strong);
        await expect(footerLink).toHaveCSS("outline-width", "2px");
      });
    }
  }
}
