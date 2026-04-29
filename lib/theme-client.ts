import {
  getNextTheme,
  getResolvedThemeForToggle,
  getThemeClassName,
  themeClassNames,
  themeStorageKey,
  type Theme,
} from "@/lib/theme";

function readThemeFromDocument(): Theme | null {
  if (typeof document === "undefined") {
    return null;
  }

  const root = document.documentElement;

  if (root.classList.contains(themeClassNames.dark)) {
    return "dark";
  }

  if (root.classList.contains(themeClassNames.light)) {
    return "light";
  }

  return null;
}

export function resolveClientTheme(): Theme {
  const stored = (() => {
    try {
      return localStorage.getItem(themeStorageKey);
    } catch {
      return null;
    }
  })();

  const systemPrefersDark =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return getResolvedThemeForToggle({
    componentTheme: null,
    documentTheme: readThemeFromDocument(),
    storedTheme: stored,
    systemPrefersDark,
  });
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove(themeClassNames.light, themeClassNames.dark);
  root.classList.add(getThemeClassName(theme));
  root.style.colorScheme = theme;
}

export function resolveNextTheme(current: Theme) {
  return getNextTheme(current);
}
