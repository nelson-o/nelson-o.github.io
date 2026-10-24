import { mkdir, realpath } from "node:fs/promises";
import { join, relative, isAbsolute } from "node:path";
import sharp from "sharp";
import { locales, sections } from "../lib/i18n";
import { tags } from "../lib/taxonomy";
import { getAllEntriesForSection, type ContentEntry } from "../lib/mdx/content";
import { resolveCoverSourcePath } from "../lib/mdx/content-cover";
import { getCoverKey } from "../lib/entry-cover";
import { coverWidths } from "../lib/cover-variants";

// Original geometric artwork: a stable seed controls the orbital pattern.
export function fallbackSvg(key: string, dark: boolean) {
  const seed = [...key].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 0) >>> 0;
  const bg = dark ? "#0b1220" : "#e8effc";
  const ink = dark ? "#5b9dff" : "#1f5fe0";
  const x = 300 + seed % 500;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="742" viewBox="0 0 1200 742"><rect width="1200" height="742" fill="${bg}"/><g fill="none" stroke="${ink}" stroke-width="3">${[130, 210, 290, 370, 450].map((r) => `<circle cx="${x}" cy="371" r="${r}" opacity=".35"/>`).join("")}<path d="M0 560 L1200 ${120 + seed % 160} M0 620 L1200 ${180 + seed % 160}"/></g><circle cx="${x}" cy="371" r="70" fill="${ink}"/></svg>`;
}
export async function writeCover(source: string | Buffer, prefix: string) {
  for (const width of coverWidths) {
    await sharp(source).rotate().resize(width, Math.round(width * 0.618), { fit: "cover" })
      .webp({ quality: 78, effort: 3 }).toFile(`${prefix}-${width}.webp`);
  }
}
export async function generateExplicitCover(entry: ContentEntry, destination: string, contentRoot = join(process.cwd(), "content"), publicRoot = join(process.cwd(), "public")) {
  const source = resolveCoverSourcePath(entry, contentRoot, publicRoot);
  if (!source) return;
  // Reject symlink escapes as well as lexical traversal before reading assets.
  const root = await realpath(entry.cover!.startsWith("./") ? contentRoot : publicRoot);
  const actual = await realpath(source);
  const within = relative(root, actual);
  if (within.startsWith("..") || isAbsolute(within)) throw new Error(`Cover escapes asset root: ${entry.cover}`);
  await writeCover(actual, join(destination, `${getCoverKey(entry)}.light`));
}
export async function generateEntryCovers() {
  const destination = join(process.cwd(), "public/covers");
  await mkdir(destination, { recursive: true });
  for (const key of [...Object.keys(tags), ...sections]) {
    for (const theme of ["light", "dark"]) {
      await writeCover(Buffer.from(fallbackSvg(key, theme === "dark")), join(destination, `fallback-${key}.${theme}`));
    }
  }
  for (const locale of locales) for (const section of sections) {
    for (const entry of getAllEntriesForSection(locale, section)) {
      await generateExplicitCover(entry, destination);
    }
  }
}
if (import.meta.main) await generateEntryCovers();
