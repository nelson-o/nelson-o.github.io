import { describe, expect, it } from "vitest";
import { getSearchExcerpt, searchEntries, type SearchEntry } from "./site-search";
import { GET } from "../app/[locale]/search-index.json/route";
import { getLatestEntries } from "./mdx/content";
import { getSiteSearchCopy } from "./i18n-site-search";
import { locales } from "./i18n";

const entry = (title: string, summary = "", tags: string[] = []): SearchEntry => ({ url: `/${title}/`, title, summary, tags });
describe("static published-article search", () => {
  it("ranks titles before tags and summaries, requiring all query terms", () => {
    const entries = [entry("Other", "agent review"), entry("Review", "", ["AI agents"]), entry("Agent review")];
    expect(searchEntries(entries, "AGENT review")).toEqual([entries[2], entries[1], entries[0]]);
    expect(searchEntries(entries, "agent missing")).toEqual([]);
    expect(searchEntries(entries, "  ")).toEqual([]);
  });
  it.each([0, 1, 20, 21, 45])("retains all %i ranked matches for continuation", (count) => {
    const entries = Array.from({ length: count }, (_, i) => entry(`${i % 2 ? "Match " : ""}${i}`, "Match"));
    const results = searchEntries(entries, "match");
    expect(results).toEqual([...entries.filter((_, i) => i % 2), ...entries.filter((_, i) => !(i % 2))]);
    expect(new Set(results.map((item) => item.url)).size).toBe(count);
    for (const locale of locales) {
      expect(getSiteSearchCopy(locale).results(Math.min(20, count), count)).toContain(String(count));
      expect(getSiteSearchCopy(locale).more.length).toBeGreaterThan(0);
    }
  });
  it("matches literal CJK substrings and NFKC forms without regex interpretation", () => {
    const entries = [entry("持續型 Agent 工程循環", "程式碼審查"), entry("ＡＩエージェント", "コードレビュー")];
    expect(searchEntries(entries, "工程循環")).toEqual([entries[0]]);
    expect(searchEntries(entries, "程式碼 Agent")).toEqual([entries[0]]);
    expect(searchEntries(entries, "aiエージェント")).toEqual([entries[1]]);
    expect(searchEntries(entries, ".*")).toEqual([]);
  });
  for (const locale of locales) it(`${locale}: exports only published article text and localized canonical destinations`, async () => {
    const response = await GET(new Request("https://example.test"), { params: Promise.resolve({ locale }) });
    const entries = await response.json() as SearchEntry[];
    const published = getLatestEntries(locale, Infinity);
    expect(entries).toHaveLength(published.length);
    expect(entries.map((entry) => entry.url)).toEqual(published.map((entry) => `/${locale}/${entry.section}/${entry.slug}/`));
    expect(entries.every((entry) => Object.keys(entry).sort().join() === "summary,tags,text,title,url")).toBe(true);
    expect(entries.every((entry) => typeof entry.text === "string")).toBe(true);
    expect(entries.some((entry) => entry.url.includes("261002-reviewing-agent-written-ui"))).toBe(false);
    expect(entries.some((entry) => entry.url.includes("261108-node26-runtime-image"))).toBe(false);
  });

  it("ranks metadata above body-only matches and requires every term across fields", () => {
    const body = { ...entry("Other"), text: "agent review" };
    const summary = entry("Summary", "agent review");
    const title = entry("Agent review");
    expect(searchEntries([body, summary, title], "agent review")).toEqual([title, summary, body]);
    expect(searchEntries([{ ...entry("Agent"), text: "review" }], "agent review")).toHaveLength(1);
    expect(searchEntries([body], "agent absent")).toEqual([]);
    expect(searchEntries([entry("Missing")], "body")).toEqual([]);
  });

  it("finds normalized CJK/body text and makes bounded Unicode-safe excerpts", () => {
    const item = { ...entry("Title", "Fallback"), text: "😀".repeat(100) + "ＩＰＣ：工程循環 e\u0301clair İSTANBUL " + "後".repeat(200) };
    expect(searchEntries([item], "ipc 工程循環 éclair")).toEqual([item]);
    const excerpt = getSearchExcerpt(item, "istanbul");
    expect(excerpt).toBe("Fallback"); // Literal case folding is not accent removal.
    const match = getSearchExcerpt(item, "工程循環 éclair");
    expect(match).toContain("工程循環 éclair");
    expect(Array.from(match).length).toBeLessThanOrEqual(182);
    expect(match).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u);
    expect(getSearchExcerpt(item, "title")).toBe("Fallback");
    expect(getSearchExcerpt(entry("Missing", "Summary"), "missing")).toBe("Summary");
  });
});
