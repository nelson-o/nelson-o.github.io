import { describe, expect, it } from "vitest";
import { getMermaidPalette } from "./mermaid-palette";

const variables = (values: Record<string, string>) => ({ getPropertyValue: (name: string) => values[name] ?? "" });

describe("Mermaid palette", () => {
  it("keeps readable defaults when custom properties are unavailable", () => {
    expect(getMermaidPalette(variables({}))).toEqual({
      background: "#ffffff", surface: "#ffffff", text: "#111827", muted: "#4b5563",
      border: "rgba(17, 24, 39, 0.22)", accent: "#0891b2", accentSoft: "rgba(8, 145, 178, 0.12)",
    });
  });

  it("resolves aliases and uses the actual background as the surface fallback", () => {
    expect(getMermaidPalette(variables({
      "--color-bg-elevated": " #123456 ", "--color-text": "var(--foreground)",
      "--foreground": "var(--ink)", "--ink": " #abcdef ",
    }))).toMatchObject({ background: "#123456", surface: "#123456", text: "#abcdef" });
  });

  it("ignores unrelated variables but captures every rendered palette color", () => {
    const values = {
      "--color-bg-elevated": "#101010", "--color-surface-strong": "#202020",
      "--color-text": "#303030", "--color-text-muted": "#404040",
      "--color-border-strong": "#505050", "--color-accent": "#606060", "--color-accent-soft": "#707070",
    };
    const before = getMermaidPalette(variables(values));
    expect(getMermaidPalette(variables({ ...values, "--unrelated": "red" }))).toEqual(before);
    for (const name of Object.keys(values)) {
      expect(getMermaidPalette(variables({ ...values, [name]: "#ababab" }))).not.toEqual(before);
    }
  });
});
