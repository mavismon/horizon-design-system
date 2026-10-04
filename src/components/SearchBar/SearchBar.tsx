import { Fragment, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";

export type SearchBarType = "field" | "stay";
export type SearchBarSize = "md" | "lg";
export type SearchBarState = "empty" | "focused" | "filled";

export interface SearchBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Figma `type`. `field` is the search input; `stay` is the website stay search. */
  type?: SearchBarType;
  /** Figma `size` (field only). md is 36px (web, back office); lg is 44px (mobile app). */
  size?: SearchBarSize;
  /**
   * Figma `state` (field only). Leave unset in real use: empty, filled and focused follow the
   * text and keyboard focus. `filled` starts with the Figma value "Alfama" when no value is given;
   * `focused` pins the blue focus border (as drawn in the Figma cell).
   */
  state?: SearchBarState;
  /** Field placeholder (Figma `Placeholder`). Say what is searched, e.g. "Search messages". */
  placeholder?: string;
  /** Field text (controlled). */
  value?: string;
  /** Field initial text when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Field: Enter pressed. Stay: Search button pressed. */
  onSearch?: (value?: string) => void;
  /** Field: the clear (x) button pressed. */
  onClear?: () => void;
  /** Accessible name of the field. Defaults to the placeholder. */
  label?: string;
  /** Field `name`, so the text posts with a form. */
  name?: string;
  /** Stay values. */
  where?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

const FILLED_DEFAULT = "Alfama";

function SearchIcon() {
  return (
    <svg className="hz-searchbar__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.35 8.35L11.5 11.5M5.25 1C7.597 1 9.5 2.903 9.5 5.25C9.5 7.597 7.597 9.5 5.25 9.5C2.903 9.5 1 7.597 1 5.25C1 2.903 2.903 1 5.25 1Z" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg className="hz-searchbar__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.75 2.75L9.75 9.75M9.75 2.75L2.75 9.75" />
    </svg>
  );
}

export function SearchBar({
  type = "field",
  size = "md",
  state,
  placeholder = "Search messages",
  value,
  defaultValue,
  onValueChange,
  onSearch,
  onClear,
  label,
  name,
  where = "Lisbon, Portugal",
  checkIn = "14 Sep",
  checkOut = "18 Sep",
  guests = "2 guests, 1 room",
  className,
  ...rest
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue ?? (state === "filled" ? FILLED_DEFAULT : ""));

  if (type === "stay") {
    const parts: Array<[string, string]> = [
      ["Where", where],
      ["Check in", checkIn],
      ["Check out", checkOut],
      ["Guests", guests],
    ];
    return (
      <div
        role="search"
        aria-label="Search stays"
        className={cn("hz-searchbar", "hz-searchbar--stay", "hz-searchbar--lg", className)}
        {...rest}
      >
        {parts.map(([title, text], i) => (
          <Fragment key={title}>
            {i > 0 && <span className="hz-searchbar__divider" aria-hidden="true" />}
            <div className="hz-searchbar__part">
              <span className="hz-searchbar__part-label">{title}</span>
              <span className="hz-searchbar__part-value">{text}</span>
            </div>
          </Fragment>
        ))}
        <Button
          text="Search"
          startIcon={false}
          endIcon={false}
          className="hz-searchbar__button"
          onClick={() => onSearch?.()}
        />
      </div>
    );
  }

  const text = value ?? inner;
  const filled = text !== "";

  const setText = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.(text);
  };
  const clear = () => {
    setText("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      role="search"
      className={cn(
        "hz-searchbar",
        "hz-searchbar--field",
        `hz-searchbar--${size}`,
        state === "focused" && "hz-searchbar--focused",
        className,
      )}
      {...rest}
    >
      <SearchIcon />
      <input
        ref={inputRef}
        className="hz-searchbar__input"
        type="search"
        name={name}
        value={text}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {filled && (
        <button type="button" className="hz-searchbar__clear" aria-label="Clear search" onClick={clear}>
          <ClearIcon />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
