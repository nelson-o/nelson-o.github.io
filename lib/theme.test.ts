import { describe, expect, it } from "vitest";

import {
  getNextTheme,
  getResolvedThemeForToggle,
  getThemeToggleLabel,
  resolveThemePreference,
  themeStorageKey,
} from "@/lib/theme";

describe("theme preference helpers", () => {
  it("prefers a valid stored theme over system preference", () => {
    expect(resolveThemePreference("dark", false)).toBe("dark");
    expect(resolveThemePreference("light", true)).toBe("light");
  });

  it("falls back to system preference when storage is unset or invalid", () => {
    expect(resolveThemePreference(null, true)).toBe("dark");
    expect(resolveThemePreference(null, false)).toBe("light");
    expect(resolveThemePreference("sepia", true)).toBe("dark");
  });

  it("toggles between light and dark only", () => {
    expect(getNextTheme("light")).toBe("dark");
    expect(getNextTheme("dark")).toBe("light");
  });

  it("describes the next toggle action", () => {
    expect(getThemeToggleLabel("light")).toBe("Switch to dark mode");
    expect(getThemeToggleLabel("dark")).toBe("Switch to light mode");
  });

  it("prefers the document theme over stale component state for toggle interactions", () => {
    expect(
      getResolvedThemeForToggle({
        componentTheme: "light",
        documentTheme: "dark",
        storedTheme: null,
        systemPrefersDark: false,
      }),
    ).toBe("dark");
  });

  it("uses a stable storage key", () => {
    expect(themeStorageKey).toBe("nelson-theme");
  });
});
