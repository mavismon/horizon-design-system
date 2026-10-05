import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type CalendarDayState =
  | "empty"
  | "past"
  | "available"
  | "today"
  | "unavailable"
  | "start"
  | "in-range"
  | "end";

/** States that show the nightly price under the day number. */
const SHOWS_PRICE: CalendarDayState[] = ["available", "today", "start", "in-range", "end"];

export interface CalendarDayProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: CalendarDayState;
  /** The day number. Not shown in `empty`. */
  day?: string;
  /** Nightly price, no currency. Shown in available, today, start, in-range and end; left out when empty. */
  price?: string;
}

/** Internal part of Calendar type="picker" (Figma `_calendar-day`). Not for direct use. */
export function CalendarDay({ state = "empty", day = "14", price = "121", className, ...rest }: CalendarDayProps) {
  return (
    <div className={cn("hz-calendar-day", `hz-calendar-day--${state}`, className)} {...rest}>
      {state !== "empty" && <span className="hz-calendar-day__number">{day}</span>}
      {SHOWS_PRICE.includes(state) && price !== "" && <span className="hz-calendar-day__price">{price}</span>}
    </div>
  );
}

export default CalendarDay;
