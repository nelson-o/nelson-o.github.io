export const themeStorageKey = "nelson-theme";
// A valid ?theme= wins for any page load that carries it and is never saved (#84).
export const themeQueryParam = "theme";

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

export function getThemeOverride(search: string): ThemePreference | null {
  const value = new URLSearchParams(search).get(themeQueryParam);
  return isThemePreference(value) ? value : null;
}

// Carries a URL theme override onto another same-site href, e.g. a language switch.
export function withThemeOverride(href: string, search: string) {
  const override = getThemeOverride(search);
  return override ? `${href}${href.includes("?") ? "&" : "?"}${themeQueryParam}=${override}` : href;
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

// Resolves `preference` and `theme` exactly as the page will, for inline scripts that run before React.
function resolveThemeSource() {
  return `const key = "${themeStorageKey}";
    const isPreference = (value) => value === "light" || value === "dark" || value === "system";
    const override = new URLSearchParams(location.search).get("${themeQueryParam}");
    const stored = (() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    })();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preference = isPreference(override)
      ? override
      : isPreference(stored) ? stored : "system";
    const theme = preference === "system"
      ? (systemPrefersDark ? "dark" : "light")
      : preference;`;
}

export function themeScript() {
  return `(() => {
    const classes = ${JSON.stringify(themeClassNames)};
    const root = document.documentElement;
    ${resolveThemeSource()}

    root.classList.remove(classes.light, classes.dark);
    root.classList.add(classes[theme]);
    root.style.colorScheme = theme;
    root.dataset.themePreference = preference;
  })();`;
}

// Preloads the resolved theme's image at high priority, so a stored or ?theme= preference that
// differs from the system theme still gets its image early (#132). `hrefs` maps theme → URL.
export function themedImagePreloadScript(hrefs: Record<Theme, string>) {
  return `(() => {
    ${resolveThemeSource()}
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.fetchPriority = "high";
    link.href = ${JSON.stringify(hrefs)}[theme];
    document.head.appendChild(link);
  })();`;
}
