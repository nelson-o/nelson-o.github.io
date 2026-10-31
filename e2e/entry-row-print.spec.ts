import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) {
  for (const theme of ["light", "dark"]) {
    for (const route of ["", "systems/", "posts/", "topics/agents/", "series/agentic-delivery/"]) {
      test(`${locale}/${route} ${theme}: print includes complete entry summaries`, async ({ page }) => {
        await page.setViewportSize({ width: 794, height: 1123 });
        await page.goto(`/${locale}/${route}?theme=${theme}`);
        await page.evaluate(() => document.fonts.ready);
        const rows = page.locator("[data-entry-row]");
        const summaries = rows.locator("p");
        const count = await rows.count();
        expect(count).toBeGreaterThan(0);
        const texts = await summaries.allTextContents();
        await expect(summaries.first()).toHaveCSS("white-space", "nowrap");
        await expect(summaries.first()).toHaveCSS("text-overflow", "ellipsis");

        await page.emulateMedia({ media: "print" });
        await expect(summaries).toHaveText(texts);
        for (let index = 0; index < count; index++) {
          const summary = summaries.nth(index);
          await expect(summary).toBeVisible();
          await expect(summary).toHaveCSS("white-space", "normal");
          await expect(summary).toHaveCSS("overflow", "visible");
          await expect(rows.nth(index)).toHaveCSS("break-inside", "avoid");
          const bounds = await summary.evaluate((element) => ({
            scrollWidth: element.scrollWidth, width: element.clientWidth,
            scrollHeight: element.scrollHeight, height: element.clientHeight,
          }));
          expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
          expect(bounds.scrollHeight).toBeLessThanOrEqual(bounds.height + 1);
        }
        expect(await summaries.evaluateAll((elements) => elements.some((element) =>
          element.clientHeight > parseFloat(getComputedStyle(element).lineHeight) * 1.5))).toBe(true);
        await page.emulateMedia({ media: "screen" });
        await expect(summaries.first()).toHaveCSS("white-space", "nowrap");
        await expect(summaries.first()).toHaveCSS("text-overflow", "ellipsis");
        await expect(rows.first()).toHaveCSS("break-inside", "auto");
      });
    }
  }
}

test("article printing still omits related entry rows", async ({ page }) => {
  await page.goto("/en/ideas/agent-loops/?theme=dark");
  const rows = page.locator("[data-entry-row]");
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(rows.first()).toBeVisible();
  await page.emulateMedia({ media: "print" });
  for (const row of await rows.all()) await expect(row).toBeHidden();
  await expect(page.locator("article h1")).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await expect(rows.first()).toBeVisible();
});
