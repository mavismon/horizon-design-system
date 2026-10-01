import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  label?: string;
  showLabel?: boolean;
}

export function Checkbox({
  label = "Label",
  showLabel = true,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <label className={cn("hz-checkbox", className)}>
      <span className="hz-checkbox__box">
        <input type="checkbox" className="hz-checkbox__input" {...rest} />
        <svg
          className="hz-checkbox__tick"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3.5 8L6.5 11L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {showLabel && <span className="hz-checkbox__label">{label}</span>}
    </label>
  );
}

export default Checkbox;
