import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) {
  for (const theme of ["light", "dark"]) {
    for (const width of [320, 1280]) {
      test(`${locale} ${theme} ${width}: optional site motion respects the preference`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        for (const preference of ["reduce", "no-preference"] as const) {
          await page.emulateMedia({ reducedMotion: preference });
          await page.goto(`/${locale}/?theme=${theme}`);
          await page.evaluate(() => document.fonts.ready);
          const skip = page.locator('a[href="#main-content"]');
          // Observe actual CSS transitions at native first-Tab focus, not just a declaration.
          await skip.evaluate((element) => {
            element.addEventListener("focus", () => {
              const animations = element.getAnimations().map((animation) => ({
                duration: animation.effect?.getTiming().duration,
              }));
              element.setAttribute("data-observed-animations", JSON.stringify(animations));
            }, { once: true });
          });
          await page.keyboard.press("Tab");
          await expect(skip).toBeFocused();
          const animations = JSON.parse((await skip.getAttribute("data-observed-animations"))!);
          if (preference === "reduce") expect(animations).toEqual([]);
          else expect(animations).toContainEqual({ duration: 100 });
          await expect(skip).toBeInViewport();
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL(/#main-content$/);
          const card = page.locator('a[class*="section-card_card"]').first();
          await page.keyboard.press("Tab");
          await expect(card).toBeFocused();
          await page.keyboard.press("Tab");
          await card.scrollIntoViewIfNeeded();
          await page.mouse.move(0, 0);
          await expect(card).toHaveCSS("transform", "none");
          const before = await card.boundingBox();
          await card.hover();
          await expect(card).toHaveCSS("transform", preference === "reduce" ? "none" : "matrix(1, 0, 0, 1, 0, -1)");
          const after = await card.boundingBox();
          expect(after!.y).toBeCloseTo(before!.y - (preference === "reduce" ? 0 : 1), 1);
          expect(after!.width).toBeCloseTo(before!.width, 1);
          await page.mouse.move(0, 0);
          await card.focus();
          await expect(card).toHaveCSS("transform", preference === "reduce" ? "none" : "matrix(1, 0, 0, 1, 0, -1)");
          await expect(card).not.toHaveCSS("outline-style", "none");
          await expect(card).not.toHaveCSS("outline-width", "0px");
          // A live preference change removes optional movement without losing focus.
          await page.emulateMedia({ reducedMotion: "reduce" });
          await expect(card).toHaveCSS("transform", "none");
          await expect(card).toBeFocused();
        }
      });
    }
  }
}
