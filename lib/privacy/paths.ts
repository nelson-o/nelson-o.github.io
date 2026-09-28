import { locales } from "@/lib/i18n";
import { profileLocales, hasProfileEdition } from "@/lib/profile-locales";
import { profileVersions } from "@/lib/profile-versions";
import { getLocaleSitemapEntries } from "@/lib/sitemap";

export function privacyPublicPaths() {
  return [...new Set([
    ...locales.flatMap((locale) => getLocaleSitemapEntries(locale).map(({ url }) => new URL(url).pathname)),
    ...profileLocales.flatMap((locale) => [
      `/${locale}/privacy/`, `/${locale}/profile/`,
      ...profileVersions.filter((version) => hasProfileEdition(locale, version)).map((version) => `/${locale}/profile/${version}/`),
    ]),
  ])];
}
