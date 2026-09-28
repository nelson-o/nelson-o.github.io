import { describe, expect, it } from "vitest";
import { analyticsConfigured, consentConfigured, consentMaxAge, consentVersion, type PrivacyConfig } from "./config";
import { outboundHost, publicLocation } from "./analytics";
import { validReceipt } from "./runtime";
import { privacyNotices } from "./notices";
import { consentCulture, privacyCopy } from "./copy";
import { profileLocales } from "@/lib/profile-locales";
import { privacyPublicPaths } from "./paths";

const config: PrivacyConfig = {
  cookiebotId: "11111111-1111-1111-1111-111111111111", measurementId: "G-TEST123",
  contact: "privacy@example.org", reviewed: true,
};

describe("privacy release gate", () => {
  it("requires review, a contact and a valid CMP ID before optional services", () => {
    expect(consentConfigured(config)).toBe(true);
    for (const override of [{ reviewed: false }, { contact: "" }, { contact: "bad\nemail" }, { cookiebotId: "" }]) {
      expect(consentConfigured({ ...config, ...override })).toBe(false);
      expect(analyticsConfigured({ ...config, ...override })).toBe(false);
    }
    expect(analyticsConfigured({ ...config, measurementId: "AW-123" })).toBe(false);
    expect(analyticsConfigured(config)).toBe(true);
  });
  it("expires consent and rejects future, corrupt and old-policy receipts", () => {
    const now = Date.now();
    const receipt = { version: consentVersion, at: now, statistics: true, preferences: false };
    expect(validReceipt(receipt, now)).toBe(true);
    expect(validReceipt(receipt, now + consentMaxAge)).toBe(false);
    expect(validReceipt({ ...receipt, version: "old" }, now)).toBe(false);
    expect(validReceipt({ ...receipt, at: now + 1 }, now)).toBe(false);
    expect(validReceipt({ ...receipt, statistics: "true" }, now)).toBe(false);
    expect(validReceipt(null, now)).toBe(false);
  });
});

describe("minimized analytics", () => {
  it("only emits published paths and strips query strings and fragments", () => {
    const paths = privacyPublicPaths();
    expect(publicLocation("https://nelson-o.github.io/en/privacy/?email=private#secret", paths))
      .toBe("https://nelson-o.github.io/en/privacy/");
    expect(publicLocation("https://nelson-o.github.io/private@example.org/", paths)).toBeUndefined();
    expect(publicLocation("broken", paths)).toBeUndefined();
    for (const locale of profileLocales) expect(paths).toContain(`/${locale}/privacy/`);
  });
  it("collects only external HTTP hostnames, never destination paths or credentials", () => {
    const origin = "https://nelson-o.github.io";
    expect(outboundHost("https://user:secret@example.org/private?email=a#secret", origin)).toBe("example.org");
    for (const href of ["/en/", `${origin}/en/`, "mailto:private@example.org", "javascript:alert(1)"]) {
      expect(outboundHost(href, origin)).toBeUndefined();
    }
  });
});

describe("localized privacy notice", () => {
  it.each(profileLocales)("covers notice and controls for %s", (locale) => {
    const notice = privacyNotices[locale];
    expect(notice.sections).toHaveLength(8);
    expect(notice.sections.every(([title, text]) => title.length > 0 && text.length > 40)).toBe(true);
    expect(Object.values(privacyCopy[locale]).every(Boolean)).toBe(true);
  });
  it("distinguishes Traditional and Simplified Chinese in Cookiebot", () => {
    expect(consentCulture("zh-tw")).toBe("ZH-HANT");
    expect(consentCulture("zh-cn")).toBe("ZH");
  });
});

// Local images must remain usable without allowing protocol-relative remote URLs.
it("accepts root-relative profile avatars", async () => {
  const { profileSourceSchema } = await import("@/lib/profile-schema");
  const schema = profileSourceSchema.shape.basics.shape.avatarUrl;
  expect(schema.safeParse("/profile/2026/legacy/avatar.jpg").success).toBe(true);
  expect(schema.safeParse("//untrusted.example/avatar.jpg").success).toBe(false);
});
