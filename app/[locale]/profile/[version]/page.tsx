import { notFound } from "next/navigation";

import { ProfileEdition } from "@/components/layout/profile-edition";
import { isLocale, locales } from "@/lib/i18n";
import { getProfileMetadata, isProfileVersion, profileVersions } from "@/lib/profile-versions";

type Props = { params: Promise<{ locale: string; version: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => profileVersions.map((version) => ({ locale, version })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, version } = await params;
  return isLocale(locale) && isProfileVersion(version) ? getProfileMetadata(locale, version) : {};
}

export default async function VersionedProfileRoute({ params }: Props) {
  const { locale, version } = await params;
  if (!isLocale(locale) || !isProfileVersion(version)) notFound();
  return ProfileEdition({ locale, version });
}
