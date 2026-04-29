"use client";

import React, { useEffect, useState } from "react";

import styles from "@/components/ui/theme-toggle.module.css";
import { MoonIcon, SunIcon } from "@/components/ui/theme-toggle-icons";
import { applyTheme, resolveClientTheme, resolveNextTheme } from "@/lib/theme-client";
import { themeStorageKey, type Theme } from "@/lib/theme";

type ThemeToggleProps = {
  label?: string;
  labels?: {
    light: string;
    dark: string;
  };
};

export function ThemeToggle({ label = "Toggle color theme", labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = resolveClientTheme();
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  function handleToggle() {
    const nextTheme = resolveNextTheme(theme);

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
      className={`theme-toggle ${styles.root}`}
      onClick={handleToggle}
      aria-label={resolvedLabel || label}
      title={resolvedLabel || label}
      data-ready="true"
    >
      <span className={`theme-toggle-icon theme-toggle-icon-sun ${styles.icon} ${styles.sun}`}>
        <SunIcon />
      </span>
      <span className={`theme-toggle-icon theme-toggle-icon-moon ${styles.icon} ${styles.moon}`}>
        <MoonIcon />
      </span>
    </button>
  );
}
