import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

export const sections = ["systems", "work", "ideas", "lab"] as const;

export type Section = (typeof sections)[number];

export type ContentEntry = {
  slug: string;
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
});

function getContentRoot(contentRoot?: string) {
  return contentRoot ?? join(process.cwd(), "content");
}

function readSectionFiles(section: Section, contentRoot?: string) {
  const directory = join(getContentRoot(contentRoot), section);

  return readdirSync(directory)
    .filter((entry) => entry.endsWith(".mdx"))
    .sort((left, right) => left.localeCompare(right))
    .map((filename) => join(directory, filename));
}

function parseEntryFromFile(filePath: string, section: Section): ContentEntry {
  const source = readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = frontmatterSchema.parse(data);
  const slug = basename(filePath).replace(/\.mdx$/, "");

  if (!slug) {
    throw new Error(`Unable to derive slug for ${filePath}`);
  }

  return {
    slug,
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

export function getAllEntriesForSection(section: Section, contentRoot?: string) {
  return sortNewestFirst(
    readSectionFiles(section, contentRoot).map((filePath) => parseEntryFromFile(filePath, section)),
  );
}

export function getPublishedEntriesForSection(section: Section, contentRoot?: string) {
  return getAllEntriesForSection(section, contentRoot).filter((entry) => entry.published);
}

export function getEntryBySlug(section: Section, slug: string, contentRoot?: string) {
  return getAllEntriesForSection(section, contentRoot).find((entry) => entry.slug === slug) ?? null;
}

export function getLatestEntries(limit = 4) {
  return sortNewestFirst(sections.flatMap((section) => getPublishedEntriesForSection(section))).slice(
    0,
    limit,
  );
}

export function getStaticSlugsForSection(section: Section, contentRoot?: string) {
  return getPublishedEntriesForSection(section, contentRoot).map((entry) => ({
    slug: entry.slug,
  }));
}
