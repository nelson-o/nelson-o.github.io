import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import type { SearchEntry } from "../lib/site-search";

// Usage: bun scripts/measure-search.ts <export-dir> [matcher-source.ts]
const directory = resolve(process.argv[2] ?? "out");
const matcher = await import(pathToFileURL(resolve(process.argv[3] ?? "lib/site-search.ts")).href);
for (const locale of ["en", "zh-tw", "zh-cn", "ja"]) {
  const bytes = readFileSync(join(directory, locale, "search-index.json"));
  const entries = JSON.parse(bytes.toString()) as SearchEntry[];
  const queries = ["agent", "Kanban", "工程循環", "エージェント", "agent review", "zzzz-no-match"];
  for (let i = 0; i < 50; i++) matcher.searchEntries(entries, queries[i % queries.length]);
  const times: number[] = [];
  for (let i = 0; i < 600; i++) {
    const start = performance.now();
    matcher.searchEntries(entries, queries[i % queries.length]);
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const html = readFileSync(join(directory, locale, "index.html"), "utf8");
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"?]+\.js)"/g)].map((match) => match[1]))];
  const js = scripts.map((path) => readFileSync(join(directory, decodeURIComponent(path))));
  console.log(JSON.stringify({ locale, entries: entries.length, raw: bytes.length, gzip: gzipSync(bytes).length,
    medianMs: times[300], p95Ms: times[570], initialScripts: scripts.length,
    initialJsRaw: js.reduce((sum, file) => sum + file.length, 0), initialJsGzip: js.reduce((sum, file) => sum + gzipSync(file).length, 0) }));
}
