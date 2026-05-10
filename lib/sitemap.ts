import { defaultLocale, getMetadataBaseUrl, type Locale, locales, sections } from "@/lib/i18n";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

type SitemapIndexEntry = {
  url: string;
};

type SitemapUrlEntry = {
  url: string;
  lastModified?: string;
};

const base = getMetadataBaseUrl().toString().replace(/\/$/, "");

function absoluteUrl(path: `/${string}`) {
  return `${base}${path}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function withTrailingSlash(path: `/${string}`) {
  return path.endsWith("/") ? path : (`${path}/` as `/${string}`);
}

export function getSitemapIndexEntries(): SitemapIndexEntry[] {
  return locales.map((locale) => ({
    url: absoluteUrl(`/sitemaps/${locale}.xml`),
  }));
}

function getStaticPageEntries(locale: Locale): SitemapUrlEntry[] {
  const localizedPages: SitemapUrlEntry[] = [
    { url: absoluteUrl(`/${locale}/`) },
    { url: absoluteUrl(`/${locale}/profile/`) },
    { url: absoluteUrl(`/${locale}/footprint/`) },
    ...sections.map((section) => ({
      url: absoluteUrl(`/${locale}/${section}/`),
    })),
  ];

  if (locale !== defaultLocale) {
    return localizedPages;
  }

  return [{ url: absoluteUrl("/") }, ...localizedPages];
}

function getArticleEntries(locale: Locale): SitemapUrlEntry[] {
  return sections.flatMap((section) =>
    getPublishedEntriesForSection(locale, section).map((entry) => ({
      url: absoluteUrl(withTrailingSlash(`/${locale}/${section}/${entry.slug}`)),
      lastModified: entry.date,
    })),
  );
}

export function getLocaleSitemapEntries(locale: Locale): SitemapUrlEntry[] {
  return [...getStaticPageEntries(locale), ...getArticleEntries(locale)];
}

export function buildSitemapIndexXml(entries: SitemapIndexEntry[]) {
  const sitemapEntries = entries
    .map((entry) => `  <sitemap>\n    <loc>${escapeXml(entry.url)}</loc>\n  </sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</sitemapindex>\n`;
}

export function buildUrlSetXml(entries: SitemapUrlEntry[]) {
  const urlEntries = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`
        : "";

      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastModified}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}
