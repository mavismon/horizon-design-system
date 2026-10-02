import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type ToggleSize = "md" | "sm";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "role" | "children"> {
  /** md 44x24 (default), sm 40x22. */
  size?: ToggleSize;
}

export function Toggle({ size = "md", className, ...rest }: ToggleProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={cn("hz-toggle", `hz-toggle--${size}`, className)}
      {...rest}
    />
  );
}

export default Toggle;
