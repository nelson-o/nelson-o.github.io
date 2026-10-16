import { getDictionary, getMetadataBaseUrl, sections, type Locale } from "@/lib/i18n";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

const absoluteUrl = (path: string) => new URL(path, getMetadataBaseUrl()).href;
const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[character]!);

export function getFeedEntries(locale: Locale, contentRoot?: string) {
  return sections.flatMap((section) => getPublishedEntriesForSection(locale, section, contentRoot))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function buildFeedXml(locale: Locale, contentRoot?: string) {
  const dictionary = getDictionary(locale);
  const items = getFeedEntries(locale, contentRoot).map((entry) => {
    const url = escapeXml(absoluteUrl(`/${locale}/${entry.section}/${entry.slug}/`));
    return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(entry.summary)}</description>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
${(entry.tags ?? []).map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(dictionary.site.title)}</title>
    <link>${escapeXml(absoluteUrl(`/${locale}/`))}</link>
    <description>${escapeXml(dictionary.site.description)}</description>
    <language>${locale === "zh-tw" ? "zh-TW" : locale === "zh-cn" ? "zh-CN" : locale}</language>
    <atom:link href="${escapeXml(absoluteUrl(`/${locale}/feed.xml`))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
