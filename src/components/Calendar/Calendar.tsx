import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { CalendarDay } from "./CalendarDay";
import type { CalendarDayState } from "./CalendarDay";
import { CalendarOccupancyDay } from "./CalendarOccupancyDay";
import type { CalendarOccupancyDayState } from "./CalendarOccupancyDay";
import {
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
  longDate,
  monthTitle,
  monthWeeks,
  startOfDay,
  startOfMonth,
  toKey,
  weekdayIndex,
} from "./calendarDates";

export type CalendarType = "picker" | "occupancy";

/** A stay: `start` is the check in day, `end` the check out day. `end` is null while only `start` is chosen. */
export interface CalendarDateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarOccupancyEntry {
  /** Rooms sold. */
  sold: number;
  /** Rooms that exist. */
  total: number;
  /** Shown percentage; defaults to sold / total, rounded. */
  percent?: number;
  /** Defaults from the numbers: sold above total is over, sold equal to total is soldout, above 95% is high. */
  state?: Exclude<CalendarOccupancyDayState, "empty">;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "defaultValue"> {
  /** picker (default): the guest date-range picker. occupancy: the back office month grid. */
  type?: CalendarType;
  /** picker only. The month title text; defaults to the visible month, for example "September 2026". */
  month?: string;
  /** The month shown (any day in it). Controlled. Defaults to the month of `today`. */
  visibleMonth?: Date;
  defaultVisibleMonth?: Date;
  onVisibleMonthChange?: (month: Date) => void;
  /** picker only. The chosen stay. Controlled. */
  value?: CalendarDateRange;
  defaultValue?: CalendarDateRange;
  onChange?: (range: CalendarDateRange) => void;
  /** picker only. Days before this one are `past`. Defaults to the real today. */
  today?: Date;
  /** picker only. Nightly price per day, no currency, keyed YYYY-MM-DD. */
  prices?: Record<string, string>;
  /** picker only. Days that can't be booked are drawn `unavailable` and can't be picked. */
  isDateUnavailable?: (date: Date) => boolean;
  /** occupancy only. Rooms sold per day, keyed YYYY-MM-DD. Days without an entry show only the day number. */
  occupancy?: Record<string, CalendarOccupancyEntry>;
}

const PICKER_WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const OCCUPANCY_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMPTY_RANGE: CalendarDateRange = { start: null, end: null };

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg className="hz-calendar__nav-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M8.75 3 4.75 7l4 4" : "M5.25 3l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Controlled when `value` is given, otherwise keeps its own state. */
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set] as const;
}

function occupancyState(entry: CalendarOccupancyEntry): Exclude<CalendarOccupancyDayState, "empty"> {
  if (entry.state) return entry.state;
  if (entry.sold > entry.total) return "over";
  if (entry.sold === entry.total) return "soldout";
  return entry.sold / entry.total > 0.95 ? "high" : "normal";
}

