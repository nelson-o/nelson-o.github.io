import React from "react";

import Link from "next/link";

import styles from "@/app/not-found.module.css";
import { getHrefWithLocale } from "@/lib/i18n";

type NotFoundContentProps = {
  homeHref?: string;
};

export function NotFoundContent({ homeHref = getHrefWithLocale("en", "/") }: NotFoundContentProps) {
  return (
    <section className={styles.panel} aria-labelledby="not-found-title">
      <div className={styles.eyebrow}>404</div>
      <h1 id="not-found-title" className={styles.title}>
        Page not found
      </h1>
      <p className={styles.description}>
        The page you asked for does not exist or is not published yet.
      </p>

      <div className={styles.actions}>
        <Link className={styles.primaryAction} href={homeHref}>
          Go back home
        </Link>
        <Link className={styles.secondaryAction} href={getHrefWithLocale("en", "/systems")}>
          Browse systems
        </Link>
      </div>
    </section>
  );
}
