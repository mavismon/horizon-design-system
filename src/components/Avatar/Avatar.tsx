import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: "hz-avatar--sm",
  md: "hz-avatar--md",
  lg: "hz-avatar--lg",
};

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
}

export function Avatar({ size = "sm", src, alt = "", className, ...rest }: AvatarProps) {
  return (
    <span className={cn("hz-avatar", SIZE_CLASS[size], className)} {...rest}>
      {src && <img src={src} alt={alt} className="hz-avatar__image" />}
    </span>
  );
}

export default Avatar;
