// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1647 (canvas page "Calendar")
// Component set: node 235:392 (calendar). Cells: 235:2 type=picker (536x340), 235:137 type=occupancy (1170x645).
// Parts: _calendar-day 234:29 (empty 234:5, past 234:8, available 234:11, today 234:14, unavailable 234:17,
// start 234:20, in-range 234:23, end 234:26; each 64x40), _calendar-occupancy-day 234:65 (empty 234:30,
// normal 234:37, high 234:44, soldout 234:51, over 234:58; each 158x90). Specimens: "Web: two months"
// 236:265 and 236:400 (536x340 each), board 233:1147. Usage frame: 236:573.
// Figma properties: type (picker | occupancy); Month text (picker title) maps to `month`. The day parts'
// state, day and price (and sold / percent on the occupancy parts) are layer overrides in Figma.
// Not Figma properties (added so the picker is usable): value / defaultValue / onChange (the stay),
// visibleMonth / defaultVisibleMonth / onVisibleMonthChange, today, prices, isDateUnavailable,
// occupancy, plus passthrough div attributes. Day states are derived from these, never set by hand.
// Figma draws no hover or pressed state; keyboard focus shows the focus-border ring.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./Calendar";
import type { CalendarDateRange, CalendarOccupancyEntry } from "./Calendar";
import { CalendarDay } from "./CalendarDay";
import { CalendarOccupancyDay } from "./CalendarOccupancyDay";
import { addMonths } from "./calendarDates";

const USAGE = `
**Use a calendar**
- Use type picker for guests to choose check in and check out, with the nightly price under each day; show two months side by side on web and one on mobile.
- Use type occupancy in the back office to see how full each day of a month is: rooms sold, the percentage, and sold-out days in navy.
- Mark a stay with start and end on the check in and check out days, and in-range on the nights between.

**Do not use a calendar**
- For a single known date such as a date of birth: use a date field.
- To pick a time range for a report, such as the last 7 days: use Buttongroup type segmented.
- To list bookings or events by day: use a Table.

**Best practice**
- Grey out past days and strike through days that can't be booked, so people never pick a date that fails later.
- Keep the price short with no currency on each day, and show the currency once nearby.
- In occupancy, explain the colours under the grid, such as "Navy is sold out. Red percentages are above 95%."

**Keyboard (picker)**: Tab enters the grid on the check in day (or today); arrow keys move by day and week, Home and End jump to the start and end of the week, PageUp and PageDown change the month (with Shift, the year), Enter or Space picks the day.
`;

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { docs: { description: { component: USAGE } } },
  args: { type: "picker" },
  argTypes: { type: { control: "inline-radio", options: ["picker", "occupancy"] } },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

/* ---- Figma example data: September 2026 (picker) and August 2026 (occupancy) ---- */

const SEPTEMBER = new Date(2026, 8, 1);
const AUGUST = new Date(2026, 7, 1);

const PICKER_PRICES: Record<string, string> = Object.fromEntries(
  Object.entries({
    9: "101", 10: "121", 11: "121", 12: "118", 13: "126", 14: "121", 15: "121", 16: "121", 17: "121", 18: "132",
    19: "148", 20: "152", 21: "110", 22: "108", 25: "119", 26: "140", 27: "156", 28: "102", 29: "99", 30: "104",
  }).map(([d, p]) => [`2026-09-${d.padStart(2, "0")}`, p]),
);

const FIGMA_PICKER = {
  visibleMonth: SEPTEMBER,
  today: new Date(2026, 8, 9),
  prices: PICKER_PRICES,
  isDateUnavailable: (d: Date) => d.getMonth() === 8 && (d.getDate() === 23 || d.getDate() === 24),
};
const FIGMA_RANGE: CalendarDateRange = { start: new Date(2026, 8, 14), end: new Date(2026, 8, 18) };

// day: [rooms sold of 48, percentage as drawn]; Figma's own numbers, kept as drawn.
const OCCUPANCY_DRAWN: Array<[number, number]> = [
  [38, 79], [40, 83], [34, 71], [46, 96], [48, 100], [48, 100], [42, 88], [44, 92], [41, 85], [37, 77],
  [43, 90], [49, 102], [48, 100], [48, 100], [47, 97], [39, 81], [36, 74], [33, 69], [35, 72], [38, 80],
  [45, 94], [47, 98], [41, 86], [34, 70], [31, 65], [33, 68], [36, 75], [43, 89], [45, 93], [48, 99], [40, 84],
];
const FIGMA_OCCUPANCY: Record<string, CalendarOccupancyEntry> = Object.fromEntries(
  OCCUPANCY_DRAWN.map(([sold, percent], i) => [
    `2026-08-${String(i + 1).padStart(2, "0")}`,
    // Figma draws 30 August as "48 of 48, 99%" in the high (red) style, not soldout.
    { sold, total: 48, percent, ...(i === 29 ? { state: "high" as const } : {}) },
  ]),
);

