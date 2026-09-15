import Image, { type ImageProps } from "next/image";

type CmsImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function isBundledImage(src: string) {
  return src.startsWith("/images/") || src.startsWith("/profile");
}

export default function CmsImage({ src, alt, className, fill, sizes, priority }: CmsImageProps) {
  if (!src) return null;

  if (!isBundledImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
