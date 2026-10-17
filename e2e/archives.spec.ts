import { test, expect } from "@playwright/test";
import { getArchive, getArchivePaths } from "../lib/archives";
import { getDictionary, locales } from "../lib/i18n";

for (const locale of locales) {
  test(`${locale} archives export, link to posts, and preserve ordering`, async ({ page }) => {
    for (const path of getArchivePaths(locale)) {
      const [, kind, id] = path.split("/");
      const archive = getArchive(locale, kind as "posts" | "topics" | "series", id)!;
      const response = await page.goto(`/${locale}${path}/`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(archive.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nelson-o.github.io/${locale}${path}/`);
      const main = page.getByRole("main");
      await expect(main.getByRole("navigation", { name: getDictionary(locale).archives.navigation })).toBeVisible();
      if (archive.entries.length) {
        const links = main.locator('section a');
        await expect(links).toHaveCount(archive.entries.length);
        for (let index = 0; index < archive.entries.length; index++) {
          const entry = archive.entries[index];
          await expect(links.nth(index)).toHaveAttribute("href", `/${locale}/${entry.section}/${entry.slug}/`);
        }
      }
      for (const group of archive.groups) {
        await expect(main.getByRole("link", { name: `${group.label} (${group.count})`, exact: true })).toHaveAttribute("href", `/${locale}/${kind}/${group.id}/`);
      }
    }
  });
}

test("unknown taxonomy and unsupported locales are not exported", async ({ page }) => {
  for (const path of ["/en/topics/unknown/", "/en/series/unknown/", "/en/topics/agents/extra/", "/de/posts/"]) {
    expect((await page.goto(path))?.status()).toBe(404);
  }
});

test("archive browsing works with JavaScript disabled at mobile width", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto("/en/posts/");
  await page.getByRole("navigation", { name: "Browse writing" }).getByRole("link", { name: "Topics" }).click();
  await page.getByRole("main").getByRole("link", { name: /^AI agents/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI agents");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
