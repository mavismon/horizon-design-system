import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type ChipState = "unselected" | "selected" | "selected-strong";

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  state?: ChipState;
  label?: string;
}

export function Chip({
  state = "unselected",
  label = "Label",
  className,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={state !== "unselected"}
      className={cn("hz-chip", state !== "unselected" && `hz-chip--${state}`, className)}
      {...rest}
    >
      {label}
    </button>
  );
}

export default Chip;
