export const MS_PER_DAY = 86_400_000;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Moves by whole months and clamps the day (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** YYYY-MM-DD in local time; the key used by `prices` and `occupancy`. */
export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Monday = 0 ... Sunday = 6. */
export function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** The month as weeks of seven cells, Monday first; null pads before and after the month. */
export function monthWeeks(month: Date): Array<Array<Date | null>> {
  const first = startOfMonth(month);
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: weekdayIndex(first) }, () => null);
  for (let i = 1; i <= count; i++) cells.push(new Date(first.getFullYear(), first.getMonth(), i));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<Array<Date | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const MONTH_TITLE = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
export function monthTitle(d: Date): string {
  return MONTH_TITLE.format(d);
}

const LONG_DATE = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export function longDate(d: Date): string {
  return LONG_DATE.format(d);
}
