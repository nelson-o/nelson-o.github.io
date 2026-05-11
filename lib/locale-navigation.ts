import { getHrefWithLocale, isSection, type Locale } from "@/lib/i18n";

type LocaleHrefOptions = {
  preserveArticlePath?: boolean;
};

function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(en|zh-tw)(?:\/|$)/i);

  if (!match) {
    return "";
  }

  return pathname.slice(match[0].length);
}

export function getLocaleHrefForPath(
  pathname: string,
  nextLocale: Locale,
  options: LocaleHrefOptions = {},
) {
  const suffix = stripLocalePrefix(pathname);

  if (!suffix) {
    return getHrefWithLocale(nextLocale, "/");
  }

  const parts = suffix.split("/").filter(Boolean);
  const isArticlePath = parts.length > 1 && isSection(parts[0]);
  const nextSuffix = isArticlePath && !options.preserveArticlePath ? parts[0] : suffix;

  return getHrefWithLocale(nextLocale, `/${nextSuffix}` as `/${string}`);
}
