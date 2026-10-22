import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) for (const theme of ["light", "dark"]) {
  test(`${locale} ${theme}: printed articles preserve readable content without screen controls`, async ({ page }) => {
    await page.goto(`/${locale}/ideas/agent-loops/?theme=${theme}`);
    await expect(page.locator("[data-mermaid-chart] svg").first()).toBeVisible();
    const article = page.locator("article");
    const title = article.locator("h1");
    const screenColor = await title.evaluate((el) => getComputedStyle(el).color);
    await page.emulateMedia({ media: "print" });
    await expect(title).toBeVisible();
    await expect(article.locator("header p").first()).toBeVisible();
    for (const paragraph of await article.locator("header p").all()) await expect(paragraph).toBeVisible();
    await expect(article.locator("[data-entry-cover]").first()).toBeVisible();
    await expect(article.locator("[data-article-toc]")).toBeHidden();
    await expect(article.getByRole("button")).toHaveCount(0);
    await expect(article.locator(".mdx-heading-anchor:visible")).toHaveCount(0);
    const colors = await article.locator("h1, h2, h3, p, pre, th, td").evaluateAll((nodes) => nodes
      .filter((el) => el.getClientRects().length && !el.closest("[data-mermaid-chart]"))
      .map((el) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = getComputedStyle(el).color;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
      }));
    for (const rgb of colors) {
      const luminance = rgb.map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      expect(1.05 / (luminance + 0.05)).toBeGreaterThanOrEqual(4.5);
    }
    const code = article.locator("[data-article-prose] > pre").first();
    await code.evaluate((el) => { el.textContent = "long_unbroken_identifier_".repeat(20) + "PRINT_LINE_END"; });
    for (const width of [1280, 688]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await code.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect(await article.locator("[data-mermaid-chart] svg").first().evaluate((el) => {
        const bounds = el.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth && bounds.height <= 768;
      })).toBe(true);
    }
    await page.emulateMedia({ media: "screen" });
    expect(await title.evaluate((el) => getComputedStyle(el).color)).toBe(screenColor);
    await page.goto(`/${locale}/digests/260510-programbench-ai-software-engineering-limits/?theme=${theme}`);
    await page.emulateMedia({ media: "print" });
    const context = page.locator("article aside:has(dl)");
    await expect(context).toBeVisible();
    await expect(context).toHaveCSS("color", "rgb(55, 65, 81)");
    const background = await context.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
    });
    expect(Math.min(...background)).toBeGreaterThan(230);
  });
}
