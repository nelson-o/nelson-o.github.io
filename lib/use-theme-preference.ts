"use client";

import { useEffect, useState } from "react";

import { applyTheme, removeThemeOverrideFromUrl, resolveClientTheme } from "@/lib/theme-client";
import { themeStorageKey, type ThemePreference } from "@/lib/theme";

export function useThemePreference() {
  const [themePreference, setResolvedPreference] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const syncFromLocation = () => setResolvedPreference(resolveClientTheme());
    syncFromLocation();
    setIsHydrated(true);

    // Same-document Back/Forward restores URL overrides without remounting.
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    applyTheme(themePreference);

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

  // Only an explicit change is saved; a resolved URL override never is.
  function setThemePreference(nextPreference: ThemePreference) {
    setResolvedPreference(nextPreference);

    try {
      localStorage.setItem(themeStorageKey, nextPreference);
    } catch {
      // Ignore storage failures and keep the in-memory theme change.
    }

    removeThemeOverrideFromUrl();
  }

  return { themePreference, setThemePreference };
}
