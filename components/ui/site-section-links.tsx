"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getHrefWithLocale, type Locale } from "@/lib/i18n";
import { getSiteFooterCopy } from "@/lib/i18n-site-footer";
import { getLandingTabsCopy } from "@/lib/i18n-landing-tabs";
import styles from "@/components/layout/site-shell.module.css";

export function SiteSectionLinks({ locale, navigationLabel }: { locale: Locale; navigationLabel: string }) {
  const pathname = usePathname()?.replace(/\/$/, "");
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const menu = disclosure.current;
    if (!menu) return;
    const dismissOutside = (event: PointerEvent | FocusEvent) => {
      // Keep a shortcut-opened modal's menu-link opener available for focus restoration.
      if (!menu.open || document.querySelector("dialog[open]")) return;
      if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const dismissOnDesktop = () => { if (desktop.matches) menu.open = false; };
    dismissOnDesktop();
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("focusin", dismissOutside);
    desktop.addEventListener("change", dismissOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("focusin", dismissOutside);
      desktop.removeEventListener("change", dismissOnDesktop);
    };
  }, []);
  const copy = getSiteFooterCopy(locale);
  const tabs = getLandingTabsCopy(locale);
  const items = [["/profile", copy.about], ["/systems", tabs.systems], ["/work", copy.projects], ["/posts", copy.posts], ["/ideas", copy.ideas]] as const;
  const links = items.map(([path, label]) => {
    const href = getHrefWithLocale(locale, path);
    const current = pathname === href ? "page" : pathname?.startsWith(`${href}/`) ? "location" : undefined;
    return <Link key={path} href={href} aria-current={current}>{label}</Link>;
  });
  const content = <>{links}<a href="#contact">{copy.contact}</a></>;
  return <>
    <nav className={`${styles.nav} ${styles.desktopNav}`} aria-label={navigationLabel}>{content}</nav>
    <details className={styles.mobileNav} ref={disclosure} onKeyDown={(event) => {
      if (event.key === "Escape" && disclosure.current?.open) {
        disclosure.current.open = false;
        disclosure.current.querySelector("summary")?.focus();
      }
    }}>
      <summary aria-label={navigationLabel}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </summary>
      <nav className={styles.nav} aria-label={navigationLabel} onClick={(event) => {
        if ((event.target as Element).closest("a") && disclosure.current) disclosure.current.open = false;
      }}>{content}</nav>
    </details>
  </>;
}
