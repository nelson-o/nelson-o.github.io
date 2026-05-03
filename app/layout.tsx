import type { Metadata } from "next";
import Script from "next/script";

import { getMetadataBaseUrl } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: "Nelson Lin",
  description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
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
                var match = window.location.pathname.match(/^\\/(en|zh-tw)(?:\\/|$)/i);
                if (match) {
                  document.documentElement.lang = match[1].toLowerCase() === "zh-tw" ? "zh-TW" : "en";
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
