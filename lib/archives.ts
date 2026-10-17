import type { Metadata } from "next";
import { getAlternates, getDictionary, locales, sections, type Locale } from "@/lib/i18n";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";
import { getEntriesByTag, getSeries, getTagCounts } from "@/lib/mdx/content-taxonomy";
import { isTagId, tags } from "@/lib/taxonomy";

export type ArchiveKind = "posts" | "topics" | "series";
export const archiveKinds: ArchiveKind[] = ["posts", "topics", "series"];

export function getArchivePaths(locale: Locale, contentRoot?: string) {
  return [
    ...archiveKinds.map((kind) => `/${kind}`),
    ...getTagCounts(locale, contentRoot).map(({ id }) => `/topics/${id}`),
    ...getSeries(locale, contentRoot).map(({ id }) => `/series/${id}`),
  ] as `/${string}`[];
}

export function getArchive(locale: Locale, kind: ArchiveKind, id?: string, contentRoot?: string) {
  const copy = getDictionary(locale).archives;
  const groups = kind === "series" ? getSeries(locale, contentRoot) : getTagCounts(locale, contentRoot);
  if (id) {
    if (kind === "topics" && isTagId(id)) {
      const entries = getEntriesByTag(locale, id, contentRoot);
      return entries.length ? { title: tags[id][locale], description: copy.newest, entries, groups: [] } : null;
    }
    if (kind === "series") {
      const group = getSeries(locale, contentRoot).find((group) => group.id === id);
      return group ? { title: group.label, description: copy.readingOrder, entries: group.entries, groups: [] } : null;
    }
    return null;
  }
  const entries = kind === "posts" ? sections.flatMap((section) =>
    getPublishedEntriesForSection(locale, section, contentRoot))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug) || a.section.localeCompare(b.section)) : [];
  return {
    title: copy[kind],
    description: kind === "posts" ? copy.newest : kind === "topics" ? copy.browseTopics : copy.browseSeries,
    entries,
    groups: kind === "posts" ? [] : groups,
  };
}

export function getArchiveMetadata(locale: Locale, kind: ArchiveKind, id?: string): Metadata {
  const archive = getArchive(locale, kind, id);
  if (!archive) return {};
  const path = `/${kind}${id ? `/${id}` : ""}` as `/${string}`;
  const available = locales.filter((locale) => getArchivePaths(locale).includes(path));
  const alternates = getAlternates(locale, path, available);
  // A locale-specific taxonomy must never advertise a missing default route.
  if (!available.includes("en")) delete alternates.languages["x-default"];
  return {
    title: `${archive.title} | ${getDictionary(locale).site.title}`,
    description: archive.description,
    alternates,
  };
}
