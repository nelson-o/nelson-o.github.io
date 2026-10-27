type CssVariables = Pick<CSSStyleDeclaration, "getPropertyValue">;

function getCssVariable(styles: CssVariables, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim();
  if (!value) return fallback;
  const variableMatch = value.match(/^var\((--[^),\s]+)/);
  return variableMatch ? getCssVariable(styles, variableMatch[1], fallback) : value;
}

// Keep the observer's comparison and Mermaid's rendered colors in sync.
export function getMermaidPalette(styles: CssVariables) {
  const background = getCssVariable(styles, "--color-bg-elevated", "#ffffff");
  return {
    background,
    surface: getCssVariable(styles, "--color-surface-strong", background),
    text: getCssVariable(styles, "--color-text", "#111827"),
    muted: getCssVariable(styles, "--color-text-muted", "#4b5563"),
    border: getCssVariable(styles, "--color-border-strong", "rgba(17, 24, 39, 0.22)"),
    accent: getCssVariable(styles, "--color-accent", "#0891b2"),
    accentSoft: getCssVariable(styles, "--color-accent-soft", "rgba(8, 145, 178, 0.12)"),
  };
}
