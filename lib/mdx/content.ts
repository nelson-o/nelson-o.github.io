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

const integrityAssertedRoots = new Set<string>();
const sectionCache = new Map<string, ContentEntry[]>();

function assertIntegrityOnce(contentRoot?: string) {
  const root = contentRoot ?? "";
  if (process.env.NODE_ENV === "development" || !integrityAssertedRoots.has(root)) {
    assertLocalizedContentIntegrity(parseEntryFromFile, contentRoot);
    if (process.env.NODE_ENV !== "development") integrityAssertedRoots.add(root);
  }
}

export function getAllEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  assertIntegrityOnce(contentRoot);

  const key = `${contentRoot ?? ""}:${locale}:${section}`;
  const cacheable = process.env.NODE_ENV !== "development";
  const cached = cacheable ? sectionCache.get(key) : undefined;
  if (cached) return cached;

  // MDX is read from disk, so development edits do not invalidate this module.
  const entries = sortNewestFirst(
    readSectionFiles(locale, section, contentRoot).map((filePath) =>
      parseEntryFromFile(filePath, locale, section, contentRoot),
    ),
  );
  if (cacheable) sectionCache.set(key, entries);
  return entries;
}

export function getPublishedEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  return getAllEntriesForSection(locale, section, contentRoot).filter((entry) => entry.published);
}

export function getDraftEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  return getAllEntriesForSection(locale, section, contentRoot).filter((entry) => !entry.published);
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
  const getEntries =
    process.env.NODE_ENV === "development"
      ? getAllEntriesForSection
      : getPublishedEntriesForSection;

  return locales.flatMap((locale) =>
    sections.flatMap((section) =>
      getEntries(locale, section, contentRoot).map((entry) => ({
        locale,
        section,
        slug: entry.slug,
      })),
    ),
  );
}

export function getStaticCatchAllArticleParams(contentRoot?: string) {
  return getStaticArticleParams(contentRoot).map(({ locale, section, slug }) => ({
    locale,
    section,
    slug: slug.split("/"),
  }));
}
