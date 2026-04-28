"use client";

import { useEffect, useState } from "react";

import {
  getNextTheme,
  getThemeClassName,
  resolveThemePreference,
  themeClassNames,
  themeStorageKey,
  type Theme,
} from "@/lib/theme";

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.25" fill="currentColor" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.75">
        <path d="M12 2.5v2.25" />
        <path d="M12 19.25v2.25" />
        <path d="M21.5 12h-2.25" />
        <path d="M4.75 12H2.5" />
        <path d="M18.72 5.28l-1.6 1.6" />
        <path d="M6.88 17.12l-1.6 1.6" />
        <path d="M18.72 18.72l-1.6-1.6" />
        <path d="M6.88 6.88l-1.6-1.6" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M14.4 3.2c-1.35 0-2.67.33-3.84.95a8.9 8.9 0 1 0 9.3 14.96 6.9 6.9 0 0 1-5.46-6.76c0-2.7 1.58-5.13 4.03-6.22a8.84 8.84 0 0 0-4.07-2.95Z"
        fill="currentColor"
      />
      <path
        d="M18.65 4.35l.42 1.05 1.06.42-1.06.42-.42 1.05-.41-1.05-1.06-.42 1.06-.42.41-1.05Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

function resolveClientTheme(): Theme {
  const fromDocument = readThemeFromDocument();

  if (fromDocument) {
    return fromDocument;
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

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove(themeClassNames.light, themeClassNames.dark);
  root.classList.add(getThemeClassName(theme));
  root.style.colorScheme = theme;
}

type ThemeToggleProps = {
  label?: string;
  labels?: {
    light: string;
    dark: string;
  };
};

export function ThemeToggle({ label = "Toggle color theme", labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initialTheme = resolveClientTheme();
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  function handleToggle() {
    const currentTheme = theme ?? resolveClientTheme();
    const nextTheme = getNextTheme(currentTheme);

    applyTheme(nextTheme);
    setTheme(nextTheme);

    try {
      localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Ignore storage failures and keep the in-memory theme change.
    }
  }

  const resolvedTheme = theme ?? "light";
  const resolvedLabel =
    resolvedTheme === "light"
      ? (labels?.light ?? "Switch to dark mode")
      : (labels?.dark ?? "Switch to light mode");

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={theme ? resolvedLabel : label}
      title={theme ? resolvedLabel : label}
      data-ready={theme ? "true" : "false"}
    >
      <span className="theme-toggle-icon theme-toggle-icon-sun">
        <SunIcon />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon-moon">
        <MoonIcon />
      </span>
    </button>
  );
}
