"use client";
import React, { useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getSiteSearchCopy } from "@/lib/i18n-site-search";
import styles from "@/components/ui/site-search.module.css";

type DialogContent = ComponentType<{ locale: Locale }>;
export function SiteSearch({ locale }: { locale: Locale }) {
  const copy = getSiteSearchCopy(locale), pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false), [retry, setRetry] = useState(0);
  const [Content, setContent] = useState<DialogContent | null>(null), [failed, setFailed] = useState(false);
  const field = new RegExp(`^/${locale}/?(systems|work|ideas|digests)?/?$`).test(pathname ?? "");
  function show() {
    if (dialog.current?.open) return;
    opener.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    setOpen(true);
  }
  function hide() {
    setOpen(false); setFailed(false);
    dialog.current?.close(); opener.current?.focus();
  }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.defaultPrevented || event.isComposing || event.altKey || target.closest("input, textarea, select, [contenteditable], [role=textbox]") || document.querySelector("dialog[open]")) return;
      if ((event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !event.metaKey && !event.ctrlKey)) {
        event.preventDefault(); show();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    if (!open || Content) return;
    let cancelled = false;
    import("@/components/ui/search-dialog").then((module) => {
      if (!cancelled) setContent(() => module.SearchDialog);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [open, Content, retry]);
  return <>
    <button type="button" className={styles.trigger} data-search-field={field} aria-label={copy.title} aria-haspopup="dialog" onClick={show}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
      {field && <span>{copy.prompt}</span>}
    </button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="site-search-title" onCancel={(event) => { event.preventDefault(); hide(); }} onClose={() => { if (!dialog.current?.open) { setOpen(false); setFailed(false); opener.current?.focus(); } }}>
      <header><h2 id="site-search-title">{copy.title}</h2><button type="button" aria-label={copy.close} onClick={hide}>×</button></header>
      {open && (Content ? <Content locale={locale} /> : <div role="status">{failed ? copy.error : copy.loading}{failed && <button type="button" onClick={() => { setFailed(false); setRetry((n) => n + 1); }}>{copy.retry}</button>}</div>)}
    </dialog>
  </>;
}
