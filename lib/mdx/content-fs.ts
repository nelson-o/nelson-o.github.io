import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { ContentEntry } from "@/lib/mdx/content-frontmatter";
import type { Locale, Section } from "@/lib/i18n";
import { locales, sections } from "@/lib/i18n";

function getContentRoot(contentRoot?: string) {
  return contentRoot ?? join(process.cwd(), "content");
}

function readDirectories(root: string) {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory());
}

function readMdxFilesRecursively(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...readMdxFilesRecursively(path));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(path);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function hasLocalizedContentRoot(contentRoot?: string) {
  const root = getContentRoot(contentRoot);

  return readDirectories(root).some((entry) => locales.includes(entry.name as Locale));
}

export function assertSupportedLocaleDirectories(contentRoot?: string) {
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

export function getSectionDirectory(locale: Locale, section: Section, contentRoot?: string) {
  const root = getContentRoot(contentRoot);

  if (hasLocalizedContentRoot(contentRoot)) {
    return join(root, locale, section);
  }

  return join(root, section);
}

export function readSectionFiles(locale: Locale, section: Section, contentRoot?: string) {
  const directory = getSectionDirectory(locale, section, contentRoot);

  return readMdxFilesRecursively(directory);
}

export function assertLocalizedContentIntegrity(
  parseEntryFromFile: (
    filePath: string,
    locale: Locale,
    section: Section,
    contentRoot?: string,
  ) => ContentEntry,
  contentRoot?: string,
) {
  assertSupportedLocaleDirectories(contentRoot);
  const translations = new Map<string, { locale: Locale; taxonomy: string }>();

  for (const locale of locales) {
    for (const section of sections) {
      for (const filePath of readSectionFiles(locale, section, contentRoot)) {
        const entry = parseEntryFromFile(filePath, locale, section, contentRoot);
        const key = `${section}/${entry.slug}`;
        // Preserve tag order: the first tag can select fallback cover artwork.
        const taxonomy = JSON.stringify([entry.tags ?? [], entry.series ?? null]);
        const reference = translations.get(key);
        if (reference && reference.taxonomy !== taxonomy) {
          throw new Error(`Taxonomy mismatch for ${key}: ${reference.locale} and ${locale}`);
        }
        translations.set(key, { locale, taxonomy });
      }
    }
  }
}
