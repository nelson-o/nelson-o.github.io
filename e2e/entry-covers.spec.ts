import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw"]) for (const width of [1280, 390]) {
  test(`${locale} ${width}: covers load and follow explicit themes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/ideas/260505-compute-power-to-productivity/?theme=${theme}`);
      const cover = page.locator("article [data-entry-cover] img:visible");
      await expect(cover).toHaveCount(1);
      await expect(cover).toHaveAttribute("src", new RegExp(`\\.${theme}-1200.webp$`));
      await expect.poll(() => cover.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(cover).toHaveAttribute("width", "1200");
    }
    await page.goto(`/${locale}/?theme=light`);
    const cardCover = page.locator("[data-entry-cover] img:visible").first();
    await expect(cardCover).toHaveAttribute("loading", "eager");
    await cardCover.scrollIntoViewIfNeeded();
    await expect.poll(() => cardCover.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.goto(`/${locale}/ideas/?theme=light`);
    const sectionCover = page.locator("[data-entry-cover] img:visible").first();
    await sectionCover.scrollIntoViewIfNeeded();
    await expect.poll(() => sectionCover.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const resolution = await sectionCover.evaluate((img) => ({ selected: Number((img as HTMLImageElement).currentSrc.match(/-(\d+)\.webp$/)?.[1]), display: img.getBoundingClientRect().width }));
    expect(resolution.selected).toBeGreaterThanOrEqual(Math.min(1200, resolution.display));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
