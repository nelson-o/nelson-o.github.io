import { expect, test } from "@playwright/test";
import { THEME_STORAGE_KEY, settingsButton } from "./fixtures";

for (const theme of ["light", "dark"] as const) {
  test(`experience remains readable and history expands in ${theme} theme`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) {
      await page.goto(`/${locale}/profile/2026/`);
      const section = page.locator("#experience");
      const timeline = section.locator("ol").first();
      await expect(timeline.locator(":scope > li")).toHaveCount(4);
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await section.scrollIntoViewIfNeeded();
        expect(await section.evaluate((node) => [node, ...node.querySelectorAll("h2, h3, p, blockquote, dt")]
          .every((item) => item.scrollWidth <= item.clientWidth))).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const history = await section.locator("summary").boundingBox();
        // Heading text must end before the history control, even in translated layouts.
        expect(await section.locator("h2").evaluate((node) => {
          const range = document.createRange();
          range.selectNodeContents(node.firstChild!);
          return range.getBoundingClientRect().right;
        })).toBeLessThanOrEqual(history!.x);
        if (width === 1440 && locale === "en") {
          // Measure whitespace between entries independently of platform font metrics.
          const gaps = await timeline.evaluate((node) => {
            const rows = [...node.children];
            return rows.slice(0, -1).map((row, index) => {
              const contentBottom = Math.max(...[...row.children].map((child) => child.getBoundingClientRect().bottom));
              return rows[index + 1].getBoundingClientRect().top - contentBottom;
            });
          });
          for (const gap of gaps) {
            expect(gap).toBeGreaterThanOrEqual(12);
            expect(gap).toBeLessThanOrEqual(24);
          }
          expect(await section.locator("dt").evaluateAll((labels) => labels.every((label) =>
            label.getBoundingClientRect().height <= parseFloat(getComputedStyle(label).lineHeight) + 1,
          ))).toBe(true);
        }
      }
      const history = section.locator("details");
      await history.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(history).toHaveAttribute("open", "");
      await expect(history.locator("li").first()).toBeVisible();
      await page.keyboard.press("Enter");
      await expect(history).not.toHaveAttribute("open");
    }
  });
}

test("employer marks switch treatments with the live theme", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "light"), THEME_STORAGE_KEY);
  await page.goto("/en/profile/2026/");
  const section = page.locator("#experience");
  await section.locator("summary").click();
  for (const theme of ["light", "dark", "light"] as const) {
    await settingsButton(page).click();
    await page.locator("label").filter({ has: page.locator(`input[name="theme-preference"][value="${theme}"]`) }).click();
    await settingsButton(page).click();
    for (const company of ["Ampos HRM", "Lilee Systems", "Owlstand"]) {
      const rows = section.locator("li").filter({ has: page.getByRole("heading", { name: company, exact: true }) });
      for (const row of await rows.all()) {
        const tile = row.locator('[aria-hidden="true"]');
        await expect(tile).toHaveCSS("background-color", theme === "dark" ? "rgb(40, 43, 47)" : "rgba(0, 0, 0, 0)");
        await expect(tile.locator("img:visible")).toHaveCount(1);
        const logo = tile.locator("img:visible");
        expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        if (company === "Owlstand") {
          await expect(logo).toHaveCSS("filter", theme === "dark" ? "brightness(0) invert(1)" : "none");
        } else {
          await expect(logo).toHaveAttribute("src", new RegExp(theme === "dark" ? "\\.dark\\.svg$" : "(?<!\\.dark)\\.svg$"));
        }
      }
    }
  }
});
