import type { Metadata } from "next";

import { defaultLocale } from "@/lib/i18n";
import { getProfile2026Labels } from "@/lib/profile-2026-labels";
import { getProfileHrefLang, getProfileLocales, type ProfileLocale } from "@/lib/profile-locales";

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

function getProfileAlternates(locale: ProfileLocale, version: ProfileVersion, path: `/${string}`) {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries([
      ...getProfileLocales(version).map((item) => [getProfileHrefLang(item), `/${item}${path}`]),
      ["x-default", `/${defaultLocale}${path}`],
    ]),
  };
}

export function getProfileMetadata(locale: ProfileLocale, version: ProfileVersion): Metadata {
  const labels = getProfile2026Labels(locale);
  const title = `${labels.profileNavigationLabel} ${version} | ${labels.site.title}`;
  const path = getProfileCanonicalPath(version);
  return {
    title,
    description: labels.profilePage.description,
    alternates: getProfileAlternates(locale, version, path),
    robots: { index: !isProfilePreview(version), follow: true },
    openGraph: {
      title,
      description: labels.profilePage.description,
      url: `/${locale}${path}`,
    },
  };
}
