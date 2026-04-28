import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfilePage } from "@/components/layout/profile-page";
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
    title: `${dictionary.profileNavigationLabel} | ${dictionary.site.title}`,
    description: dictionary.profilePage.description,
    alternates: getAlternates(locale, "/profile"),
  };
}

export default async function LocalizedProfileRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ProfilePage profile={getProfile(locale)} dictionary={getDictionary(locale)} />;
}
