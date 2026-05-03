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
  if (!integrityAssertedRoots.has(root)) {
    assertLocalizedContentIntegrity(parseEntryFromFile, contentRoot);
    integrityAssertedRoots.add(root);
  }
}

export function getAllEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  assertIntegrityOnce(contentRoot);

  const key = `${contentRoot ?? ""}:${locale}:${section}`;
  if (!sectionCache.has(key)) {
    sectionCache.set(
      key,
      sortNewestFirst(
        readSectionFiles(locale, section, contentRoot).map((filePath) =>
          parseEntryFromFile(filePath, locale, section, contentRoot),
        ),
      ),
    );
  }
  return sectionCache.get(key)!;
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

export function getStaticCatchAllArticleParams(contentRoot?: string) {
  const seen = new Set<string>();

  return getStaticArticleParams(contentRoot).flatMap(({ locale, section, slug }) => {
    const segments = slug.split("/");
    const params: { locale: Locale; section: Section; slug: string[] }[] = [];

    for (let index = 1; index <= segments.length; index += 1) {
      const slugSegments = segments.slice(0, index);
      const key = `${locale}:${section}:${slugSegments.join("/")}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      params.push({ locale, section, slug: slugSegments });
    }

    return params;
  });
}
