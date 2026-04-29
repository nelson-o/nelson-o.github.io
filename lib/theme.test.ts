import { describe, expect, it } from "vitest";

import {
  getResolvedTheme,
  getNextTheme,
  getResolvedThemeForToggle,
  getThemeToggleLabel,
  resolveThemePreference,
  themeStorageKey,
} from "@/lib/theme";

describe("theme preference helpers", () => {
  it("prefers a valid stored theme preference and defaults to system", () => {
    expect(resolveThemePreference("dark", false)).toBe("dark");
    expect(resolveThemePreference("light", true)).toBe("light");
    expect(resolveThemePreference("system", true)).toBe("system");
    expect(resolveThemePreference(null, true)).toBe("system");
    expect(resolveThemePreference("sepia", false)).toBe("system");
  });

  it("resolves the applied theme from a preference", () => {
    expect(getResolvedTheme("system", true)).toBe("dark");
    expect(getResolvedTheme("system", false)).toBe("light");
    expect(getResolvedTheme("dark", true)).toBe("dark");
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
        componentTheme: "system",
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
