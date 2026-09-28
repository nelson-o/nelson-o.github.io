import { describe, expect, it } from "vitest";

import {
  getResolvedTheme,
  getNextTheme,
  getResolvedThemeForToggle,
  getThemeOverride,
  getThemeToggleLabel,
  resolveThemePreference,
  themedImagePreloadScript,
  themeScript,
  themeStorageKey,
  withThemeOverride,
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

  it("reads only a valid ?theme= override", () => {
    expect(getThemeOverride("?theme=dark")).toBe("dark");
    expect(getThemeOverride("?lang=ja&theme=system")).toBe("system");
    expect(getThemeOverride("?theme=sepia")).toBeNull();
    expect(getThemeOverride("?theme=Dark")).toBeNull();
    expect(getThemeOverride("")).toBeNull();
  });

  it("carries a valid override onto another href and drops an invalid one", () => {
    expect(withThemeOverride("/ja/profile/2026", "?theme=light")).toBe("/ja/profile/2026?theme=light");
    expect(withThemeOverride("/ja/?x=1", "?theme=dark")).toBe("/ja/?x=1&theme=dark");
    expect(withThemeOverride("/ja/profile/2026", "?theme=sepia")).toBe("/ja/profile/2026");
  });

  it("lets the inline script prefer ?theme= over storage without saving it", () => {
    const run = (search: string, stored: string | null, systemDark = false) => {
      const classes = new Set<string>();
      const storage = new Map(stored ? [[themeStorageKey, stored]] : []);
      const root = { classList: { add: (name: string) => classes.add(name), remove: (...names: string[]) => names.forEach((name) => classes.delete(name)) }, style: {}, dataset: {} as Record<string, string> };
      new Function("document", "localStorage", "location", "window", themeScript())(
        { documentElement: root },
        { getItem: (key: string) => storage.get(key) ?? null, setItem: () => { throw new Error("the script must not save"); } },
        { search },
        { matchMedia: () => ({ matches: systemDark }) },
      );
      return { classes: [...classes], preference: root.dataset.themePreference };
    };
    expect(run("?theme=dark", "light")).toEqual({ classes: ["theme-dark"], preference: "dark" });
    expect(run("?theme=system", "light", true)).toEqual({ classes: ["theme-dark"], preference: "system" });
    expect(run("?theme=sepia", "light")).toEqual({ classes: ["theme-light"], preference: "light" });
    expect(run("", null, true)).toEqual({ classes: ["theme-dark"], preference: "system" });
  });

  it("preloads the image for the resolved theme, including a preference opposite to the system (#132)", () => {
    const run = (search: string, stored: string | null, systemDark: boolean) => {
      const links: Record<string, string>[] = [];
      new Function("document", "localStorage", "location", "window", themedImagePreloadScript({ light: "/l.webp", dark: "/d.webp" }))(
        { createElement: () => ({}), head: { appendChild: (link: Record<string, string>) => links.push(link) } },
        { getItem: () => stored },
        { search },
        { matchMedia: () => ({ matches: systemDark }) },
      );
      return links.map(({ rel, as, fetchPriority, href }) => ({ rel, as, fetchPriority, href }));
    };
    const preload = (href: string) => [{ rel: "preload", as: "image", fetchPriority: "high", href }];
    expect(run("", null, false)).toEqual(preload("/l.webp"));
    expect(run("", null, true)).toEqual(preload("/d.webp"));
    expect(run("", "dark", false)).toEqual(preload("/d.webp"));
    expect(run("?theme=dark", "light", false)).toEqual(preload("/d.webp"));
    expect(run("?theme=light", null, true)).toEqual(preload("/l.webp"));
    expect(run("?theme=system", "dark", false)).toEqual(preload("/l.webp"));
  });

  it("uses a stable storage key", () => {
    expect(themeStorageKey).toBe("nelson-theme");
  });
});
