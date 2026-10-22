export type SearchEntry = { url: string; title: string; summary: string; tags: string[] };
const normalize = (value: string) => value.normalize("NFKC").toLowerCase();

// Literal substring matching supports unspaced CJK without a tokenizer or dictionary.
export function searchEntries(entries: SearchEntry[], query: string) {
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean);
  if (!terms.length) return [];
  return entries.map((entry, order) => {
    const title = normalize(entry.title), tags = normalize(entry.tags.join(" "));
    const text = `${title} ${normalize(entry.summary)} ${tags}`;
    const score = terms.every((term) => text.includes(term))
      ? terms.reduce((sum, term) => sum + (title.includes(term) ? 4 : tags.includes(term) ? 2 : 1), 0) : 0;
    return { entry, score, order };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order).map(({ entry }) => entry);
}
