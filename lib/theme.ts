export const themeStorageKey = "nelson-theme";

export const themeClassNames = {
  light: "theme-light",
  dark: "theme-dark",
} as const;

export type Theme = keyof typeof themeClassNames;

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveThemePreference(storedValue: string | null, systemPrefersDark: boolean): Theme {
  if (isTheme(storedValue)) {
    return storedValue;
  }

  return systemPrefersDark ? "dark" : "light";
}

export function getNextTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

export function getThemeToggleLabel(theme: Theme) {
  return theme === "light" ? "Switch to dark mode" : "Switch to light mode";
}

export function getResolvedThemeForToggle({
  componentTheme,
  documentTheme,
  storedTheme,
  systemPrefersDark,
}: {
  componentTheme: Theme | null;
  documentTheme: Theme | null;
  storedTheme: string | null;
  systemPrefersDark: boolean;
}) {
  if (documentTheme) {
    return documentTheme;
  }

  if (componentTheme) {
    return componentTheme;
  }

  return resolveThemePreference(storedTheme, systemPrefersDark);
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
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (systemPrefersDark ? "dark" : "light");

    root.classList.remove(classes.light, classes.dark);
    root.classList.add(classes[theme]);
    root.style.colorScheme = theme;
  })();`;
}
