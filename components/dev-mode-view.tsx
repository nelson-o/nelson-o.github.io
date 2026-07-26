import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "@/components/dev-mode-view.module.css";

export function DevModeView() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backLink}>
        Back to home
      </Link>

      <div className={styles.frame}>
        <Image
          className={styles.image}
          src="/dev-mode/city.png"
          alt="City view"
          width={1536}
          height={1024}
          sizes="100vw"
          unoptimized
        />
      </div>
    </main>
  );
}
