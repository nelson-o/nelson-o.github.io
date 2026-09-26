import {
  getResolvedTheme,
  getThemeClassName,
  getThemeOverride,
  resolveThemePreference,
  themeClassNames,
  themeQueryParam,
  themeStorageKey,
  type ThemePreference,
} from "@/lib/theme";

// Precedence: valid ?theme= → saved preference → system. Re-read on every
// mount, so a client-side navigation to a URL without ?theme= drops it.
export function resolveClientTheme(): ThemePreference {
  const override = typeof location === "undefined" ? null : getThemeOverride(location.search);

  if (override) {
    return override;
  }

  const stored = (() => {
    try {
      return localStorage.getItem(themeStorageKey);
    } catch {
      return null;
    }
  })();

  const systemPrefersDark =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return resolveThemePreference(stored, systemPrefersDark);
}

// An explicit settings change replaces a conflicting URL override.
export function removeThemeOverrideFromUrl() {
  const url = new URL(location.href);

  if (!url.searchParams.has(themeQueryParam)) {
    return;
  }

  url.searchParams.delete(themeQueryParam);
  history.replaceState(history.state, "", url);
}

export function applyTheme(themePreference: ThemePreference) {
  const root = document.documentElement;
  const systemPrefersDark =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = getResolvedTheme(themePreference, systemPrefersDark);

  root.classList.remove(themeClassNames.light, themeClassNames.dark);
  root.classList.add(getThemeClassName(theme));
  root.style.colorScheme = theme;
  root.dataset.themePreference = themePreference;
}
