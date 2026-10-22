import { describe, expect, it } from "vitest";
import { searchEntries, type SearchEntry } from "./site-search";
import { GET } from "../app/[locale]/search-index.json/route";
import { getLatestEntries } from "./mdx/content";
import { locales } from "./i18n";

const entry = (title: string, summary = "", tags: string[] = []): SearchEntry => ({ url: `/${title}/`, title, summary, tags });
describe("static metadata search", () => {
  it("ranks titles before tags and summaries, requiring all query terms", () => {
    const entries = [entry("Other", "agent review"), entry("Review", "", ["AI agents"]), entry("Agent review")];
    expect(searchEntries(entries, "AGENT review")).toEqual([entries[2], entries[1], entries[0]]);
    expect(searchEntries(entries, "agent missing")).toEqual([]);
    expect(searchEntries(entries, "  ")).toEqual([]);
  });
  it("matches literal CJK substrings and NFKC forms without regex interpretation", () => {
    const entries = [entry("持續型 Agent 工程循環", "程式碼審查"), entry("ＡＩエージェント", "コードレビュー")];
    expect(searchEntries(entries, "工程循環")).toEqual([entries[0]]);
    expect(searchEntries(entries, "程式碼 Agent")).toEqual([entries[0]]);
    expect(searchEntries(entries, "aiエージェント")).toEqual([entries[1]]);
    expect(searchEntries(entries, ".*")).toEqual([]);
  });
  for (const locale of locales) it(`${locale}: exports only published metadata and localized canonical destinations`, async () => {
    const response = await GET(new Request("https://example.test"), { params: Promise.resolve({ locale }) });
    const entries = await response.json() as SearchEntry[];
    const published = getLatestEntries(locale, Infinity);
    expect(entries).toHaveLength(published.length);
    expect(entries.map((entry) => entry.url)).toEqual(published.map((entry) => `/${locale}/${entry.section}/${entry.slug}/`));
    expect(entries.every((entry) => Object.keys(entry).sort().join() === "summary,tags,title,url")).toBe(true);
    expect(entries.some((entry) => entry.url.includes("261002-reviewing-agent-written-ui"))).toBe(false);
  });
});
