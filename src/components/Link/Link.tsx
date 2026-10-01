import type { AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type LinkSize = "md" | "sm";
export type LinkState = "default" | "hover";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  size?: LinkSize;
  state?: LinkState;
  label?: string;
}

export function Link({
  size = "md",
  state = "default",
  label = "Link",
  className,
  ...rest
}: LinkProps) {
  return (
    <a
      className={cn(
        "hz-link",
        size !== "md" && `hz-link--${size}`,
        state === "hover" && "hz-link--hover",
        className,
      )}
      {...rest}
    >
      {label}
    </a>
  );
}

export default Link;
