import { readFileSync } from "node:fs";
import { relative, sep } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { Locale, Section } from "@/lib/i18n";
import { isTagId, isSeriesId, type TagId, type SeriesId } from "@/lib/taxonomy";
import { isCoverPath } from "@/lib/mdx/content-cover";
import { getSectionDirectory } from "@/lib/mdx/content-fs";

export type ContentEntry = {
  slug: string;
  locale: Locale;
  section: Section;
  title: string;
  date: string;
  updated?: string;
  summary: string;
  tags?: TagId[];
  series?: SeriesId;
  cover?: string;
  authors?: ContentAuthor[];
  llm?: ContentLlmContext;
  published: boolean;
  featured: boolean;
  content: string;
};

export type ContentAuthor = {
  name: string;
  url?: string;
};

export type ContentLlmContext = {
  model: string;
  context: string;
  date?: string;
  interaction?: string;
};

const authorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
});

// Require quoted dates so YAML cannot silently normalize an invalid calendar day.
const updateDateSchema = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}, "updated must be a quoted ISO calendar date (YYYY-MM-DD)");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.union([z.string().min(1), z.date()]).transform((value) =>
    typeof value === "string" ? value : value.toISOString().slice(0, 10),
  ),
  updated: updateDateSchema.optional(),
  summary: z.string().min(1),
  tags: z.array(z.string().refine(isTagId, "Unknown tag id"))
    .min(1).max(3)
    .refine((ids) => new Set(ids).size === ids.length, "Duplicate tag ids")
    .optional(),
  series: z.string().refine(isSeriesId, "Unknown series id").optional(),
  cover: z.string().refine(isCoverPath, "Cover must be a safe root-relative or ./ path").optional(),
  authors: z.array(authorSchema).optional(),
  llm: z
    .object({
      model: z.string().min(1),
      context: z.string().min(1),
      date: z.union([z.string().min(1), z.date()]).transform((value) =>
        typeof value === "string" ? value : value.toISOString().slice(0, 10),
      ).optional(),
      interaction: z.string().min(1).optional(),
    })
    .optional(),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  translationKey: z.string().min(1).optional(),
}).refine((entry) => entry.updated === undefined ||
  Date.parse(entry.updated) >= Date.parse(entry.date), {
  message: "updated must be on or after a valid publication date",
  path: ["updated"],
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
    updated: frontmatter.updated,
    summary: frontmatter.summary,
    tags: frontmatter.tags,
    series: frontmatter.series,
    cover: frontmatter.cover,
    authors: frontmatter.authors,
    llm: frontmatter.llm,
    published: frontmatter.published,
    featured: frontmatter.featured,
    content,
  } satisfies ContentEntry;
}
