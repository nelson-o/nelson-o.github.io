import { dirname, join } from "node:path";
import type { ContentEntry } from "@/lib/mdx/content-frontmatter";
import { getSectionDirectory } from "@/lib/mdx/content-fs";

// Covers are local source assets, not remote URLs. Reject ambiguous URL/path
// syntax and traversal rather than normalizing it into another directory.
export function isCoverPath(value: string) {
  const relative = value.startsWith("./");
  if (!relative && !value.startsWith("/")) return false;
  const path = value.slice(relative ? 2 : 1);
  return !/[\\\\%?#\u0000-\u0020\u007f:]/.test(path)
    && path.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");
}

// Used by the build-time image pipeline (#144). ./ paths are relative to the
// MDX file (including nested slugs); / paths are relative to public/.
// This resolves source paths only: it does not copy assets or emit browser URLs.
export function resolveCoverSourcePath(
  entry: ContentEntry,
  contentRoot?: string,
  publicRoot = join(process.cwd(), "public"),
) {
  if (!entry.cover) return null;
  if (!isCoverPath(entry.cover)) throw new Error(`Invalid cover path: ${entry.cover}`);
  return entry.cover.startsWith("./")
    ? join(getSectionDirectory(entry.locale, entry.section, contentRoot), dirname(entry.slug), entry.cover.slice(2))
    : join(publicRoot, entry.cover.slice(1));
}
