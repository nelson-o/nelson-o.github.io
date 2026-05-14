import { describe, expect, it } from "vitest";

import { getGiscusLang, getGiscusTheme } from "@/components/ui/giscus-comments";

describe("GiscusComments", () => {
  it("uses local-safe borderless giscus themes for site themes", () => {
    expect(getGiscusTheme(false)).toBe("noborder_light");
    expect(getGiscusTheme(true)).toBe("cobalt");
  });

  it("maps site locales to giscus language codes", () => {
    expect(getGiscusLang("en")).toBe("en");
    expect(getGiscusLang("zh-tw")).toBe("zh-TW");
    expect(getGiscusLang("zh-cn")).toBe("zh-CN");
    expect(getGiscusLang("ja")).toBe("ja");
  });
});
