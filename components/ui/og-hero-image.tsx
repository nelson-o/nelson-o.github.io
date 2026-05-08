import React from "react";

export const ogHeroImageWidths = [640, 960, 1200, 1600] as const;
export const ogHeroImageSizes = "(max-width: 1152px) calc(100vw - 2rem), 1152px";

type OgHeroImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "decoding" | "fetchPriority" | "loading" | "sizes" | "src" | "srcSet"
> & {
  pictureClassName?: string;
  sizes?: string;
  src: string;
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
  ...props
}: OgHeroImageProps) {
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