export function Calendar({
  type = "picker",
  month,
  visibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  value,
  defaultValue = EMPTY_RANGE,
  onChange,
  today,
  prices,
  isDateUnavailable,
  occupancy,
  className,
  ...rest
}: CalendarProps) {
  const titleId = useId();
  const todayDay = startOfDay(today ?? new Date());
  const [shownMonth, setShownMonth] = useControllable<Date>(
    visibleMonth ? startOfMonth(visibleMonth) : undefined,
    startOfMonth(defaultVisibleMonth ?? todayDay),
    onVisibleMonthChange,
  );
  const [range, setRange] = useControllable<CalendarDateRange>(value, defaultValue, onChange);
  const [focusDate, setFocusDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  const weeks = monthWeeks(shownMonth);
  const title = month ?? monthTitle(shownMonth);

  // After a keyboard move that changed the month, focus the new cell once it exists.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const cell = rootRef.current?.querySelector<HTMLElement>(`[data-date="${pendingFocus.current}"]`);
    if (cell) {
      cell.focus();
      pendingFocus.current = null;
    }
  });

  if (type === "occupancy") {
    return (
      <div
        ref={rootRef}
        role="grid"
        aria-label={rest["aria-label"] ?? `Occupancy, ${title}`}
        className={cn("hz-calendar", "hz-calendar--occupancy", className)}
        {...rest}
      >
        <div role="row" className="hz-calendar__weekdays">
          {OCCUPANCY_WEEKDAYS.map((w) => (
            <div key={w} role="columnheader" className="hz-calendar__weekday">
              {w}
            </div>
          ))}
        </div>
        <div className="hz-calendar__divider" aria-hidden="true" />
        <div role="rowgroup" className="hz-calendar__days">
          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="hz-calendar__week">
              {week.map((date, di) => {
                if (!date) return <CalendarOccupancyDay key={di} state="empty" role="gridcell" aria-hidden="true" />;
                const entry = occupancy?.[toKey(date)];
                if (!entry) {
                  return (
                    <CalendarOccupancyDay key={di} state="normal" day={String(date.getDate())} sold="" percent="" role="gridcell" />
                  );
                }
                const percent = entry.percent ?? Math.round((entry.sold / entry.total) * 100);
                return (
                  <CalendarOccupancyDay
                    key={di}
                    role="gridcell"
                    state={occupancyState(entry)}
                    day={String(date.getDate())}
                    sold={`${entry.sold} of ${entry.total}`}
                    percent={`${percent}%`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { start, end } = range;
  const unavailable = (d: Date) => !!isDateUnavailable?.(d);
  const isPast = (d: Date) => d.getTime() < todayDay.getTime();
  const selectable = (d: Date) => !isPast(d) && !unavailable(d);

  const stateOf = (d: Date): CalendarDayState => {
    if (isSameDay(d, start)) return "start";
    if (isSameDay(d, end)) return "end";
    if (start && end && d > start && d < end) return "in-range";
    if (isPast(d)) return "past";
    if (unavailable(d)) return "unavailable";
    if (isSameDay(d, todayDay)) return "today";
    return "available";
  };

  const select = (d: Date) => {
    if (!selectable(d)) return;
    if (!start || end || d <= start) {
      setRange({ start: d, end: null });
      return;
    }
    for (let n = addDays(start, 1); n < d; n = addDays(n, 1)) {
      if (unavailable(n)) {
        setRange({ start: d, end: null });
        return;
      }
    }
    setRange({ start, end: d });
  };

  const goToMonth = (next: Date) => setShownMonth(startOfMonth(next));

  // The one cell in the tab order: the focused day, else the check in day, else today, else the 1st.
  const inMonth = (d: Date | null | undefined): d is Date => !!d && isSameMonth(d, shownMonth);
  const tabbable =
    [focusDate, start, todayDay].find(inMonth) ?? new Date(shownMonth.getFullYear(), shownMonth.getMonth(), 1);

  const onDayKeyDown = (e: KeyboardEvent<HTMLDivElement>, date: Date) => {
    let target: Date | null = null;
    switch (e.key) {
      case "ArrowLeft": target = addDays(date, -1); break;
      case "ArrowRight": target = addDays(date, 1); break;
      case "ArrowUp": target = addDays(date, -7); break;
      case "ArrowDown": target = addDays(date, 7); break;
      case "Home": target = addDays(date, -weekdayIndex(date)); break;
      case "End": target = addDays(date, 6 - weekdayIndex(date)); break;
      case "PageUp": target = addMonths(date, e.shiftKey ? -12 : -1); break;
      case "PageDown": target = addMonths(date, e.shiftKey ? 12 : 1); break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(date);
        return;
      default:
        return;
    }
    e.preventDefault();
    setFocusDate(target);
    pendingFocus.current = toKey(target);
    if (!isSameMonth(target, shownMonth)) goToMonth(target);
    else {
      rootRef.current?.querySelector<HTMLElement>(`[data-date="${toKey(target)}"]`)?.focus();
      pendingFocus.current = null;
    }
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-labelledby={titleId}
      className={cn("hz-calendar", "hz-calendar--picker", className)}
      {...rest}
    >
      <div className="hz-calendar__header">
        <button
          type="button"
          className="hz-calendar__nav"
          aria-label="Previous month"
          onClick={() => goToMonth(addMonths(shownMonth, -1))}
        >
          <ChevronIcon direction="left" />
        </button>
        <div id={titleId} className="hz-calendar__title" aria-live="polite">
          {title}
        </div>
        <button
          type="button"
          className="hz-calendar__nav"
          aria-label="Next month"
          onClick={() => goToMonth(addMonths(shownMonth, 1))}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
      <div role="grid" aria-labelledby={titleId} className="hz-calendar__grid">
        <div role="row" className="hz-calendar__weekdays">
          {PICKER_WEEKDAYS.map((w) => (
            <div key={w} role="columnheader" className="hz-calendar__weekday">
              {w}
            </div>
          ))}
        </div>
        <div role="rowgroup" className="hz-calendar__days">
          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="hz-calendar__week">
              {week.map((date, di) => {
                if (!date) return <CalendarDay key={di} state="empty" role="gridcell" aria-hidden="true" />;
                const state = stateOf(date);
                const price = prices?.[toKey(date)];
                const disabled = !selectable(date);
                return (
                  <CalendarDay
                    key={di}
                    state={state}
                    day={String(date.getDate())}
                    price={price ?? ""}
                    role="gridcell"
                    data-date={toKey(date)}
                    tabIndex={isSameDay(date, tabbable) ? 0 : -1}
                    aria-selected={state === "start" || state === "end" || state === "in-range"}
                    aria-disabled={disabled || undefined}
                    aria-current={isSameDay(date, todayDay) ? "date" : undefined}
                    aria-label={`${longDate(date)}${price ? `, price ${price}` : ""}${state === "start" ? ", check in" : state === "end" ? ", check out" : ""}`}
                    onClick={() => select(date)}
                    onFocus={() => setFocusDate(date)}
                    onKeyDown={(e) => onDayKeyDown(e, date)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
