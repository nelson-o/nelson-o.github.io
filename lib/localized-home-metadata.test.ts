import { describe, expect, it } from "vitest";

import { generateMetadata } from "@/app/[locale]/page";
import { getDictionary } from "@/lib/i18n";

describe("localized home metadata", () => {
  it("includes canonical social preview metadata for the locale home page", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });
    const dictionary = getDictionary("en");

    expect(metadata.title).toBe(dictionary.site.title);
    expect(metadata.description).toBe(dictionary.site.description);
    expect(metadata.alternates?.canonical).toBe("/en");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: dictionary.site.title,
      description: dictionary.site.description,
      siteName: dictionary.site.title,
      url: "/en",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/og/default.png",
        alt: dictionary.site.title,
      },
    ]);
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: dictionary.site.title,
      description: dictionary.site.description,
      images: [
        {
          url: "/og/default.png",
          alt: dictionary.site.title,
        },
      ],
    });
  });
});
