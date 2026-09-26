import { describe, expect, it } from "vitest";

import { getProfileLanguageRedirect, languageStorageKey, profileLanguageScript } from "@/lib/profile-language";
import { profileLocales } from "@/lib/profile-locales";

const redirect = (path: string) => getProfileLanguageRedirect(`https://nelson-o.github.io${path}`, profileLocales);

describe("?lang= on the 2026 profile", () => {
  it("moves a valid language to its static path, keeping other parameters and the hash", () => {
    expect(redirect("/en/profile/2026/?lang=ja&theme=dark#projects")).toEqual({ target: "/ja/profile/2026/?theme=dark#projects", navigate: true });
    expect(redirect("/ja/profile/2026/?utm=x&lang=de")).toEqual({ target: "/de/profile/2026/?utm=x", navigate: true });
    expect(redirect("/en/profile/2026?lang=ZH_TW")).toEqual({ target: "/zh-tw/profile/2026", navigate: true });
  });

  it("only consumes the query when it already matches the path", () => {
    expect(redirect("/ko/profile/2026/?lang=ko#contact")).toEqual({ target: "/ko/profile/2026/#contact", navigate: false });
  });

  it("ignores missing and unsupported languages and other routes", () => {
    expect(redirect("/en/profile/2026/")).toBeNull();
    expect(redirect("/en/profile/2026/?lang=fr")).toBeNull();
    expect(redirect("/en/profile/2026/?lang=")).toBeNull();
    expect(redirect("/en/profile/2025/?lang=ja")).toBeNull();
    expect(redirect("/en/systems/?lang=ja")).toBeNull();
  });

  it("never produces a target that would redirect again", () => {
    for (const path of ["/en/profile/2026/?lang=ja", "/th/profile/2026/?lang=th&theme=light"]) {
      expect(redirect(redirect(path)!.target)).toBeNull();
    }
  });

  it("runs as the inlined script: replace for a new locale, history only for the same one", () => {
    const run = (href: string) => {
      const calls: string[] = [];
      new Function("location", "history", profileLanguageScript())(
        { href, replace: (target: string) => calls.push(`replace ${target}`) },
        { state: null, replaceState: (_: unknown, __: string, target: string) => calls.push(`history ${target}`) },
      );
      return calls;
    };
    expect(run("https://nelson-o.github.io/en/profile/2026/?lang=vi")).toEqual(["replace /vi/profile/2026/"]);
    expect(run("https://nelson-o.github.io/vi/profile/2026/?lang=vi")).toEqual(["history /vi/profile/2026/"]);
    expect(run("https://nelson-o.github.io/vi/profile/2026/")).toEqual([]);
  });

  it("uses a stable storage key", () => {
    expect(languageStorageKey).toBe("nelson-language");
  });
});
