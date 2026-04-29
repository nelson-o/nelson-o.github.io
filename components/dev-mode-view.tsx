import React from "react";
import Link from "next/link";

import styles from "@/components/dev-mode-view.module.css";

export function DevModeView() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backLink}>
        Back to home
      </Link>

      <div className={styles.frame}>
        <img className={styles.image} src="/dev-mode/city.png" alt="City view" />
      </div>
    </main>
  );
}
