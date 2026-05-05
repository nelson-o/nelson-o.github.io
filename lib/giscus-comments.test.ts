import { describe, expect, it } from "vitest";

import { getGiscusTheme } from "@/components/ui/giscus-comments";

describe("GiscusComments", () => {
  it("uses local-safe borderless giscus themes for site themes", () => {
    expect(getGiscusTheme(false)).toBe("noborder_light");
    expect(getGiscusTheme(true)).toBe("cobalt");
  });
});
