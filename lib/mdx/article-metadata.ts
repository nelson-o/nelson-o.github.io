import type { Metadata } from "next";

import type { ContentEntry } from "@/lib/mdx/content";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  getAlternates,
  getHrefWithLocale,
  getLocaleHrefLang,
  getTopicSocialPreviewImageUrl,
  locales,
} from "@/lib/i18n";

export function buildArticleMetadata(
  entry: ContentEntry,
  locale: Locale,
  dictionary: Dictionary,
  availableLocales: readonly Locale[] = locales,
): Metadata {
  const title = `${entry.title} | ${dictionary.site.title}`;
  const href = `/${entry.section}/${entry.slug}` as `/${string}`;
  const previewImage = getTopicSocialPreviewImageUrl(entry.section, entry.slug);

  return {
    title,
    description: entry.summary,
    alternates: getAlternates(locale, href, availableLocales),
    openGraph: {
      type: "article",
      title,
      description: entry.summary,
      siteName: dictionary.site.title,
      url: getHrefWithLocale(locale, href),
      locale: getLocaleHrefLang(locale),
      alternateLocale: availableLocales
        .filter((item) => item !== locale)
        .map((item) => getLocaleHrefLang(item)),
      publishedTime: entry.date,
      modifiedTime: entry.date,
      section: dictionary.articleSectionLabels[entry.section],
      images: [
        {
          url: previewImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.summary,
      images: [
        {
          url: previewImage,
          alt: title,
        },
      ],
    },
  };
}
