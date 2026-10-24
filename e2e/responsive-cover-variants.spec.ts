import { expect, test, type Locator } from "@playwright/test";

async function selectedWidth(image: Locator) {
  await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  return image.evaluate((node) => {
    const img = node as HTMLImageElement;
    return Number(img.currentSrc.match(/-(\d+)\.webp$/)?.[1]);
  });
}

for (const width of [390, 1280]) for (const deviceScaleFactor of [1, 2, 3]) {
  test.describe(`${width}px at DPR ${deviceScaleFactor}`, () => {
    test.use({ viewport: { width, height: 900 }, deviceScaleFactor });

    for (const theme of ["light", "dark"]) {
      test(`${theme}: thumbnails download smaller candidates while article heroes retain enough pixels`, async ({ page }) => {
        for (const route of ["/en/", "/en/ideas/"]) {
          await page.goto(`${route}?theme=${theme}`);
          const thumbnail = page.locator("[data-entry-row] [data-entry-cover] img:visible").first();
          expect(await selectedWidth(thumbnail)).toBe(deviceScaleFactor * 160);
          await expect(thumbnail).toHaveAttribute("alt", "");
          const display = await thumbnail.evaluate((img) => img.getBoundingClientRect().width);
          expect(display).toBe(width < 640 ? 112 : 160);
        }

        await page.goto(`/en/ideas/agent-loops/?theme=${theme}`);
        const hero = page.locator("[data-article-header] [data-entry-cover] img:visible");
        const selected = await selectedWidth(hero);
        const display = await hero.evaluate((img) => img.getBoundingClientRect().width);
        expect(selected).toBeGreaterThanOrEqual(Math.min(1200, display * deviceScaleFactor));
        if (width === 390 && deviceScaleFactor === 1) expect(selected).toBe(480);
        await expect(hero).toHaveAttribute("width", "1200");
        await expect(hero).toHaveAttribute("height", "742");
      });
    }
  });
}
