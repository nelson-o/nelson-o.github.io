"use client";

import { useEffect, useState } from "react";

import { applyTheme, resolveClientTheme } from "@/lib/theme-client";
import { themeStorageKey, type ThemePreference } from "@/lib/theme";

export function useThemePreference() {
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setThemePreference(resolveClientTheme());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    applyTheme(themePreference);

    try {
      localStorage.setItem(themeStorageKey, themePreference);
    } catch {
      // Ignore storage failures and keep the in-memory theme change.
    }

    if (themePreference !== "system" || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [themePreference, isHydrated]);

  return { themePreference, setThemePreference };
}
