import { expect, test } from "@playwright/test";

const titles = { en: "On this page", "zh-tw": "本頁目錄", "zh-cn": "本页目录", ja: "このページの目次" };
for (const [locale, title] of Object.entries(titles)) for (const width of [390, 1280]) {
  test(`${locale} ${width}: article TOC supports native keyboard navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/ideas/agent-loops/?theme=${theme}`);
      const toc = page.locator("[data-article-toc]");
      const details = toc.locator("details");
      if (width < 1024) {
        await expect(details).not.toHaveAttribute("open", "");
        await details.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(details).toHaveAttribute("open", "");
      }
      const nav = page.getByRole("navigation", { name: title, exact: true });
      const links = nav.getByRole("link");
      const targets = page.locator("[data-article-prose] :is(h2,h3)[id]");
      expect(await links.count()).toBe(await targets.count());
      expect(await targets.count()).toBeGreaterThanOrEqual(3);
      const href = await links.first().getAttribute("href");
      await links.first().focus();
      await page.keyboard.press("Enter");
      const target = page.locator(`[id="${href!.slice(1)}"]`);
      await expect(target).toBeFocused();
      expect(await target.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe("solid");
      if (width >= 1024) {
        const prose = (await page.locator("[data-article-prose]").boundingBox())!;
        const aside = (await toc.boundingBox())!;
        expect(aside.width).toBe(300);
        expect(aside.x - prose.x - prose.width).toBeGreaterThanOrEqual(47);
        expect(await toc.evaluate((node) => getComputedStyle(node).position)).toBe("sticky");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("article TOC and heading links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("/en/ideas/agent-loops/");
  const details = page.locator("[data-article-toc] details");
  await details.locator("summary").click();
  const link = details.getByRole("link").last();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page.locator(`[id="${href!.slice(1)}"]`)).toBeFocused();
  await context.close();
});
