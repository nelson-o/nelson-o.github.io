import { notFound } from "next/navigation";

import { ProfileEdition } from "@/components/layout/profile-edition";
import { getProfileLocales, hasProfileEdition, isProfileLocale } from "@/lib/profile-locales";
import { activeProfileVersion, getProfileMetadata } from "@/lib/profile-versions";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

// The alias follows the active edition, so promoting 2026 also exports its languages.
export function generateStaticParams() {
  return getProfileLocales(activeProfileVersion).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isProfileLocale(locale) && hasProfileEdition(locale, activeProfileVersion)
    ? getProfileMetadata(locale, activeProfileVersion) : {};
}

export default async function LocalizedProfileRoute({ params }: Props) {
  const { locale } = await params;
  if (!isProfileLocale(locale) || !hasProfileEdition(locale, activeProfileVersion)) notFound();
  return ProfileEdition({ locale, version: activeProfileVersion });
}
