import type { Theme } from "./theme";

// Options for `bun run capture` (scripts/capture-pages.ts); see docs/page-captures.md.
export type CaptureOptions = {
  routes: string[];
  themes: Theme[];
  widths: number[];
  scale: number;
  outDir: string;
  exportDir: string;
  baseUrl: string | null;
};

export const captureDefaults = {
  routes: ["/en/profile/"],
  themes: ["light", "dark"] as Theme[],
  widths: [1280, 390],
  scale: 2,
};

const valueFlags = ["route", "theme", "width", "scale", "out", "dir", "base"] as const;
type ValueFlag = (typeof valueFlags)[number];

function isValueFlag(name: string): name is ValueFlag {
  return (valueFlags as readonly string[]).includes(name);
}

// Accepts `--flag value` and `--flag=value`; route, theme and width may repeat or take commas.
export function parseCaptureArgs(argv: string[], defaultOutDir: string, defaultExportDir: string): CaptureOptions {
  const values: Record<ValueFlag, string[]> = { route: [], theme: [], width: [], scale: [], out: [], dir: [], base: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const match = /^--([a-z]+)(?:=(.*))?$/.exec(argv[index]);
    if (!match || !isValueFlag(match[1])) throw new Error(`Unknown argument: ${argv[index]}`);
    const value = match[2] ?? argv[++index];
    if (value === undefined || value === "") throw new Error(`Missing value for --${match[1]}`);
    values[match[1]].push(...value.split(",").map((part) => part.trim()).filter(Boolean));
  }

  const themes = values.theme.flatMap((theme): Theme[] => {
    if (theme === "both") return ["light", "dark"];
    if (theme === "light" || theme === "dark") return [theme];
    throw new Error(`--theme must be light, dark or both, not "${theme}"`);
  });
  const toPositive = (flag: string) => (raw: string) => {
    const number = Number(raw);
    if (!Number.isFinite(number) || number <= 0) throw new Error(`--${flag} must be a positive number, not "${raw}"`);
    return number;
  };

  return {
    routes: values.route.length ? values.route.map(normalizeRoute) : captureDefaults.routes,
    themes: themes.length ? [...new Set(themes)] : captureDefaults.themes,
    widths: values.width.length ? values.width.map(toPositive("width")).map(Math.round) : captureDefaults.widths,
    scale: values.scale.length ? toPositive("scale")(values.scale.at(-1)!) : captureDefaults.scale,
    outDir: values.out.at(-1) ?? defaultOutDir,
    exportDir: values.dir.at(-1) ?? defaultExportDir,
    baseUrl: values.base.at(-1)?.replace(/\/+$/, "") ?? null,
  };
}

// Routes are exported with trailing slashes, so /en/profile and /en/profile/ capture the same page.
export function normalizeRoute(route: string) {
  const [path, query] = route.split("?", 2);
  const withSlashes = `/${path.replace(/^\/+/, "")}`.replace(/([^/])$/, "$1/");
  return query ? `${withSlashes}?${query}` : withSlashes;
}

// The page URL for one capture; ?theme= wins over any stored preference and is never saved.
export function captureUrl(baseUrl: string, route: string, theme: Theme) {
  const url = new URL(route, `${baseUrl}/`);
  url.searchParams.set("theme", theme);
  return url.toString();
}

// en-profile-dark-1280.png; the root route is "home".
export function captureFileName(route: string, theme: Theme, width: number) {
  const slug = route.split("?")[0].replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-]+/g, "-") || "home";
  return `${slug}-${theme}-${width}.png`;
}
