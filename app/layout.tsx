import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";

import { getMetadataBaseUrl } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";

import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
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
