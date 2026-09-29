import React from "react";

import styles from "@/app/page.module.css";
import { SiteShell } from "@/components/layout/site-shell";
import { defaultLocale, getDictionary, locales } from "@/lib/i18n";
import { languageStorageKey } from "@/lib/profile-language";

const rootLocaleRedirectScript = `
(function () {
  // A language saved from the settings wins over the browser languages (#84).
  var saved = null;

  try {
    saved = localStorage.getItem(${JSON.stringify(languageStorageKey)});
  } catch (error) {
    saved = null;
  }

  function normalizeLanguage(value) {
    return String(value || "").toLowerCase().replace(/_/g, "-");
  }

  function getLocaleMatch(language) {
    var parts = normalizeLanguage(language).split("-");

    if (parts[0] === "en" || parts[0] === "ja") {
      return parts[0];
    }

    if (parts[0] !== "zh") {
      return null;
    }

    // A script subtag decides before the region: zh-Hant-SG is Traditional.
    if (parts[1] === "hant" || parts[1] === "tw" || parts[1] === "hk") {
      return "zh-tw";
    }

    if (parts[1] === "hans" || parts[1] === "cn" || parts[1] === "sg") {
      return "zh-cn";
    }

    return null;
  }

  var browserLanguages = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];
  var locale = "en";
  var siteLocales = ${JSON.stringify(locales)};

  if (saved && siteLocales.indexOf(saved) !== -1) {
    window.location.replace("/" + saved + "/");
    return;
  }

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

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className={styles.fallbackLink} href="/en/">
              Continue to English
            </a>
          </div>
        </main>
      </SiteShell>
    </>
  );
}
