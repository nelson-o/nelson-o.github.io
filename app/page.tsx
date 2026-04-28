import Link from "next/link";

import { locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-tw": "繁體中文",
};

export default function LocaleGatewayPage() {
  return (
    <main className="locale-gateway">
      <div className="locale-gateway-panel">
        <div className="eyebrow">Language</div>
        <h1>Choose a reading language.</h1>
        <p>
          The site now publishes localized routes for global readers. Pick a language to enter the
          writing surface.
        </p>

        <div className="locale-gateway-links">
          {locales.map((locale) => (
            <Link key={locale} href={`/${locale}`} className="section-card">
              <h2>{localeLabels[locale]}</h2>
              <p>/{locale}/</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
