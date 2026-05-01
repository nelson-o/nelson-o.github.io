import React from "react";

import { NotFoundContent } from "@/components/layout/not-found-content";
import { themeScript } from "@/lib/theme";

import "./globals.css";
import styles from "@/app/global-not-found.module.css";
import panelStyles from "@/app/not-found.module.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
      </head>
      <body className={styles.body}>
        <main className={panelStyles.root}>
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
