import React from "react";
import { coverSrcSet } from "@/lib/cover-variants";
import styles from "./og-hero-image.module.css";

export const ogHeroImageWidths = [640, 960, 1200, 1600] as const;
export const ogHeroImageSizes = "(max-width: 1152px) calc(100vw - 2rem), 1152px";

type OgHeroImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "decoding" | "fetchPriority" | "loading" | "sizes" | "src" | "srcSet"
> & {
  pictureClassName?: string;
  sizes?: string;
  src: string;
  cover?: { light: string; dark: string };
  loading?: "eager" | "lazy";
};

export function getOgHeroImageSrcSet(src: string) {
  const fileName = src.slice("/og/".length, -".png".length);

  return ogHeroImageWidths
    .map((width) => `/og/heroes/${fileName}-${width}.webp ${width}w`)
    .join(", ");
}

export function OgHeroImage({
  alt,
  className,
  pictureClassName,
  sizes = ogHeroImageSizes,
  src,
  cover,
  loading = "eager",
  ...props
}: OgHeroImageProps) {
  if (cover) {
    const variants = cover.light === cover.dark ? ["light"] : ["light", "dark"];
    return <span className={styles.cover} data-entry-cover="">
      {variants.map((theme) => {
        const prefix = cover[theme as "light" | "dark"];
        return <picture key={theme} className={variants.length === 1 ? undefined : styles[theme]}>
          <source type="image/webp" sizes={sizes} srcSet={coverSrcSet(prefix)} />
          <img {...props} className={className} src={`${prefix}-1200.webp`} alt={alt}
            width={1200} height={742} loading={loading} fetchPriority={loading === "eager" ? "high" : "auto"} decoding="async" />
        </picture>;
      })}
    </span>;
  }
  return (
    <picture className={pictureClassName}>
      <source type="image/webp" srcSet={getOgHeroImageSrcSet(src)} sizes={sizes} />
      <img
        {...props}
        className={className}
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
