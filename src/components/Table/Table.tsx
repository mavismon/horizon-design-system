import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Link } from "../Link/Link";

/** Figma tag tone. */
export type TableTone = "success" | "neutral" | "error" | "warning" | "info";
/** Figma `_table-cell` type, minus header and checkbox (the table draws those itself). */
export type TableCellType = "primary" | "text" | "tag" | "action";
/** Figma `_table-row` state, minus header and selected (header is the head row; selected is `selected`). */
export type TableRowState = "default" | "hover";
export type TableSortDirection = "ascending" | "descending";

export interface TableTag {
  label: string;
  tone?: TableTone;
}

export interface TableAction {
  label: string;
  /** Not a Figma property. Where the action goes. */
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type TableCellValue = string | TableTag | TableAction | Array<string | TableAction>;

export interface TableColumn {
  key: string;
  /** Figma header cell text. */
  header: string;
  /** Figma `_table-cell` type. Defaults to "text". Use "primary" for the first column. */
  type?: TableCellType;
  /** Figma header `ShowSort`: draws the sort arrow and makes the header a button. */
  sortable?: boolean;
  /** Column width in px. Defaults to the width Figma draws for that cell type. */
  width?: number;
}

export interface TableRowData {
  id: string;
  /** Cell values by column key. */
  cells: Record<string, TableCellValue>;
  /** Figma `_table-row` state=selected (light blue row, checkbox ticked). Initial value. */
  selected?: boolean;
  /** Figma state=default or hover. Hover is also drawn by :hover; this prop pins it for a specimen. */
  state?: TableRowState;
}

export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Figma draws 6 columns: primary, three text, tag, action. Defaults to those. */
  columns?: TableColumn[];
  /** Figma draws 5 rows plus the header. Defaults to the 5 drawn. */
  rows?: TableRowData[];
  /** Figma draws the checkbox column (default true). Turn off when people never act on several rows at once. */
  selectable?: boolean;
  /** Figma `ShowFooter` (default true). */
  showFooter?: boolean;
  /** Figma footer `Summary` (default "Showing 1 to 5 of 7 seasons"). */
  summary?: string;
  /** Not a Figma property. Which column is sorted, drawn as aria-sort on its header. */
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  /** Called with the ids of every selected row after a checkbox changes. */
  onSelectionChange?: (selectedIds: string[]) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Not a Figma state. Disables the Previous button (first page). */
  previousDisabled?: boolean;
  /** Not a Figma state. Disables the Next button (last page). */
  nextDisabled?: boolean;
  /** Not a Figma property. Accessible name of the table. */
  tableLabel?: string;
}

/** Widths Figma draws for each `_table-cell` type. */
const DEFAULT_WIDTH: Record<TableCellType, number> = {
  primary: 268,
  text: 180,
  tag: 140,
  action: 176,
};
const CHECKBOX_WIDTH = 48;

export const DEFAULT_COLUMNS: TableColumn[] = [
  { key: "season", header: "Season", type: "primary", sortable: true },
  { key: "dates", header: "Dates" },
  { key: "appliesTo", header: "Applies to" },
  { key: "change", header: "Change" },
  { key: "status", header: "Status", type: "tag" },
  { key: "actions", header: "", type: "action" },
];

export const DEFAULT_ROWS: TableRowData[] = [
  {
    id: "summer-peak",
    cells: {
      season: "Summer peak",
      dates: "1 Jul to 31 Aug 2026",
      appliesTo: "All room types",
      change: "+28%",
      status: { label: "Live", tone: "success" },
      actions: "Edit",
    },
  },
  {
    id: "sao-joao",
    cells: {
      season: "Sao Joao festival",
      dates: "22 to 25 Jun 2026",
      appliesTo: "All room types",
      change: "+95%",
      status: { label: "Past", tone: "neutral" },
      actions: "Edit",
    },
  },
  {
    id: "september-shoulder",
    cells: {
      season: "September shoulder",
      dates: "1 to 30 Sep 2026",
      appliesTo: "All room types",
      change: "+8%",
      status: { label: "Upcoming", tone: "info" },
      actions: "Edit",
    },
  },
  {
    id: "web-summit",
    cells: {
      season: "Web Summit",
      dates: "2 to 6 Nov 2026",
      appliesTo: "Suites only",
      change: "+140%",
      status: { label: "Upcoming", tone: "info" },
      actions: "Edit",
    },
  },
  {
    id: "january-low",
    cells: {
      season: "January low",
      dates: "4 to 31 Jan 2027",
      appliesTo: "All room types",
      change: "-24%",
      status: { label: "Draft", tone: "neutral" },
      actions: "Edit",
    },
  },
];

