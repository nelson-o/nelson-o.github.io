import { notFound } from "next/navigation";

import { ProfileEdition } from "@/components/layout/profile-edition";
import { hasProfileEdition, isProfileLocale, profileLocales } from "@/lib/profile-locales";
import { getProfileMetadata, isProfileVersion, profileVersions } from "@/lib/profile-versions";

type Props = { params: Promise<{ locale: string; version: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return profileLocales.flatMap((locale) => profileVersions
    .filter((version) => hasProfileEdition(locale, version))
    .map((version) => ({ locale, version })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, version } = await params;
  return isProfileLocale(locale) && isProfileVersion(version) && hasProfileEdition(locale, version)
    ? getProfileMetadata(locale, version) : {};
}

export default async function VersionedProfileRoute({ params }: Props) {
  const { locale, version } = await params;
  if (!isProfileLocale(locale) || !isProfileVersion(version) || !hasProfileEdition(locale, version)) notFound();
  return ProfileEdition({ locale, version });
}
