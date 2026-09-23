import { isSection } from "@/lib/i18n";
import type { ProfileLocale } from "@/lib/profile-locales";

type LocaleHrefOptions = {
  preserveArticlePath?: boolean;
};

function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|th|vi|de)(?:\/|$)/i);

  if (!match) {
    return "";
  }

  return pathname.slice(match[0].length);
}

export function getLocaleHrefForPath(
  pathname: string,
  nextLocale: ProfileLocale,
  options: LocaleHrefOptions = {},
) {
  const suffix = stripLocalePrefix(pathname);

  if (!suffix) {
    return `/${nextLocale}`;
  }

  const parts = suffix.split("/").filter(Boolean);
  const isArticlePath = parts.length > 1 && isSection(parts[0]);
  const nextSuffix = isArticlePath && !options.preserveArticlePath ? parts[0] : suffix;

  return `/${nextLocale}/${nextSuffix}`;
}
