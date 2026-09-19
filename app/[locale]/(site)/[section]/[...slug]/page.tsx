import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/layout/article-page";
import { getDictionary, isLocale, isSection, locales } from "@/lib/i18n";
import { buildArticleMetadata } from "@/lib/mdx/article-metadata";
import { getEntryBySlug, getStaticCatchAllArticleParams } from "@/lib/mdx/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticCatchAllArticleParams();
}

function joinSlug(slug: string[]) {
  return slug.join("/");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, section, slug } = await params;

  if (!isLocale(locale) || !isSection(section)) {
    return {};
  }

  const entry = getEntryBySlug(locale, section, joinSlug(slug));

  if (!entry || !entry.published) {
    return {};
  }

  const availableLocales = locales.filter((item) => {
    const variant = getEntryBySlug(item, section, joinSlug(slug));

    return Boolean(variant?.published);
  });

  return buildArticleMetadata(entry, locale, getDictionary(locale), availableLocales);
}

export default async function LocalizedArticlePage({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string[] }>;
}) {
  const { locale, section, slug } = await params;

  if (!isLocale(locale) || !isSection(section)) {
    notFound();
  }

  const entry = getEntryBySlug(locale, section, joinSlug(slug));
  const isDevMode = process.env.NODE_ENV === "development";

  if (!entry || (!entry.published && !isDevMode)) {
    notFound();
  }

  const availableLocales = locales.filter((item) => {
    const variant = getEntryBySlug(item, section, joinSlug(slug));

    return Boolean(variant?.published);
  });

  return (
    <ArticlePage
      entry={entry}
      dictionary={getDictionary(locale)}
      availableLocales={availableLocales}
    />
  );
}
