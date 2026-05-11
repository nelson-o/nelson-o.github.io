import type { Metadata } from "next";
import Script from "next/script";

import { getMetadataBaseUrl, getSocialPreviewImageUrl } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: "Nelson Lin",
  description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
  openGraph: {
    type: "website",
    title: "Nelson Lin",
    description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
    siteName: "Nelson Lin",
    url: getMetadataBaseUrl(),
    images: [
      {
        url: getSocialPreviewImageUrl(),
        alt: "Nelson Lin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nelson Lin",
    description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
    images: [
      {
        url: getSocialPreviewImageUrl(),
        alt: "Nelson Lin",
      },
    ],
  },
  verification: {
    google: "S1qIqeYHIulXYxHygT8rilOql-o3qWKfOqc2e2LVNu4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
        <Script
          id="locale-lang-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var match = window.location.pathname.match(/^\\/(en|zh-tw|zh-cn)(?:\\/|$)/i);
                if (match) {
                  var lc = match[1].toLowerCase();
                  document.documentElement.lang = lc === "zh-tw" ? "zh-TW" : lc === "zh-cn" ? "zh-CN" : "en";
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
