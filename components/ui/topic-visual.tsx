import React from "react";

import { OgHeroImage } from "@/components/ui/og-hero-image";
import styles from "@/components/ui/topic-visual.module.css";

type TopicVisualProps = {
  images: readonly string[];
};

export function TopicVisual({ images }: TopicVisualProps) {
  const source = images[0];
  if (!source) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.frame}>
          <OgHeroImage
            pictureClassName={styles.picture}
            className={styles.image}
            src={source}
            alt=""
          />
      </div>
    </div>
  );
}
