import { describe, expect, it } from "vitest";

import { generateMetadata } from "@/app/[locale]/[section]/page";
import { getDictionary } from "@/lib/i18n";

describe("localized section metadata", () => {
  it("includes canonical social preview metadata for a section page", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", section: "ideas" }),
    });
    const dictionary = getDictionary("en");
    const page = dictionary.sectionPages.ideas;
    const title = `${page.eyebrow} | ${dictionary.site.title}`;

    expect(metadata.title).toBe(title);
    expect(metadata.description).toBe(page.description);
    expect(metadata.alternates?.canonical).toBe("/en/ideas");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title,
      description: page.description,
      siteName: dictionary.site.title,
      url: "/en/ideas",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/icon.svg",
        alt: title,
      },
    ]);
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title,
      description: page.description,
      images: [
        {
          url: "/icon.svg",
          alt: title,
        },
      ],
    });
  });
});
