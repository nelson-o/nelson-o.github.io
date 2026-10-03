import { expect, test } from "@playwright/test";
import { profileOnlyLocales } from "../lib/profile-locales";

const locations = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

test("sitemap index reaches every profile-only alias exactly once", async ({ request }) => {
  const index = await request.get("/sitemap.xml");
  expect(index.status()).toBe(200);
  const children = locations(await index.text());
  const allUrls: string[] = [];
  for (const child of children) {
    const response = await request.get(new URL(child).pathname);
    expect(response.status(), child).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    const urls = locations(await response.text());
    allUrls.push(...urls);
    const locale = profileOnlyLocales.find((item) => child.endsWith(`/${item}.xml`));
    if (locale) expect(urls).toEqual([`https://nelson-o.github.io/${locale}/profile/`]);
  }
  for (const locale of profileOnlyLocales) {
    expect(children).toContain(`https://nelson-o.github.io/sitemaps/${locale}.xml`);
    const url = `https://nelson-o.github.io/${locale}/profile/`;
    expect(allUrls.filter((entry) => entry === url)).toHaveLength(1);
    const page = await request.get(new URL(url).pathname);
    expect(page.status()).toBe(200);
    expect(await page.text()).toContain(`<link rel="canonical" href="${url}"`);
  }
});
