"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { privacyConfig } from "@/lib/privacy/config";
import { consentAvailable, renewConsent, subscribeConsent } from "@/lib/privacy/consent";
import { consentCulture, privacyCopy, privacyLocale } from "@/lib/privacy/copy";
import { startPrivacy } from "@/lib/privacy/runtime";
import styles from "./privacy.module.css";

export function PrivacyControls({ paths }: { paths: string[] }) {
  const pathname = usePathname();
  const locale = privacyLocale(pathname ?? "/");
  const copy = privacyCopy[locale];
  const initialLocale = useRef(locale);
  const initialPaths = useRef(paths);
  const runtime = useRef<ReturnType<typeof startPrivacy> | null>(null);
  const ready = useSyncExternalStore(subscribeConsent, consentAvailable, () => false);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    runtime.current = startPrivacy(privacyConfig, initialPaths.current, consentCulture(initialLocale.current));
    return () => runtime.current?.stop();
  }, []);

  useEffect(() => {
    if (ready && locale !== initialLocale.current) {
      // Cookiebot culture is chosen when its SDK initializes.
      location.reload();
      return;
    }
    runtime.current?.pageView();
  }, [pathname, locale, ready]);

  return (
    <aside className={styles.controls} aria-label={copy.title} data-privacy-controls>
      <Link href={`/${locale}/privacy/`}>{copy.title}</Link>
      <button type="button" onClick={() => { if (ready) renewConsent(); else setMessage(!message); }}>
        {copy.settings}
      </button>
      {message && !ready && <p role="status">{copy.unavailable}</p>}
    </aside>
  );
}
