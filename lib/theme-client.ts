import {
  getResolvedTheme,
  getThemeClassName,
  resolveThemePreference,
  themeClassNames,
  themeStorageKey,
  type ThemePreference,
} from "@/lib/theme";

function readThemePreferenceFromDocument(): ThemePreference | null {
  if (typeof document === "undefined") {
    return null;
  }

  const root = document.documentElement;
  const preference = root.dataset.themePreference;

  if (preference === "system" || preference === "light" || preference === "dark") {
    return preference;
  }

  return null;
}

export function resolveClientTheme(): ThemePreference {
  const documentPreference = readThemePreferenceFromDocument();

  if (documentPreference) {
    return documentPreference;
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
