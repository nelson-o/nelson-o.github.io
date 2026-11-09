export type SearchEntry = { url: string; title: string; summary: string; tags: string[]; text?: string };
const normalize = (value: string) => value.normalize("NFKC").toLowerCase();
const queryTerms = (query: string) => [...new Set(normalize(query).trim().split(/\s+/u).filter(Boolean))];
const metadata = (entry: SearchEntry) => normalize(`${entry.title} ${entry.summary} ${entry.tags.join(" ")}`);

// Literal substring matching supports unspaced CJK without a tokenizer or dictionary.
export function searchEntries(entries: SearchEntry[], query: string) {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  return entries.map((entry, order) => {
    const title = normalize(entry.title), tags = normalize(entry.tags.join(" "));
    const summary = normalize(entry.summary);
    const text = `${title} ${summary} ${tags} ${normalize(entry.text ?? "")}`;
    const score = terms.every((term) => text.includes(term))
      ? terms.reduce((sum, term) => sum + (title.includes(term) ? 4 : tags.includes(term) ? 2 : summary.includes(term) ? 1 : 0.5), 0) : 0;
    return { entry, score, order };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order).map(({ entry }) => entry);
}

// Metadata matches keep their summary. Body-dependent matches show bounded text
// around the earliest body-only term, never markup or injected HTML.
export function getSearchExcerpt(entry: SearchEntry, query: string) {
  const body = (entry.text ?? "").normalize("NFKC"), meta = metadata(entry);
  const offsets = queryTerms(query).filter((term) => !meta.includes(term))
    .map((term) => body.toLowerCase().indexOf(term)).filter((offset) => offset >= 0);
  if (!offsets.length) return entry.summary;
  const match = Math.min(...offsets), chars = Array.from(body);
  let foldedOffset = 0, character = 0;
  // Case folds can expand characters (e.g. İ); keep excerpt boundaries on
  // complete Unicode code points rather than slicing surrogate pairs.
  while (character < chars.length && foldedOffset < match) {
    foldedOffset += chars[character].toLowerCase().length;
    character++;
  }
  const start = Math.max(0, character - 60), end = Math.min(chars.length, start + 180);
  return `${start ? "…" : ""}${chars.slice(start, end).join("")}${end < chars.length ? "…" : ""}`;
}
