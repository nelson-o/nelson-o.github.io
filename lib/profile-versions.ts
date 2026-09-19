import type { Metadata } from "next";

import { getAlternates, getDictionary, type Locale } from "@/lib/i18n";

export const profileVersions = ["2025", "2026"] as const;
export type ProfileVersion = (typeof profileVersions)[number];

// Change only after the 2026 release review. Reverting this restores 2025.
export const activeProfileVersion: ProfileVersion = "2025";

export function isProfileVersion(value: string): value is ProfileVersion {
  return profileVersions.includes(value as ProfileVersion);
}

export function isProfilePreview(version: ProfileVersion, active: ProfileVersion = activeProfileVersion) {
  return version === "2026" && active !== "2026";
}

export function getProfileCanonicalPath(version: ProfileVersion, active: ProfileVersion = activeProfileVersion) {
  return version === active ? "/profile" : `/profile/${version}` as const;
}

export function getProfileSitemapPaths(active: ProfileVersion = activeProfileVersion) {
  return ["/profile", ...profileVersions
    .filter((version) => version !== active && !isProfilePreview(version, active))
    .map((version) => `/profile/${version}`)] as `/${string}`[];
}

export function getProfileMetadata(locale: Locale, version: ProfileVersion): Metadata {
  const dictionary = getDictionary(locale);
  const title = `${dictionary.profileNavigationLabel} ${version} | ${dictionary.site.title}`;
  const path = getProfileCanonicalPath(version);
  return {
    title,
    description: dictionary.profilePage.description,
    alternates: getAlternates(locale, path),
    robots: { index: !isProfilePreview(version), follow: true },
    openGraph: {
      title,
      description: dictionary.profilePage.description,
      url: `/${locale}${path}`,
    },
  };
}
