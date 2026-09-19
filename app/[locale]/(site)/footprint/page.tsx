import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FootprintPage } from "@/components/layout/footprint-page";
import { getAlternates, getDictionary, getStaticLocaleParams, isLocale } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";

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
    title: `${dictionary.footprintNavigationLabel} | ${dictionary.site.title}`,
    description: dictionary.footprintPage.description,
    alternates: getAlternates(locale, "/footprint"),
  };
}

export default async function LocalizedFootprintRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <FootprintPage dictionary={getDictionary(locale)} profile={getProfile(locale)} />;
}
