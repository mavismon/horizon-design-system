import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type CalendarOccupancyDayState = "empty" | "normal" | "high" | "soldout" | "over";

/** The Figma example text for each state, used when the text props are left out. */
const EXAMPLE: Record<Exclude<CalendarOccupancyDayState, "empty">, { sold: string; percent: string }> = {
  normal: { sold: "38 of 48", percent: "79%" },
  high: { sold: "46 of 48", percent: "96%" },
  soldout: { sold: "48 of 48", percent: "100%" },
  over: { sold: "48 of 48", percent: "100%" },
};

export interface CalendarOccupancyDayProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: CalendarOccupancyDayState;
  /** The day number. Not shown in `empty`. */
  day?: string;
  /** Rooms sold, for example "38 of 48". */
  sold?: string;
  /** Percentage, for example "79%". */
  percent?: string;
}

/** Internal part of Calendar type="occupancy" (Figma `_calendar-occupancy-day`). Not for direct use. */
export function CalendarOccupancyDay({
  state = "empty",
  day = "12",
  sold,
  percent,
  className,
  ...rest
}: CalendarOccupancyDayProps) {
  const example = state === "empty" ? null : EXAMPLE[state];
  return (
    <div className={cn("hz-calendar-occupancy-day", `hz-calendar-occupancy-day--${state}`, className)} {...rest}>
      {state !== "empty" && (
        <>
          <div className="hz-calendar-occupancy-day__top">
            <span className="hz-calendar-occupancy-day__number">{day}</span>
            {state === "over" && <span className="hz-calendar-occupancy-day__tag">over</span>}
          </div>
          {(sold ?? example?.sold) && <span className="hz-calendar-occupancy-day__sold">{sold ?? example?.sold}</span>}
          {(percent ?? example?.percent) && (
            <span className="hz-calendar-occupancy-day__percent">{percent ?? example?.percent}</span>
          )}
        </>
      )}
    </div>
  );
}

export default CalendarOccupancyDay;
