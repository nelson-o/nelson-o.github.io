"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import styles from "@/app/not-found.module.css";
import { defaultLocale, getHrefWithLocale, getLocaleHrefLang, locales, type Locale } from "@/lib/i18n";
import { profileLanguageNames } from "@/lib/profile-locales";
import { getNotFoundCopy, getNotFoundLocale } from "@/lib/i18n-not-found";

export function NotFoundContent() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  useEffect(() => {
    const resolved = getNotFoundLocale(window.location.pathname);
    setLocale(resolved);
    document.documentElement.lang = getLocaleHrefLang(resolved);
  }, []);
  const copy = getNotFoundCopy(locale);

  return (
    <section className={styles.panel} aria-labelledby="not-found-title" lang={getLocaleHrefLang(locale)}>
      <div className={styles.eyebrow}>404</div>
      <h1 id="not-found-title" className={styles.title}>
        {copy.title}
      </h1>
      <p className={styles.description}>
        {copy.description}
      </p>

      <div className={styles.actions}>
        <Link className={styles.primaryAction} href={getHrefWithLocale(locale, "/")}>
          {copy.home}
        </Link>
        <Link className={styles.secondaryAction} href={getHrefWithLocale(locale, "/systems")}>
          {copy.systems}
        </Link>
      </div>
      <nav className={styles.languages} aria-label={copy.languages}>
        <p>{copy.languages}</p>
        <ul>{locales.map((option) => <li key={option}>
          <a href={`${getHrefWithLocale(option, "/")}/`} lang={getLocaleHrefLang(option)} hrefLang={getLocaleHrefLang(option)}>
            {profileLanguageNames[option]}
          </a>
        </li>)}</ul>
      </nav>
    </section>
  );
}
