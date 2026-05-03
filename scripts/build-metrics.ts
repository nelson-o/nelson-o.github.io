import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { locales, sections } from "@/lib/i18n";
import {
  getPublishedEntriesForSection,
  getStaticCatchAllArticleParams,
} from "@/lib/mdx/content";

const outDir = join(process.cwd(), "out");

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function readFilesRecursively(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return readFilesRecursively(path);
    }

    return entry.isFile() ? [path] : [];
  });
}

const publishedEntriesBySection = locales.flatMap((locale) =>
  sections.map((section) => ({
    locale,
    section,
    count: getPublishedEntriesForSection(locale, section).length,
  })),
);

const publishedEntryCount = publishedEntriesBySection.reduce((total, item) => total + item.count, 0);
const articleParamCount = getStaticCatchAllArticleParams().length;
const outFiles = readFilesRecursively(outDir);
const exportedHtmlCount = outFiles.filter((filePath) => filePath.endsWith("/index.html")).length;
const outSize = outFiles.reduce((total, filePath) => total + statSync(filePath).size, 0);

console.log("Build metrics");
console.log(`Published MDX entries: ${publishedEntryCount}`);

for (const { locale, section, count } of publishedEntriesBySection) {
  console.log(`- ${locale}/${section}: ${count}`);
}

console.log(`Article static params: ${articleParamCount}`);
console.log(`Exported index.html files: ${exportedHtmlCount}`);
console.log(`Export size: ${formatBytes(outSize)}`);
