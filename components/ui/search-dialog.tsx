"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getSiteSearchCopy } from "@/lib/i18n-site-search";
import { searchEntries, type SearchEntry } from "@/lib/site-search";
import styles from "@/components/ui/site-search.module.css";

export function SearchDialog({ locale }: { locale: Locale }) {
  const copy = getSiteSearchCopy(locale), input = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null), [failed, setFailed] = useState(false);
  const [query, setQuery] = useState(""), [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    input.current?.focus();
    fetch(`/${locale}/search-index.json`, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error("Search index unavailable");
      return response.json() as Promise<SearchEntry[]>;
    }).then(setEntries).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [locale, retry]);
  const results = useMemo(() => searchEntries(entries ?? [], query), [entries, query]);
  const message = failed ? copy.error : !entries ? copy.loading : !query.trim() ? copy.hint : results.length ? copy.results(results.length) : copy.empty;
  return <>
    <label className={styles.label} htmlFor="site-search-input">{copy.prompt}</label>
    <input ref={input} id="site-search-input" type="search" maxLength={200} value={query} autoComplete="off" onChange={(event) => setQuery(event.target.value)} />
    <p role="status" aria-live="polite" aria-atomic="true">{message}</p>
    {failed && <button type="button" onClick={() => { setFailed(false); setRetry((n) => n + 1); }}>{copy.retry}</button>}
    <ul className={styles.results}>{results.slice(0, 20).map((entry) => <li key={entry.url}>
      <a href={entry.url}>{entry.title}</a><p>{entry.summary}</p>
    </li>)}</ul>
    {results.length > 20 && <p>{copy.more}</p>}
  </>;
}
