import { useId } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type ProgressBarSize = "md" | "sm";
export type ProgressBarTone = "primary" | "success" | "neutral";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ProgressBarSize;
  tone?: ProgressBarTone;
  /** 0 to 100, clamped. Sets the fill and the visible value text (`${value}%`). */
  value?: number;
  label?: string;
  helper?: string;
  showLabel?: boolean;
  showHelper?: boolean;
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function ProgressBar({
  size = "md",
  tone = "primary",
  value = 60,
  label = "Label",
  helper = "Helper text",
  showLabel = true,
  showHelper = true,
  className,
  ...rest
}: ProgressBarProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;
  const current = clamp(value);

  return (
    <div
      className={cn(
        "hz-progressbar",
        size !== "md" && `hz-progressbar--${size}`,
        tone !== "primary" && `hz-progressbar--${tone}`,
        className,
      )}
      {...rest}
    >
      {showLabel && (
        <div className="hz-progressbar__header">
          <span id={labelId} className="hz-progressbar__label">
            {label}
          </span>
          <span className="hz-progressbar__value">{`${current}%`}</span>
        </div>
      )}
      <progress
        className="hz-progressbar__track"
        max={100}
        value={current}
        aria-labelledby={showLabel ? labelId : undefined}
        aria-label={showLabel ? undefined : label}
        aria-describedby={showHelper ? helperId : undefined}
      />
      {showHelper && (
        <span id={helperId} className="hz-progressbar__helper">
          {helper}
        </span>
      )}
    </div>
  );
}

export default ProgressBar;
