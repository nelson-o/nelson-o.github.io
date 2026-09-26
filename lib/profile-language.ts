import { profileLocales } from "@/lib/profile-locales";

// Written only by an explicit language change in the 2026 profile settings,
// and read only where the URL names no locale: the root redirect (#84).
export const languageStorageKey = "nelson-language";
export const languageQueryParam = "lang";

// A valid ?lang= on a 2026 profile URL becomes that locale's static path.
// The query is consumed; other parameters, including ?theme=, and the hash
// are kept. Returns the target and whether it needs a navigation, or null
// when there is nothing to do. Self-contained: it is inlined as a script.
export function getProfileLanguageRedirect(href: string, supported: readonly string[]) {
  const url = new URL(href);
  const raw = url.searchParams.get("lang");
  if (raw === null) return null;
  const match = url.pathname.match(/^\/([^/]+)(\/profile\/2026(?:\/.*)?)$/);
  const lang = raw.toLowerCase().replace(/_/g, "-");
  if (!match || !supported.includes(lang)) return null;
  url.searchParams.delete("lang");
  url.pathname = `/${lang}${match[2]}`;
  return { target: url.pathname + url.search + url.hash, navigate: lang !== match[1] };
}

export function profileLanguageScript() {
  return `(() => {
    const redirect = (${getProfileLanguageRedirect.toString()})(location.href, ${JSON.stringify(profileLocales)});
    if (!redirect) return;
    if (redirect.navigate) location.replace(redirect.target);
    else history.replaceState(history.state, "", redirect.target);
  })();`;
}
