import { readFileSync } from "node:fs";
import { relative, sep } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { Locale, Section } from "@/lib/i18n";
import { getSectionDirectory } from "@/lib/mdx/content-fs";

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
  date: z.union([z.string().min(1), z.date()]).transform((value) =>
    typeof value === "string" ? value : value.toISOString().slice(0, 10),
  ),
  summary: z.string().min(1),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  translationKey: z.string().min(1).optional(),
});

export function parseEntryFromFile(
  filePath: string,
  locale: Locale,
  section: Section,
  contentRoot?: string,
) {
  const source = readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = frontmatterSchema.parse(data);
  const slug = relative(getSectionDirectory(locale, section, contentRoot), filePath)
    .split(sep)
    .join("/")
    .replace(/\.mdx$/, "");

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
  } satisfies ContentEntry;
}
