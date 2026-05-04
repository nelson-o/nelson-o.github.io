import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { getMetadataBaseUrl } from "@/lib/i18n";
import { locales, sections } from "@/lib/i18n-types";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

const base = getMetadataBaseUrl().toString().replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) => [
    { url: `${base}/${locale}/`, lastModified: new Date() },
    { url: `${base}/${locale}/profile/`, lastModified: new Date() },
    { url: `${base}/${locale}/footprint/`, lastModified: new Date() },
    ...sections.map((section) => ({
      url: `${base}/${locale}/${section}/`,
      lastModified: new Date(),
    })),
  ]);

  const articlePages = locales.flatMap((locale) =>
    sections.flatMap((section) =>
      getPublishedEntriesForSection(locale, section).map((entry) => ({
        url: `${base}/${locale}/${section}/${entry.slug}/`,
        lastModified: new Date(entry.date),
      })),
    ),
  );

  return [...staticPages, ...articlePages];
}
