"use client";

import { useEffect, useState } from "react";

import styles from "@/components/ui/topic-visual.module.css";

type TopicVisualProps = {
  images: readonly string[];
};

export function TopicVisual({ images }: TopicVisualProps) {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * images.length);
    setSource(images[index]);
  }, [images]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.frame}>
        {source ? (
          <img className={styles.image} src={source} alt="" loading="eager" decoding="async" />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
    </div>
  );
}
