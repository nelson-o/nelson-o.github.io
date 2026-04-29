export const themeStorageKey = "nelson-theme";

export const themeClassNames = {
  light: "theme-light",
  dark: "theme-dark",
} as const;

export type Theme = keyof typeof themeClassNames;
export type ThemePreference = Theme | "system";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || isTheme(value);
}

export function resolveThemePreference(
  storedValue: string | null,
  _systemPrefersDark: boolean,
): ThemePreference {
  if (isThemePreference(storedValue)) {
    return storedValue;
  }

  return "system";
}

export function getNextTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

export function getThemeToggleLabel(theme: Theme) {
  return theme === "light" ? "Switch to dark mode" : "Switch to light mode";
}

export function getResolvedTheme(themePreference: ThemePreference, systemPrefersDark: boolean): Theme {
  if (themePreference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return themePreference;
}

export function getResolvedThemeForToggle({
  componentTheme,
  documentTheme,
  storedTheme,
  systemPrefersDark,
}: {
  componentTheme: ThemePreference | null;
  documentTheme: Theme | null;
  storedTheme: string | null;
  systemPrefersDark: boolean;
}) {
  if (documentTheme) {
    return documentTheme;
  }

  if (componentTheme) {
    return getResolvedTheme(componentTheme, systemPrefersDark);
  }

  return getResolvedTheme(resolveThemePreference(storedTheme, systemPrefersDark), systemPrefersDark);
}

export function getThemeClassName(theme: Theme) {
  return themeClassNames[theme];
}

export function themeScript() {
  return `(() => {
    const key = "${themeStorageKey}";
    const classes = ${JSON.stringify(themeClassNames)};
    const root = document.documentElement;
    const stored = (() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    })();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preference = stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
    const theme = preference === "system"
      ? (systemPrefersDark ? "dark" : "light")
      : preference;

    root.classList.remove(classes.light, classes.dark);
    root.classList.add(classes[theme]);
    root.style.colorScheme = theme;
    root.dataset.themePreference = preference;
  })();`;
}
