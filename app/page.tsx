import React from "react";

import styles from "@/app/page.module.css";
import { SiteShell } from "@/components/layout/site-shell";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const rootLocaleRedirectScript = `
(function () {
  function normalizeLanguage(value) {
    return String(value || "").toLowerCase().replace(/_/g, "-");
  }

  function getLocaleMatch(language) {
    var normalized = normalizeLanguage(language);

    if (normalized === "en") {
      return "en";
    }

    if (normalized === "zh-tw") {
      return "zh-tw";
    }

    if (
      normalized === "zh-hant" ||
      normalized.indexOf("zh-hant-") === 0 ||
      normalized.indexOf("zh-tw-") === 0
    ) {
      return "zh-tw";
    }

    return normalized.split("-")[0] === "en" ? "en" : null;
  }

  var browserLanguages = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];
  var locale = "en";

  for (var i = 0; i < browserLanguages.length; i += 1) {
    var match = getLocaleMatch(browserLanguages[i]);

    if (match) {
      locale = match;
      break;
    }
  }

  window.location.replace("/" + locale + "/");
})();
`;

export default function LocaleGatewayPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: rootLocaleRedirectScript }} />
      <SiteShell locale={defaultLocale} dictionary={getDictionary(defaultLocale)}>
        <main className={styles.root}>
          <div className={styles.panel}>
            <div className={styles.eyebrow}>Language</div>
            <h1 className={styles.title}>Entering the site.</h1>
            <p className={styles.description}>Selecting the best language from your browser settings.</p>

            <a className={styles.fallbackLink} href="/en/">
              Continue to English
            </a>
          </div>
        </main>
      </SiteShell>
    </>
  );
}
