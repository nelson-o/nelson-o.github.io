import type { Locale, Section } from "@/lib/i18n";
import { locales, sections } from "@/lib/i18n";

import type { ContentEntry } from "@/lib/mdx/content-frontmatter";
import { parseEntryFromFile } from "@/lib/mdx/content-frontmatter";
import {
  assertLocalizedContentIntegrity,
  readSectionFiles,
} from "@/lib/mdx/content-fs";

function sortNewestFirst(entries: ContentEntry[]) {
  return [...entries].sort((left, right) => right.date.localeCompare(left.date));
}

export type { ContentEntry } from "@/lib/mdx/content-frontmatter";

export function getAllEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  assertLocalizedContentIntegrity(parseEntryFromFile, contentRoot);

  return sortNewestFirst(readSectionFiles(locale, section, contentRoot).map((filePath) => parseEntryFromFile(filePath, locale, section)));
}

export function getPublishedEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  return getAllEntriesForSection(locale, section, contentRoot).filter((entry) => entry.published);
}

export function getEntryBySlug(
  locale: Locale,
  section: Section,
  slug: string,
  contentRoot?: string,
) {
  return getAllEntriesForSection(locale, section, contentRoot).find((entry) => entry.slug === slug) ?? null;
}

export function getLatestEntries(locale: Locale, limit = 4, contentRoot?: string) {
  return sortNewestFirst(
    sections.flatMap((section) => getPublishedEntriesForSection(locale, section, contentRoot)),
  ).slice(0, limit);
}

export function getStaticLocaleParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export function getStaticSlugsForSection(locale: Locale, section: Section, contentRoot?: string) {
  return getPublishedEntriesForSection(locale, section, contentRoot).map((entry) => ({
    slug: entry.slug,
  }));
}

export function getStaticArticleParams(contentRoot?: string) {
  assertLocalizedContentIntegrity(parseEntryFromFile, contentRoot);

  return locales.flatMap((locale) =>
    sections.flatMap((section) =>
      getPublishedEntriesForSection(locale, section, contentRoot).map((entry) => ({
        locale,
        section,
        slug: entry.slug,
      })),
    ),
  );
}
