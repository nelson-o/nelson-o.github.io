import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedHomePage as LocalizedHomePageView } from "@/components/layout/localized-home-page";
import {
  getAlternates,
  getDictionary,
  getStaticLocaleParams,
  isLocale,
} from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";

export function generateStaticParams() {
  return getStaticLocaleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.site.title,
    description: dictionary.site.description,
    alternates: getAlternates(locale, "/"),
  };
}

export default async function LocalizedHomeRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const latestEntries = getLatestEntries(locale, 4);

  return <LocalizedHomePageView locale={locale} dictionary={dictionary} latestEntries={latestEntries} />;
}
