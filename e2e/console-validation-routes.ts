import { locales, sections } from "@/lib/i18n";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

export type ConsoleValidationRoute = {
  path: string;
  label: string;
};

function route(path: string, label: string): ConsoleValidationRoute {
  return { path, label };
}

export function getConsoleValidationRoutes(): ConsoleValidationRoute[] {
  return [
    route("/", "root locale gateway"),
    route("/dev-mode", "dev mode"),
    route("/this-route-does-not-exist", "404 fallback"),
    ...locales.flatMap((locale) => [
      route(`/${locale}`, `${locale} home`),
      route(`/${locale}/profile`, `${locale} profile`),
      route(`/${locale}/profile/2025`, `${locale} profile 2025`),
      route(`/${locale}/profile/2026`, `${locale} profile 2026`),
      route(`/${locale}/footprint`, `${locale} footprint`),
      ...sections.flatMap((section) => [
        route(`/${locale}/${section}`, `${locale} ${section} index`),
        ...getPublishedEntriesForSection(locale, section).map((entry) =>
          route(`/${locale}/${section}/${entry.slug}`, `${locale} ${section}/${entry.slug}`),
        ),
      ]),
    ]),
  ];
}