/* ---- Figma cells ---- */

// type=picker (node 235:2): September 2026, 9 September is today, 14 to 18 is the stay.
export const Picker: Story = { args: { type: "picker", ...FIGMA_PICKER, defaultValue: FIGMA_RANGE } };

// type=occupancy (node 235:137): August 2026.
export const Occupancy: Story = { args: { type: "occupancy", visibleMonth: AUGUST, occupancy: FIGMA_OCCUPANCY } };

// Specimen "Web: two months" (nodes 236:265 and 236:400): two pickers side by side that share the stay.
export const PickerTwoMonths: Story = {
  render: () => {
    const [base, setBase] = useState(SEPTEMBER);
    const [range, setRange] = useState<CalendarDateRange>(FIGMA_RANGE);
    const shared = { ...FIGMA_PICKER, value: range, onChange: setRange };
    return (
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <Calendar {...shared} visibleMonth={base} onVisibleMonthChange={setBase} />
        <Calendar {...shared} visibleMonth={addMonths(base, 1)} onVisibleMonthChange={(m) => setBase(addMonths(m, -1))} />
      </div>
    );
  },
};

/* ---- _calendar-day (node 234:29), one story per state ---- */

const Part = ({ children }: { children: React.ReactNode }) => <div style={{ width: 64 }}>{children}</div>;

export const DayEmpty: Story = { render: () => <Part><CalendarDay state="empty" /></Part> };
export const DayPast: Story = { render: () => <Part><CalendarDay state="past" day="7" price="" /></Part> };
export const DayAvailable: Story = { render: () => <Part><CalendarDay state="available" day="10" price="121" /></Part> };
export const DayToday: Story = { render: () => <Part><CalendarDay state="today" day="9" price="101" /></Part> };
export const DayUnavailable: Story = { render: () => <Part><CalendarDay state="unavailable" day="23" price="" /></Part> };
export const DayStart: Story = { render: () => <Part><CalendarDay state="start" day="14" price="121" /></Part> };
export const DayInRange: Story = { render: () => <Part><CalendarDay state="in-range" day="15" price="121" /></Part> };
export const DayEnd: Story = { render: () => <Part><CalendarDay state="end" day="18" price="132" /></Part> };

/* ---- _calendar-occupancy-day (node 234:65), one story per state ---- */

const OccPart = ({ children }: { children: React.ReactNode }) => <div style={{ width: 158 }}>{children}</div>;

export const OccupancyDayEmpty: Story = { render: () => <OccPart><CalendarOccupancyDay state="empty" /></OccPart> };
export const OccupancyDayNormal: Story = { render: () => <OccPart><CalendarOccupancyDay state="normal" /></OccPart> };
export const OccupancyDayHigh: Story = { render: () => <OccPart><CalendarOccupancyDay state="high" /></OccPart> };
export const OccupancyDaySoldout: Story = { render: () => <OccPart><CalendarOccupancyDay state="soldout" /></OccPart> };
export const OccupancyDayOver: Story = { render: () => <OccPart><CalendarOccupancyDay state="over" /></OccPart> };

/* ---- Real interaction ---- */

/** Uncontrolled: nothing is set up, so it opens on the current month with every future day available. Click a check in day, then a check out day; click again to start over. */
export const PickerUncontrolled: Story = { args: { type: "picker" } };

/** Controlled: the chosen stay and the shown month live in this story. Tab into the grid, move with the arrow keys, pick with Enter or Space; PageUp and PageDown change the month. */
export const PickerControlled: Story = {
  render: () => {
    const [range, setRange] = useState<CalendarDateRange>({ start: null, end: null });
    const [month, setMonth] = useState(SEPTEMBER);
    const fmt = (d: Date | null) => (d ? d.toDateString() : "none");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Calendar {...FIGMA_PICKER} value={range} onChange={setRange} visibleMonth={month} onVisibleMonthChange={setMonth} />
        <output>
          Check in: {fmt(range.start)}. Check out: {fmt(range.end)}.
        </output>
      </div>
    );
  },
};