function plainText(value: TableCellValue | undefined): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => (typeof v === "string" ? v : v.label)).join(" ");
  return value.label;
}

function renderCell(type: TableCellType, value: TableCellValue | undefined): ReactNode {
  if (value === undefined) return null;
  if (type === "tag") {
    const tag: TableTag = typeof value === "string" ? { label: value } : (value as TableTag);
    return (
      <span className={cn("hz-table__tag", `hz-table__tag--${tag.tone ?? "success"}`)}>{tag.label}</span>
    );
  }
  if (type === "action") {
    const actions = Array.isArray(value) ? value : [value];
    return (
      <span className="hz-table__actions">
        {actions.map((action, index) => {
          const item: TableAction = typeof action === "string" ? { label: action } : (action as TableAction);
          return (
            <Link
              key={`${item.label}-${index}`}
              size="sm"
              label={item.label}
              href={item.href ?? "#"}
              onClick={item.onClick}
              className="hz-table__action"
            />
          );
        })}
      </span>
    );
  }
  return plainText(value);
}

function SortIcon({ direction }: { direction?: TableSortDirection }) {
  return (
    <svg
      className={cn("hz-table__sort-icon", direction === "ascending" && "hz-table__sort-icon--ascending")}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 3.5L5 6.5L8 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Table({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  selectable = true,
  showFooter = true,
  summary = "Showing 1 to 5 of 7 seasons",
  sort,
  onSortChange,
  onSelectionChange,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  tableLabel = "Data table",
  className,
  ...rest
}: TableProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(rows.filter((row) => row.selected).map((row) => row.id)),
  );

  const commit = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.(rows.filter((row) => next.has(row.id)).map((row) => row.id));
  };

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    commit(next);
  };

  const toggleAll = (checked: boolean) => {
    commit(checked ? new Set(rows.map((row) => row.id)) : new Set());
  };

  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const primaryKey = (columns.find((column) => column.type === "primary") ?? columns[0])?.key;

  return (
    <div className={cn("hz-table", className)} {...rest}>
      <div className="hz-table__scroll">
        <table className="hz-table__table" aria-label={tableLabel}>
          <colgroup>
            {selectable && <col style={{ width: CHECKBOX_WIDTH }} />}
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width ?? DEFAULT_WIDTH[column.type ?? "text"] }} />
            ))}
          </colgroup>
          <thead>
            <tr className="hz-table__row hz-table__row--header">
              {selectable && (
                <th scope="col" className="hz-table__cell hz-table__cell--header hz-table__cell--checkbox">
                  <Checkbox
                    showLabel={false}
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => {
                const active = sort?.key === column.key ? sort.direction : undefined;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className="hz-table__cell hz-table__cell--header"
                    aria-sort={column.sortable ? (active ?? "none") : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="hz-table__sort"
                        onClick={() =>
                          onSortChange?.({
                            key: column.key,
                            direction: active === "ascending" ? "descending" : "ascending",
                          })
                        }
                      >
                        <span>{column.header}</span>
                        <SortIcon direction={active} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = selected.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "hz-table__row",
                    isSelected && "hz-table__row--selected",
                    !isSelected && row.state === "hover" && "hz-table__row--hover",
                  )}
                >
                  {selectable && (
                    <td className="hz-table__cell hz-table__cell--checkbox">
                      <Checkbox
                        showLabel={false}
                        aria-label={`Select ${plainText(row.cells[primaryKey])}`}
                        checked={isSelected}
                        onChange={(event) => toggleRow(row.id, event.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const type = column.type ?? "text";
                    const content = renderCell(type, row.cells[column.key]);
                    return type === "primary" ? (
                      <th
                        key={column.key}
                        scope="row"
                        className="hz-table__cell hz-table__cell--primary"
                      >
                        <span className="hz-table__truncate">{content}</span>
                      </th>
                    ) : (
                      <td key={column.key} className={cn("hz-table__cell", `hz-table__cell--${type}`)}>
                        {type === "text" ? <span className="hz-table__truncate">{content}</span> : content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showFooter && (
        <div className="hz-table__footer">
          <p className="hz-table__summary" aria-live="polite">
            {summary}
          </p>
          <nav className="hz-table__pagination" aria-label="Pagination">
            <Button
              className="hz-table__page-button"
              state="outline"
              text="Previous"
              startIcon={false}
              endIcon={false}
              disabled={previousDisabled}
              onClick={onPrevious}
            />
            <Button
              className="hz-table__page-button"
              state="outline"
              text="Next"
              startIcon={false}
              endIcon={false}
              disabled={nextDisabled}
              onClick={onNext}
            />
          </nav>
        </div>
      )}
    </div>
  );
}

export default Table;
