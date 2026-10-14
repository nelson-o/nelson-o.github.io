import type { Locale } from "@/lib/i18n";
import { sections } from "@/lib/i18n";
import { getPublishedEntriesForSection, type ContentEntry } from "@/lib/mdx/content";
import { tags, series, type TagId, type SeriesId } from "@/lib/taxonomy";

function published(locale: Locale, contentRoot?: string) {
  return sections.flatMap((section) => getPublishedEntriesForSection(locale, section, contentRoot));
}

function compare(a: string, b: string) { return a < b ? -1 : a > b ? 1 : 0; }

function readingOrder(a: ContentEntry, b: ContentEntry) {
  return compare(a.date, b.date) || compare(a.slug, b.slug) || compare(a.section, b.section);
}

function newestFirst(a: ContentEntry, b: ContentEntry) {
  return compare(b.date, a.date) || compare(a.slug, b.slug) || compare(a.section, b.section);
}

function sameEntry(a: ContentEntry, b: ContentEntry) {
  return a.locale === b.locale && a.section === b.section && a.slug === b.slug;
}

export function getTagCounts(locale: Locale, contentRoot?: string) {
  const counts = new Map<TagId, number>();
  for (const entry of published(locale, contentRoot)) {
    for (const id of entry.tags ?? []) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts].map(([id, count]) => ({ id, label: tags[id][locale], count }))
    .sort((a, b) => b.count - a.count || compare(a.id, b.id));
}

export function getEntriesByTag(locale: Locale, tag: TagId, contentRoot?: string) {
  return published(locale, contentRoot).filter((entry) => entry.tags?.includes(tag)).sort(newestFirst);
}

// Only series with published entries in this locale belong in archives/counts.
export function getSeries(locale: Locale, contentRoot?: string) {
  const groups = new Map<SeriesId, ContentEntry[]>();
  for (const entry of published(locale, contentRoot)) {
    if (!entry.series) continue;
    const entries = groups.get(entry.series) ?? [];
    entries.push(entry);
    groups.set(entry.series, entries);
  }
  return [...groups].map(([id, entries]) => ({
    id, label: series[id][locale], count: entries.length, entries: entries.sort(readingOrder),
  })).sort((a, b) => compare(a.id, b.id));
}

export function getRelatedEntries(entry: ContentEntry, limit = 3, contentRoot?: string) {
  if (!entry.published) return [];
  return published(entry.locale, contentRoot)
    .filter((candidate) => !sameEntry(candidate, entry))
    .map((candidate) => ({
      candidate, overlap: candidate.tags?.filter((tag) => entry.tags?.includes(tag)).length ?? 0,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || newestFirst(a.candidate, b.candidate))
    .slice(0, Math.max(0, limit)).map(({ candidate }) => candidate);
}

// Previous is earlier in reading order; next is later. Series crosses sections.
export function getAdjacentEntries(entry: ContentEntry, contentRoot?: string) {
  const entries = published(entry.locale, contentRoot)
    .filter((candidate) => entry.series ? candidate.series === entry.series : candidate.section === entry.section)
    .sort(readingOrder);
  const index = entry.published ? entries.findIndex((candidate) => sameEntry(candidate, entry)) : -1;
  return {
    previous: index > 0 ? entries[index - 1] : null,
    next: index >= 0 ? entries[index + 1] ?? null : null,
  };
}
