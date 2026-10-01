import type { ImgHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type ImageRatio = "4:3" | "1:1" | "3:2" | "16:9" | "2:1";
export type ImageRadius = "none" | "sm" | "md";

const RATIO_CLASS: Record<ImageRatio, string> = {
  "4:3": "hz-image--ratio-4-3",
  "1:1": "hz-image--ratio-1-1",
  "3:2": "hz-image--ratio-3-2",
  "16:9": "hz-image--ratio-16-9",
  "2:1": "hz-image--ratio-2-1",
};

const RADIUS_CLASS: Record<ImageRadius, string> = {
  none: "hz-image--radius-none",
  sm: "hz-image--radius-sm",
  md: "hz-image--radius-md",
};

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  ratio?: ImageRatio;
  radius?: ImageRadius;
}

export function Image({
  ratio = "4:3",
  radius = "none",
  alt = "",
  className,
  ...rest
}: ImageProps) {
  return (
    <img
      alt={alt}
      className={cn("hz-image", RATIO_CLASS[ratio], RADIUS_CLASS[radius], className)}
      {...rest}
    />
  );
}

export default Image;
