import { notFound } from "next/navigation";

import { ProfileEdition } from "@/components/layout/profile-edition";
import { getStaticLocaleParams, isLocale } from "@/lib/i18n";
import { activeProfileVersion, getProfileMetadata } from "@/lib/profile-versions";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = getStaticLocaleParams;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocale(locale) ? getProfileMetadata(locale, activeProfileVersion) : {};
}

export default async function LocalizedProfileRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return ProfileEdition({ locale, version: activeProfileVersion });
}
