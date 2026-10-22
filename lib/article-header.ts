import type { ContentEntry } from "@/lib/mdx/content";
import { getSeries } from "@/lib/mdx/content-taxonomy";

// An estimate of prose reading, not time spent studying code or diagrams:
// 200 alphabetic words/minute plus 400 Han/kana characters/minute.
export function estimateReadingMinutes(source: string) {
  let fence = "";
  const prose = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
    .split(/\r?\n/).filter((line) => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (marker && !fence) { fence = marker[1]; return false; }
      if (fence) {
        if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = "";
        return false;
      }
      return true;
    }).join(" ")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "");
  const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
  const characters = prose.match(cjk)?.length ?? 0;
  const words = prose.replace(cjk, " ").match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200 + characters / 400));
}

export function getArticleSeries(entry: ContentEntry, contentRoot?: string) {
  if (!entry.published || !entry.series) return null;
  const group = getSeries(entry.locale, contentRoot).find(({ id }) => id === entry.series);
  const index = group?.entries.findIndex(({ slug, section }) => slug === entry.slug && section === entry.section) ?? -1;
  return group && index >= 0 ? { id: group.id, label: group.label, part: index + 1, total: group.count } : null;
}
