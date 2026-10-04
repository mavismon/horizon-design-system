import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type RadioCardState = "unselected" | "selected" | "disabled";

export interface RadioCardProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "title" | "checked" | "defaultChecked" | "disabled"
  > {
  /** unselected (default), selected or disabled. Controlled: the parent group owns which card is selected. */
  state?: RadioCardState;
  title?: string;
  description?: string;
  showDescription?: boolean;
  showTrailing?: boolean;
  trailing?: string;
}

export function RadioCard({
  state = "unselected",
  title = "Whole apartment · 2 bedrooms",
  description = "Sleeps 4 · free cancellation until 12 Sep",
  showDescription = true,
  showTrailing = true,
  trailing = "484.00 EUR",
  className,
  onChange,
  ...rest
}: RadioCardProps) {
  return (
    <label className={cn("hz-radiocard", `hz-radiocard--${state}`, className)}>
      <input
        type="radio"
        className="hz-radiocard__input"
        checked={state === "selected"}
        disabled={state === "disabled"}
        onChange={onChange ?? (() => {})}
        {...rest}
      />
      <span className="hz-radiocard__radio" aria-hidden="true" />
      <span className="hz-radiocard__text">
        <span className="hz-radiocard__title">{title}</span>
        {showDescription && <span className="hz-radiocard__description">{description}</span>}
      </span>
      {showTrailing && <span className="hz-radiocard__trailing">{trailing}</span>}
    </label>
  );
}

export default RadioCard;
