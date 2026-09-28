import type { Metadata } from "next";

import { defaultLocale, getSocialPreviewImageUrl } from "@/lib/i18n";
import { profile2026Copy } from "@/lib/profile-2026-copy";
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

// 2026 has a card per locale, titled with its hero headline (scripts/render-og-cards.ts);
// 2025 uses the site default card.
export function getProfileSocialPreviewImageUrl(version: ProfileVersion, locale: ProfileLocale) {
  return version === "2026" ? `/og/profile-2026.${locale}.jpg` : getSocialPreviewImageUrl();
}

export function getProfileMetadata(locale: ProfileLocale, version: ProfileVersion): Metadata {
  const labels = getProfile2026Labels(locale);
  // The 2026 edition is titled by its short handle (nelson.26) in every locale; 2025 keeps its localized title.
  const title = version === "2026" ? `nelson.${version.slice(2)}` : `${labels.profileNavigationLabel} ${version} | ${labels.site.title}`;
  const path = getProfileCanonicalPath(version);
  const image = {
    url: getProfileSocialPreviewImageUrl(version, locale),
    alt: version === "2026" ? profile2026Copy[locale].headline.join(" ") : title,
  };
  return {
    title,
    description: labels.profilePage.description,
    alternates: getProfileAlternates(locale, version, path),
    robots: { index: !isProfilePreview(version), follow: true },
    // Page metadata replaces the root openGraph/twitter objects, so every field is restated here.
    openGraph: {
      type: "website",
      title,
      description: labels.profilePage.description,
      siteName: labels.site.title,
      url: `/${locale}${path}`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: labels.profilePage.description,
      images: [image],
    },
  };
}
