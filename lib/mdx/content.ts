import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import { locales, sections, type Locale, type Section } from "@/lib/i18n";

export type ContentEntry = {
  slug: string;
  locale: Locale;
  section: Section;
  title: string;
  date: string;
  summary: string;
  published: boolean;
  featured: boolean;
  content: string;
};

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.union([z.string().min(1), z.date()]).transform((value) => {
    if (typeof value === "string") {
      return value;
    }

    return value.toISOString().slice(0, 10);
  }),
  summary: z.string().min(1),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  translationKey: z.string().min(1).optional(),
});

function getContentRoot(contentRoot?: string) {
  return contentRoot ?? join(process.cwd(), "content");
}

function readDirectories(root: string) {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory());
}

function hasLocalizedContentRoot(contentRoot?: string) {
  const root = getContentRoot(contentRoot);

  return readDirectories(root).some((entry) => locales.includes(entry.name as Locale));
}

function assertSupportedLocaleDirectories(contentRoot?: string) {
  const root = getContentRoot(contentRoot);

  for (const directory of readDirectories(root)) {
    if (sections.includes(directory.name as Section)) {
      continue;
    }

    if (!locales.includes(directory.name as Locale)) {
      throw new Error(`Unsupported locale directory "${directory.name}" in ${root}`);
    }
  }
}

function getSectionDirectory(locale: Locale, section: Section, contentRoot?: string) {
  const root = getContentRoot(contentRoot);

  if (hasLocalizedContentRoot(contentRoot)) {
    return join(root, locale, section);
  }

  return join(root, section);
}

function readSectionFiles(locale: Locale, section: Section, contentRoot?: string) {
  const directory = getSectionDirectory(locale, section, contentRoot);

  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory)
    .filter((entry) => entry.endsWith(".mdx"))
    .sort((left, right) => left.localeCompare(right))
    .map((filename) => join(directory, filename));
}

function parseEntryFromFile(filePath: string, locale: Locale, section: Section): ContentEntry {
  const source = readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = frontmatterSchema.parse(data);
  const slug = basename(filePath).replace(/\.mdx$/, "");

  if (!slug) {
    throw new Error(`Unable to derive slug for ${filePath}`);
  }

  if (frontmatter.translationKey && frontmatter.translationKey !== slug) {
    throw new Error(`Slug mismatch for ${filePath}: translationKey must match "${slug}"`);
  }

  return {
    slug,
    locale,
    section,
    title: frontmatter.title,
    date: frontmatter.date,
    summary: frontmatter.summary,
    published: frontmatter.published,
    featured: frontmatter.featured,
    content,
  };
}

function sortNewestFirst(entries: ContentEntry[]) {
  return [...entries].sort((left, right) => right.date.localeCompare(left.date));
}

function assertLocalizedContentIntegrity(contentRoot?: string) {
  assertSupportedLocaleDirectories(contentRoot);

  for (const locale of locales) {
    for (const section of sections) {
      for (const filePath of readSectionFiles(locale, section, contentRoot)) {
        parseEntryFromFile(filePath, locale, section);
      }
    }
  }
}

export function getAllEntriesForSection(locale: Locale, section: Section, contentRoot?: string) {
  assertLocalizedContentIntegrity(contentRoot);

  return sortNewestFirst(
    readSectionFiles(locale, section, contentRoot).map((filePath) =>
      parseEntryFromFile(filePath, locale, section),
    ),
  );
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
  assertLocalizedContentIntegrity(contentRoot);

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
