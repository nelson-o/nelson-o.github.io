import { expect, test } from "@playwright/test";
import { locales } from "../lib/i18n";
import { getFeedEntries } from "../lib/feed";

for (const locale of locales) {
  test(`${locale}: exported RSS is valid XML and discoverable`, async ({ page, request }) => {
    const response = await request.get(`/${locale}/feed.xml`);
    expect(response.status()).toBe(200);
    const xml = await response.text();
    const parsed = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, "application/xml");
      return {
        errors: document.querySelectorAll("parsererror").length,
        version: document.documentElement.getAttribute("version"),
        items: Array.from(document.querySelectorAll("item"), (item) => ({
          title: item.querySelector("title")?.textContent,
          summary: item.querySelector("description")?.textContent,
          url: item.querySelector("link")?.textContent,
          date: item.querySelector("pubDate")?.textContent,
          tags: Array.from(item.querySelectorAll("category"), (tag) => tag.textContent),
        })),
      };
    }, xml);
    expect(parsed.errors).toBe(0);
    expect(parsed.version).toBe("2.0");
    expect(parsed.items).toEqual(getFeedEntries(locale).map((entry) => ({
      title: entry.title, summary: entry.summary,
      url: `https://nelson-o.github.io/${locale}/${entry.section}/${entry.slug}/`,
      date: new Date(entry.date).toUTCString(), tags: entry.tags ?? [],
    })));
    await page.goto(`/${locale}/`);
    await expect(page.locator('head link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute("href", `/${locale}/feed.xml`);
  });
}

test("profile-only locales do not advertise an unavailable feed", async ({ page }) => {
  await page.goto("/ko/profile/");
  await expect(page.locator('link[type="application/rss+xml"]')).toHaveCount(0);
});
