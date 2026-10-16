import { createHash } from "node:crypto";
import type { ContentEntry } from "@/lib/mdx/content";

export const coverWidths = [640, 960, 1200] as const;
export function getCoverKey(entry: ContentEntry) {
  if (entry.cover) {
    return `post-${createHash("sha256").update(`${entry.locale}/${entry.section}/${entry.slug}`).digest("hex").slice(0, 24)}`;
  }
  return `fallback-${entry.tags?.[0] ?? entry.section}`;
}
export function getEntryCover(entry: ContentEntry) {
  const key = getCoverKey(entry);
  const light = `/covers/${key}.light`;
  return { light, dark: entry.cover ? light : `/covers/${key}.dark` };
}
export function coverSrcSet(prefix: string) {
  return coverWidths.map((width) => `${prefix}-${width}.webp ${width}w`).join(", ");
}
