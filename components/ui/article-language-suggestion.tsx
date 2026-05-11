"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import styles from "@/components/layout/article-page.module.css";
import {
  getSuggestedArticleLocale,
  languageSuggestionStorageKey,
} from "@/lib/article-locale-suggestion";
import { getDictionary, getHrefWithLocale, type Dictionary, type Locale, type Section } from "@/lib/i18n";

type ArticleLanguageSuggestionProps = {
  currentLocale: Locale;
  availableLocales: readonly Locale[];
  section: Section;
  slug: string;
  dictionary: Dictionary;
};

type ArticleLanguageSuggestionContentProps = {
  suggestedLocale: Locale;
  section: Section;
  slug: string;
  onDismiss: () => void;
};

export function ArticleLanguageSuggestionContent({
  suggestedLocale,
  section,
  slug,
  onDismiss,
}: ArticleLanguageSuggestionContentProps) {
  const suggestedDictionary = getDictionary(suggestedLocale);
  const href = getHrefWithLocale(suggestedLocale, `/${section}/${slug}` as `/${string}`);

  return (
    <aside
      className={styles.languageSuggestion}
      aria-label={suggestedDictionary.articleLanguageSuggestion.label}
    >
      <span>
        {suggestedDictionary.articleLanguageSuggestion.message.replace(
          "{locale}",
          suggestedDictionary.localeLabel,
        )}
      </span>
      <Link className={styles.languageSuggestionLink} href={href}>
        {suggestedDictionary.articleLanguageSuggestion.action.replace(
          "{locale}",
          suggestedDictionary.localeLabel,
        )}
      </Link>
      <button
        type="button"
        className={styles.languageSuggestionDismiss}
        onClick={onDismiss}
        aria-label={suggestedDictionary.articleLanguageSuggestion.dismiss}
      >
        {suggestedDictionary.articleLanguageSuggestion.dismiss}
      </button>
    </aside>
  );
}

export function ArticleLanguageSuggestion({
  currentLocale,
  availableLocales,
  section,
  slug,
  dictionary,
}: ArticleLanguageSuggestionProps) {
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);

  useEffect(() => {
    const browserLanguages =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];
    const preferredLocale = getSuggestedArticleLocale({
      currentLocale,
      availableLocales,
      browserLanguages,
      dismissed: false,
    });

    if (!preferredLocale) {
      setSuggestedLocale(null);
      return;
    }

    try {
      if (localStorage.getItem(languageSuggestionStorageKey(currentLocale, preferredLocale)) === "dismissed") {
        setSuggestedLocale(null);
        return;
      }
    } catch {
      // Ignore storage failures and show the one-time prompt for this page load.
    }

    setSuggestedLocale(preferredLocale);
  }, [availableLocales, currentLocale]);

  if (!suggestedLocale) {
    return null;
  }

  function handleDismiss() {
    if (!suggestedLocale) {
      return;
    }

    try {
      localStorage.setItem(languageSuggestionStorageKey(currentLocale, suggestedLocale), "dismissed");
    } catch {
      // Ignore storage failures and dismiss in memory.
    }

    setSuggestedLocale(null);
  }

  return (
    <ArticleLanguageSuggestionContent
      suggestedLocale={suggestedLocale}
      section={section}
      slug={slug}
      onDismiss={handleDismiss}
    />
  );
}
